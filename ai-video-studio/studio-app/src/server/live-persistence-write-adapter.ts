import type { Project } from "../domain/types";
import { buildLiveProjectCreateRecords, type LiveProjectCreateInput } from "./live-project-builder";
import type { PgQueryable } from "./live-persistence-migrations";

function json(value: unknown) {
  return JSON.stringify(value);
}

export class PostgresLivePersistenceWriteAdapter {
  constructor(private readonly client: PgQueryable) {}

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
}
