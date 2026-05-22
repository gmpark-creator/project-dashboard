import { reportData } from './report-data.js';

const $ = (selector) => document.querySelector(selector);
let activeProjectId = reportData.projects[0].id;
let activePreviewIndex = 0;

function healthMeta(health) {
  return {
    strong: { label: '운영 가능', tone: 'strong' },
    paused: { label: '보류 판단', tone: 'paused' },
    active: { label: '개발 중', tone: 'active' },
  }[health] || { label: '검토 중', tone: 'active' };
}

function renderSummary() {
  $('#summary-cards').innerHTML = reportData.projects.map((project) => {
    const meta = healthMeta(project.health);
    return `
      <button class="summary-card project-${project.id} ${project.id === activeProjectId ? 'is-active' : ''}" data-project="${project.id}">
        <span class="order">${project.order}</span>
        <span class="state ${meta.tone}">${project.state}</span>
        <strong>${project.label}</strong>
        <p>${project.verdict}</p>
        <div class="progress" aria-label="${project.progress}% 진행">
          <span style="width:${project.progress}%"></span>
        </div>
      </button>
    `;
  }).join('');

  document.querySelectorAll('.summary-card').forEach((button) => {
    button.addEventListener('click', () => selectProject(button.dataset.project));
  });
}

function renderTabs() {
  $('#project-tabs').innerHTML = reportData.projects.map((project) => {
    const meta = healthMeta(project.health);
    return `
      <button class="project-tab project-${project.id} ${project.id === activeProjectId ? 'is-active' : ''}" data-project="${project.id}">
        <span>${project.order}</span>
        <strong>${project.name}</strong>
        <small>${meta.label}</small>
      </button>
    `;
  }).join('');

  document.querySelectorAll('.project-tab').forEach((button) => {
    button.addEventListener('click', () => selectProject(button.dataset.project));
  });
}

function list(items, className = '') {
  return `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function renderDetail() {
  const project = reportData.projects.find((item) => item.id === activeProjectId);
  const meta = healthMeta(project.health);
  activePreviewIndex = Math.min(activePreviewIndex, project.links.length - 1);
  const preview = project.links[activePreviewIndex];

  $('#detail-label').textContent = `${project.order} / ${project.name}`;
  $('#detail-title').textContent = project.label;
  $('#detail-summary').textContent = project.summary;
  $('#detail-status').className = `status-pill ${meta.tone}`;
  $('#detail-status').innerHTML = `<span>${project.progress}%</span><strong>${project.state}</strong>`;

  $('#meta-grid').innerHTML = [
    ['판단', project.verdict],
    ['스택', project.stack.join(' / ')],
    ['결과물', project.links.map((link) => `${link.label} (${link.probe})`).join(' / ')],
  ].map(([key, value]) => `
    <div class="meta-card">
      <span>${key}</span>
      <strong>${value}</strong>
    </div>
  `).join('');

  $('#review-list').innerHTML = list(project.review);
  $('#risk-list').innerHTML = project.risks.map((risk) => `
    <article class="risk-item ${risk.level}">
      <span>${risk.level}</span>
      <p>${risk.text}</p>
    </article>
  `).join('');

  $('#preview-switcher').innerHTML = project.links.map((link, index) => `
    <button class="${index === activePreviewIndex ? 'is-active' : ''}" data-preview="${index}">
      <strong>${link.label}</strong>
      <span>${link.probe} / ${link.note}</span>
    </button>
  `).join('');

  document.querySelectorAll('#preview-switcher button').forEach((button) => {
    button.addEventListener('click', () => {
      activePreviewIndex = Number(button.dataset.preview);
      renderDetail();
    });
  });

  $('#preview-frame').src = preview.url;
  $('#preview-open').href = preview.url;
  $('#preview-open').textContent = `새 탭에서 결과물 열기: ${preview.url}`;
}

function renderMatrix() {
  $('#matrix-grid').innerHTML = reportData.improvements.map((item) => `
    <article>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join('');

  $('#action-list').innerHTML = reportData.actions.map((item) => `<li>${item}</li>`).join('');
}

function selectProject(projectId) {
  activeProjectId = projectId;
  activePreviewIndex = 0;
  renderSummary();
  renderTabs();
  renderDetail();
}

function init() {
  document.documentElement.dataset.generatedAt = reportData.generatedAt;
  renderSummary();
  renderTabs();
  renderDetail();
  renderMatrix();
}

init();
