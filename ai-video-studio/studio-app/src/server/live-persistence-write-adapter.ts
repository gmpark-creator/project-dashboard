import { randomUUID } from "node:crypto";
import type { DirectionSpec, EditState, Project, Shot } from "../domain/types";
import type { Aspect, ImageAsset, ImageAssetRole, ReferenceBoard } from "../domain/types";
import {
  buildLiveDefaultEditState,
  buildLiveDefaultReferenceBoard,
  buildLiveProjectCreateRecords,
  type LiveProjectCreateInput
} from "./live-project-builder";
import type { PgQueryable } from "./live-persistence-migrations";
import { PostgresLivePersistenceReadAdapter } from "./live-persistence-read-adapter";

type Row = Record<string, unknown>;
export type LiveEditAudioPatch = Partial<Pick<EditState, "captions" | "bgm" | "voiceover" | "transitions">>;
export type LiveExternalImageInput = {
  projectId: string;
  label: string;
  role: ImageAssetRole;
  url: string;
  aspect?: Aspect;
  prompt?: string;
  rightsConfirmed?: boolean;
};
type ReferenceBoardImageBucket = keyof Pick<
  ReferenceBoard,
  "productImages" | "characterImages" | "locationImages" | "styleImages" | "keyframes" | "thumbnails" | "logos" | "backgrounds"
>;

function now() {
  return new Date().toISOString();
}

function json(value: unknown) {
  return JSON.stringify(value);
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

function jsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || typeof value === "undefined") return fallback;
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function nullableString(value: unknown) {
  return value === null || typeof value === "undefined" ? null : String(value);
}

function rowShot(row: Row): Shot {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    sceneId: String(row.scene_id),
    order: Number(row.order_index),
    title: String(row.title),
    durationSec: Number(row.duration_sec),
    saec: jsonValue<Shot["saec"]>(row.saec, {
      subject: "",
      action: "",
      environment: "",
      camera: "",
      framing: "",
      lighting: "",
      style: "",
      negative: ""
    }),
    requirements: jsonValue<Shot["requirements"]>(row.requirements, {
      tier: "fast",
      aspect: "9:16",
      imageToVideo: false,
      needsLipsyncAudio: false,
      motionHeavy: false,
      characterLock: false,
      characterId: null,
      region: "global"
    }),
    status: row.status as Shot["status"],
    selectedTakeId: nullableString(row.selected_take_id),
    qualityFlags: jsonValue<Shot["qualityFlags"]>(row.quality_flags, []),
    referenceImageIds: jsonValue<Shot["referenceImageIds"]>(row.reference_image_ids, []),
    directionSpec: jsonValue<Shot["directionSpec"]>(row.direction_spec, {
      camera: "",
      composition: "",
      lighting: "",
      motion: "",
      style: "",
      avoid: [],
      notes: ""
    })
  };
}

function imageSize(aspect: Aspect) {
  return (
    {
      "9:16": { width: 1080, height: 1920 },
      "16:9": { width: 1920, height: 1080 },
      "1:1": { width: 1536, height: 1536 },
      "4:5": { width: 1280, height: 1600 }
    } satisfies Record<Aspect, { width: number; height: number }>
  )[aspect];
}

function boardBucket(role: ImageAssetRole): ReferenceBoardImageBucket {
  return (
    {
      product: "productImages",
      character: "characterImages",
      location: "locationImages",
      style: "styleImages",
      keyframe: "keyframes",
      thumbnail: "thumbnails",
      logo: "logos",
      background: "backgrounds"
    } satisfies Record<ImageAssetRole, ReferenceBoardImageBucket>
  )[role];
}

function mergeDirectionPatch(current: DirectionSpec, patch: Partial<DirectionSpec>): DirectionSpec {
  return {
    ...current,
    ...patch,
    avoid: patch.avoid ? patch.avoid.map((item) => item.trim()).filter(Boolean) : current.avoid
  };
}

function projectStatusFromShots(shots: Array<{ status: string; selected_take_id: unknown }>) {
  const hasRunning = shots.some((shot) => shot.status === "generating");
  const hasReview = shots.some((shot) => shot.status === "reviewing" || shot.status === "failed");
  const selectedCount = shots.filter((shot) => Boolean(shot.selected_take_id)).length;
  return hasRunning ? "generating" : hasReview ? "reviewing" : selectedCount ? "edited" : "storyboarded";
}

function projectProgressFromShots(shots: Array<{ status: string; selected_take_id: unknown }>) {
  return {
    shotsDone: shots.filter((shot) => Boolean(shot.selected_take_id) || shot.status === "reviewing" || shot.status === "selected").length,
    shotsTotal: shots.length
  };
}

function rowEditState(row: Row | null, projectId: string): EditState {
  if (!row) return buildLiveDefaultEditState(projectId);
  return {
    projectId,
    captions: jsonValue<EditState["captions"]>(row.captions, buildLiveDefaultEditState(projectId).captions),
    bgm: jsonValue<EditState["bgm"]>(row.bgm, buildLiveDefaultEditState(projectId).bgm),
    voiceover: jsonValue<EditState["voiceover"]>(row.voiceover, buildLiveDefaultEditState(projectId).voiceover),
    transitions: row.transitions as EditState["transitions"],
    commands: jsonValue<EditState["commands"]>(row.commands, [])
  };
}

function rowReferenceBoard(row: Row | null, projectId: string): ReferenceBoard {
  if (!row) return buildLiveDefaultReferenceBoard(projectId);
  return {
    projectId,
    productImages: jsonValue<ReferenceBoard["productImages"]>(row.product_images, []),
    characterImages: jsonValue<ReferenceBoard["characterImages"]>(row.character_images, []),
    locationImages: jsonValue<ReferenceBoard["locationImages"]>(row.location_images, []),
    styleImages: jsonValue<ReferenceBoard["styleImages"]>(row.style_images, []),
    keyframes: jsonValue<ReferenceBoard["keyframes"]>(row.keyframes, []),
    thumbnails: jsonValue<ReferenceBoard["thumbnails"]>(row.thumbnails, []),
    logos: jsonValue<ReferenceBoard["logos"]>(row.logos, []),
    backgrounds: jsonValue<ReferenceBoard["backgrounds"]>(row.backgrounds, []),
    usages: []
  };
}

export class PostgresLivePersistenceWriteAdapter {
  constructor(private readonly client: PgQueryable) {}

  private async requireProject(projectId: string) {
    const projects = await this.client.query<Row>("SELECT id FROM cutpilot_projects WHERE id = $1 FOR UPDATE", [projectId]);
    if (!projects.rows[0]) throw new Error("Project not found");
  }

  private async getLockedEditState(projectId: string) {
    const rows = await this.client.query<Row>("SELECT * FROM cutpilot_project_edit_states WHERE project_id = $1 FOR UPDATE", [projectId]);
    return rowEditState(rows.rows[0] || null, projectId);
  }

  private async upsertEditState(editState: EditState, updatedAt: string) {
    const rows = await this.client.query<Row>(
      `
      INSERT INTO cutpilot_project_edit_states (project_id, captions, bgm, voiceover, transitions, commands, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (project_id) DO UPDATE SET
        captions = EXCLUDED.captions,
        bgm = EXCLUDED.bgm,
        voiceover = EXCLUDED.voiceover,
        transitions = EXCLUDED.transitions,
        commands = EXCLUDED.commands,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `,
      [
        editState.projectId,
        json(editState.captions),
        json(editState.bgm),
        json(editState.voiceover),
        editState.transitions,
        json(editState.commands),
        updatedAt
      ]
    );
    return rowEditState(rows.rows[0] || null, editState.projectId);
  }

  private async upsertReferenceBoard(board: ReferenceBoard, updatedAt: string) {
    await this.client.query(
      `
      INSERT INTO cutpilot_reference_boards (
        project_id, product_images, character_images, location_images, style_images,
        keyframes, thumbnails, logos, backgrounds, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (project_id) DO UPDATE SET
        product_images = EXCLUDED.product_images,
        character_images = EXCLUDED.character_images,
        location_images = EXCLUDED.location_images,
        style_images = EXCLUDED.style_images,
        keyframes = EXCLUDED.keyframes,
        thumbnails = EXCLUDED.thumbnails,
        logos = EXCLUDED.logos,
        backgrounds = EXCLUDED.backgrounds,
        updated_at = EXCLUDED.updated_at
    `,
      [
        board.projectId,
        json(board.productImages),
        json(board.characterImages),
        json(board.locationImages),
        json(board.styleImages),
        json(board.keyframes),
        json(board.thumbnails),
        json(board.logos),
        json(board.backgrounds),
        updatedAt
      ]
    );
  }

  async createProject(input: LiveProjectCreateInput): Promise<Project> {
    const records = buildLiveProjectCreateRecords(input);
    await this.client.query("BEGIN");
    try {
      await this.client.query(
        `
        INSERT INTO cutpilot_credit_accounts (id, balance_credits, spent_credits, reserved_credits, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [records.creditAccountId, 1240, 0, 0, records.project.createdAt, records.project.updatedAt]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_projects (
          id, credit_account_id, title, idea, intent, status, aspect, target_duration_sec,
          progress, characters, thumb_url, default_render_job_id, credits, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          records.project.id,
          records.creditAccountId,
          records.project.title,
          records.project.idea,
          records.project.intent,
          records.project.status,
          records.project.aspect,
          records.project.targetDurationSec,
          json(records.project.progress),
          json(records.project.characters),
          records.project.thumbUrl,
          records.project.defaultRenderJobId,
          json(records.project.credits),
          records.project.createdAt,
          records.project.updatedAt
        ]
      );
      for (const scene of records.scenes) {
        await this.client.query(
          `
          INSERT INTO cutpilot_scenes (id, project_id, order_index, title, setting, time_of_day)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [scene.id, scene.projectId, scene.order, scene.title, scene.setting, scene.timeOfDay]
        );
      }
      for (const shot of records.shots) {
        await this.client.query(
          `
          INSERT INTO cutpilot_shots (
            id, project_id, scene_id, order_index, title, duration_sec, saec, requirements,
            status, selected_take_id, quality_flags, reference_image_ids, direction_spec
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `,
          [
            shot.id,
            shot.projectId,
            shot.sceneId,
            shot.order,
            shot.title,
            shot.durationSec,
            json(shot.saec),
            json(shot.requirements),
            shot.status,
            shot.selectedTakeId,
            json(shot.qualityFlags),
            json(shot.referenceImageIds),
            json(shot.directionSpec)
          ]
        );
      }
      await this.client.query(
        `
        INSERT INTO cutpilot_reference_boards (
          project_id, product_images, character_images, location_images, style_images,
          keyframes, thumbnails, logos, backgrounds, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
        [
          records.project.id,
          json(records.referenceBoard.productImages),
          json(records.referenceBoard.characterImages),
          json(records.referenceBoard.locationImages),
          json(records.referenceBoard.styleImages),
          json(records.referenceBoard.keyframes),
          json(records.referenceBoard.thumbnails),
          json(records.referenceBoard.logos),
          json(records.referenceBoard.backgrounds),
          records.project.updatedAt
        ]
      );
      await this.client.query(
        `
        INSERT INTO cutpilot_project_edit_states (project_id, captions, bgm, voiceover, transitions, commands, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          records.project.id,
          json(records.editState.captions),
          json(records.editState.bgm),
          json(records.editState.voiceover),
          records.editState.transitions,
          json(records.editState.commands),
          records.project.updatedAt
        ]
      );
      await this.client.query("COMMIT");
      return records.project;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async updateShotDirection(shotId: string, patch: Partial<DirectionSpec>): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const currentRow = shots.rows[0];
      if (!currentRow) throw new Error("Shot not found");

      const current = rowShot(currentRow);
      const directionSpec = mergeDirectionPatch(current.directionSpec, patch);
      const updated = await this.client.query<Row>("UPDATE cutpilot_shots SET direction_spec = $2::jsonb WHERE id = $1 RETURNING *", [
        shotId,
        json(directionSpec)
      ]);
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...currentRow, direction_spec: directionSpec });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async selectTake(shotId: string, takeId: string): Promise<Shot> {
    await this.client.query("BEGIN");
    try {
      const shots = await this.client.query<Row>("SELECT * FROM cutpilot_shots WHERE id = $1 FOR UPDATE", [shotId]);
      const currentRow = shots.rows[0];
      if (!currentRow) throw new Error("Selectable take not found");
      const current = rowShot(currentRow);

      const takes = await this.client.query<Row>("SELECT * FROM cutpilot_takes WHERE id = $1 AND shot_id = $2 AND project_id = $3 LIMIT 1 FOR UPDATE", [
        takeId,
        shotId,
        current.projectId
      ]);
      const take = takes.rows[0];
      if (!take || take.status !== "done") throw new Error("Selectable take not found");

      const updated = await this.client.query<Row>(
        "UPDATE cutpilot_shots SET selected_take_id = $2, status = $3 WHERE id = $1 RETURNING *",
        [shotId, takeId, "selected"]
      );
      const projectShots = await this.client.query<Row>("SELECT status, selected_take_id FROM cutpilot_shots WHERE project_id = $1", [current.projectId]);
      await this.client.query("UPDATE cutpilot_projects SET progress = $2, status = $3, updated_at = $4 WHERE id = $1", [
        current.projectId,
        json(projectProgressFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>)),
        projectStatusFromShots(projectShots.rows as Array<{ status: string; selected_take_id: unknown }>),
        now()
      ]);
      await this.client.query("COMMIT");
      return rowShot(updated.rows[0] || { ...currentRow, selected_take_id: takeId, status: "selected" });
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async applyEdit(projectId: string, command?: string): Promise<EditState> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const updatedAt = now();
      const current = await this.getLockedEditState(projectId);
      const editState: EditState = {
        ...current,
        commands: command ? [...current.commands, { command, createdAt: updatedAt }] : current.commands
      };
      const updated = await this.upsertEditState(editState, updatedAt);
      await this.client.query("UPDATE cutpilot_projects SET status = $2, updated_at = $3 WHERE id = $1", [projectId, "edited", updatedAt]);
      await this.client.query("COMMIT");
      return updated;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async setAudio(projectId: string, patch: LiveEditAudioPatch): Promise<EditState> {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const updatedAt = now();
      const current = await this.getLockedEditState(projectId);
      const editState: EditState = { ...current, ...patch };
      const updated = await this.upsertEditState(editState, updatedAt);
      await this.client.query("UPDATE cutpilot_projects SET updated_at = $2 WHERE id = $1", [projectId, updatedAt]);
      await this.client.query("COMMIT");
      return updated;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async setDefaultRender(projectId: string, renderJobId: string) {
    await this.client.query("BEGIN");
    try {
      await this.requireProject(projectId);
      const renderJobs = await this.client.query<Row>(
        "SELECT * FROM cutpilot_render_jobs WHERE id = $1 AND project_id = $2 LIMIT 1 FOR UPDATE",
        [renderJobId, projectId]
      );
      const renderJob = renderJobs.rows[0];
      if (!renderJob) throw new Error("Render job not found");
      if (renderJob.status !== "done") throw new Error("Only completed renders can be the default version");

      const updatedAt = now();
      const thumbUrl = nullableString(renderJob.output_url) || nullableString(renderJob.share_url);
      await this.client.query("UPDATE cutpilot_projects SET default_render_job_id = $2, thumb_url = $3, updated_at = $4 WHERE id = $1", [
        projectId,
        renderJobId,
        thumbUrl,
        updatedAt
      ]);
      const bundle = await new PostgresLivePersistenceReadAdapter(this.client).getProjectBundle(projectId);
      await this.client.query("COMMIT");
      return bundle;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }

  async registerExternalImage(input: LiveExternalImageInput): Promise<ImageAsset> {
    await this.client.query("BEGIN");
    try {
      const projects = await this.client.query<Row>("SELECT id, aspect FROM cutpilot_projects WHERE id = $1 FOR UPDATE", [input.projectId]);
      const project = projects.rows[0];
      if (!project) throw new Error("Project not found");

      const timestamp = now();
      const aspect = input.aspect || (project.aspect as Aspect);
      const size = imageSize(aspect);
      const label = input.label.trim();
      const url = input.url.trim();
      const asset: ImageAsset = {
        id: uid("img"),
        projectId: input.projectId,
        kind: "image",
        role: input.role,
        source: "external",
        label,
        prompt: input.prompt?.trim() || "External image",
        url,
        thumbUrl: url,
        aspect,
        width: size.width,
        height: size.height,
        rights: {
          status: input.rightsConfirmed ? "user_confirmed" : "needs_review",
          note: input.rightsConfirmed ? "User confirmed image usage rights." : "Image usage rights require review."
        },
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await this.client.query(
        `
        INSERT INTO cutpilot_image_assets (
          id, project_id, kind, role, source, label, prompt, url, thumb_url,
          aspect, width, height, rights, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          asset.id,
          asset.projectId,
          asset.kind,
          asset.role,
          asset.source,
          asset.label,
          asset.prompt,
          asset.url,
          asset.thumbUrl,
          asset.aspect,
          asset.width,
          asset.height,
          json(asset.rights),
          asset.createdAt,
          asset.updatedAt
        ]
      );

      const boardRows = await this.client.query<Row>("SELECT * FROM cutpilot_reference_boards WHERE project_id = $1 FOR UPDATE", [input.projectId]);
      const board = rowReferenceBoard(boardRows.rows[0] || null, input.projectId);
      const bucket = boardBucket(asset.role);
      if (!board[bucket].includes(asset.id)) board[bucket] = [...board[bucket], asset.id];
      await this.upsertReferenceBoard(board, timestamp);
      await this.client.query("UPDATE cutpilot_projects SET updated_at = $2 WHERE id = $1", [input.projectId, timestamp]);
      await this.client.query("COMMIT");
      return asset;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    }
  }
}
