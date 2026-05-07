import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — stub export not in package types
import { __setMockGet } from '@vercel/edge-config';
// @ts-expect-error — direct .ts import resolved by --experimental-strip-types + loader
import { readProjectsForAdmin } from '../../app/lib/projects-admin.ts';
import type { AdminProject } from '../../app/lib/projects-admin.ts';

describe('readProjectsForAdmin', () => {
  beforeEach(() => {
    delete process.env.EDGE_CONFIG;
    __setMockGet(async () => null);
  });

  it('returns projects from content/projects.json when EDGE_CONFIG is not set', async () => {
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
  });

  it('does not call Edge Config when EDGE_CONFIG is not set', async () => {
    let called = false;
    __setMockGet(async () => { called = true; return null; });
    await readProjectsForAdmin();
    assert.equal(called, false);
  });

  it('includes the visible field on every entry from the JSON fallback', async () => {
    const result = await readProjectsForAdmin() as AdminProject[];
    for (const p of result) {
      assert.ok('visible' in p, `entry "${p.id}" is missing the visible field`);
      assert.equal(typeof p.visible, 'boolean');
    }
  });

  it('returns all projects including hidden ones from Edge Config', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries: AdminProject[] = [
      { id: 'visible-one', visible: true,  title: 'Visible', tagline: '', desc: '', status: 'shipped', statusLabel: 'Shipped', meta: '', links: [] },
      { id: 'hidden-one',  visible: false, title: 'Hidden',  tagline: '', desc: '', status: 'paused',  statusLabel: 'Paused',  meta: '', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.equal(result.length, 2);
    assert.ok(result.some((p) => p.id === 'visible-one'));
    assert.ok(result.some((p) => p.id === 'hidden-one'));
  });

  it('does not filter out projects with visible: false', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries: AdminProject[] = [
      { id: 'a', visible: false, title: 'A', tagline: '', desc: '', status: 'paused', statusLabel: 'Paused', meta: '', links: [] },
      { id: 'b', visible: false, title: 'B', tagline: '', desc: '', status: 'planned', statusLabel: 'Planning', meta: '', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.equal(result.length, 2);
  });

  it('returns [] when Edge Config key is null', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => null);
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.deepEqual(result, []);
  });

  it('returns [] when Edge Config key is undefined', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => undefined);
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.deepEqual(result, []);
  });

  it('preserves required project fields', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries: AdminProject[] = [
      { id: 'test', visible: true, title: 'Test', tagline: 'A tagline', desc: 'A desc', status: 'building', statusLabel: 'Building', meta: '2026 · Web', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjectsForAdmin() as AdminProject[];
    const p = result[0];
    assert.equal(p.id, 'test');
    assert.equal(p.title, 'Test');
    assert.equal(p.tagline, 'A tagline');
    assert.equal(p.status, 'building');
    assert.equal(p.meta, '2026 · Web');
    assert.equal(p.visible, true);
  });

  it('preserves link data', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries: AdminProject[] = [
      {
        id: 'linked', visible: true, title: 'Linked', tagline: '', desc: '', status: 'shipped', statusLabel: 'Shipped', meta: '',
        links: [{ kind: 'github', label: 'Source', href: 'https://github.com/example', primary: true }],
      },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjectsForAdmin() as AdminProject[];
    assert.equal(result[0].links.length, 1);
    assert.equal(result[0].links[0].kind, 'github');
    assert.equal(result[0].links[0].primary, true);
  });
});
