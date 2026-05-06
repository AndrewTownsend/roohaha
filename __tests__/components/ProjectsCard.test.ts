import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import type { Project } from '../../app/types.ts';

let mockImpl: () => Promise<Project[]>;

const mockReadProjects = mock.fn(async () => mockImpl());

const PROJECTS_LIB_URL = new URL('../../.test-dist/app/lib/projects.js', import.meta.url).href;

await mock.module(PROJECTS_LIB_URL, {
  namedExports: { readProjects: mockReadProjects },
});

const { default: ProjectsCard } = await import(
  '../../.test-dist/app/components/ProjectsCard.js'
) as { default: (props: { projects: Project[] }) => React.ReactElement };

const BUILDING_PROJECT: Project = {
  id: 'buy-in',
  title: 'Buy-In',
  tagline: 'Poker session tracker',
  desc: 'Track buy-ins, cash-outs, hourly rate and session notes.',
  status: 'building',
  statusLabel: 'Building',
  meta: '2026 · iOS',
  links: [
    { kind: 'page', label: 'Project page', href: '/projects/buy-in', primary: true },
    { kind: 'ios', label: 'TestFlight', href: '#' },
  ],
};

const SHIPPED_PROJECT: Project = {
  id: 'roohaha',
  title: 'roohaha.com',
  tagline: 'This site',
  desc: 'Personal portfolio.',
  status: 'shipped',
  statusLabel: 'Open source',
  meta: '2025 · Web',
  links: [
    { kind: 'github', label: 'Source', href: 'https://github.com/example', primary: true },
    { kind: 'web', label: 'Live', href: 'https://roohaha.com' },
  ],
};

const PLANNED_PROJECT: Project = {
  id: 'untitled-4',
  title: 'Untitled #4',
  tagline: 'Idea in the oven',
  desc: '',
  status: 'planned',
  statusLabel: 'Planned',
  meta: '2026',
  links: [],
};

function render(projects: Project[]): string {
  return renderToString(ProjectsCard({ projects }));
}

describe('ProjectsCard', () => {
  beforeEach(() => {
    mockReadProjects.mock.resetCalls();
  });

  it('renders the "Projects" section label', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('Projects'), `expected "Projects" section label in HTML:\n${html}`);
  });

  it('renders a project title', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('Buy-In'), `expected project title "Buy-In" in HTML:\n${html}`);
  });

  it('renders the project description', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('Track buy-ins'), `expected description text in HTML:\n${html}`);
  });

  it('renders the status label', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('Building'), `expected status label "Building" in HTML:\n${html}`);
  });

  it('renders the meta text', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('2026'), `expected meta text in HTML:\n${html}`);
  });

  it('renders link chip labels', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('Project page'), `expected "Project page" chip in HTML:\n${html}`);
    assert.ok(html.includes('TestFlight'), `expected "TestFlight" chip in HTML:\n${html}`);
  });

  it('renders link chip hrefs', () => {
    const html = render([SHIPPED_PROJECT]);
    assert.ok(html.includes('href="https://github.com/example"'), `expected github href in HTML:\n${html}`);
    assert.ok(html.includes('href="https://roohaha.com"'), `expected live href in HTML:\n${html}`);
  });

  it('applies pj-chip-primary class to primary links', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('pj-chip-primary'), `expected "pj-chip-primary" class in HTML:\n${html}`);
  });

  it('does not render a link chip row when project has no links', () => {
    const html = render([PLANNED_PROJECT]);
    assert.ok(!html.includes('pj-chip'), `expected no chip elements for planned project:\n${html}`);
  });

  it('renders multiple projects', () => {
    const html = render([BUILDING_PROJECT, SHIPPED_PROJECT]);
    assert.ok(html.includes('Buy-In'), 'expected first project title');
    assert.ok(html.includes('roohaha.com'), 'expected second project title');
  });

  it('renders planned status label', () => {
    const html = render([PLANNED_PROJECT]);
    assert.ok(html.includes('Planned'), `expected "Planned" status label in HTML:\n${html}`);
  });

  it('does not render a description element when desc is empty', () => {
    const html = render([PLANNED_PROJECT]);
    assert.ok(!html.includes('<p'), `expected no <p> element for empty description:\n${html}`);
  });

  it('renders an empty list without crashing', () => {
    assert.doesNotThrow(() => render([]));
  });

  it('renders the pj-container class for container query support', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('pj-container'), `expected "pj-container" class in HTML:\n${html}`);
  });

  it('renders the pj-meta class on the meta span', () => {
    const html = render([BUILDING_PROJECT]);
    assert.ok(html.includes('pj-meta'), `expected "pj-meta" class in HTML:\n${html}`);
  });

  it('renders all four status types without throwing', () => {
    const statuses: Project['status'][] = ['building', 'shipped', 'paused', 'planned'];
    for (const status of statuses) {
      const project: Project = { ...BUILDING_PROJECT, id: status, status, statusLabel: status };
      assert.doesNotThrow(() => render([project]), `crashed rendering status "${status}"`);
    }
  });

  it('renders all link kinds without throwing', () => {
    const kinds: Array<Project['links'][number]['kind']> = ['github', 'ios', 'android', 'web', 'page'];
    for (const kind of kinds) {
      const project: Project = {
        ...BUILDING_PROJECT,
        id: kind,
        links: [{ kind, label: kind, href: '#' }],
      };
      assert.doesNotThrow(() => render([project]), `crashed rendering link kind "${kind}"`);
    }
  });
});
