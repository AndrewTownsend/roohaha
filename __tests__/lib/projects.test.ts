import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — stub export not in package types
import { __setMockGet } from '@vercel/edge-config';
// @ts-expect-error — direct .ts import resolved by --experimental-strip-types + loader
import { readProjects } from '../../app/lib/projects.ts';
import type { Project } from '../../app/types.ts';

describe('readProjects', () => {
  beforeEach(() => {
    delete process.env.EDGE_CONFIG;
    __setMockGet(async () => null);
  });

  it('returns projects from content/projects.json when EDGE_CONFIG is not set', async () => {
    const result = await readProjects() as Project[];
    assert.ok(Array.isArray(result));
  });

  it('does not call Edge Config when EDGE_CONFIG is not set', async () => {
    let called = false;
    __setMockGet(async () => { called = true; return null; });
    await readProjects();
    assert.equal(called, false);
  });

  it('only returns visible projects from the JSON fallback', async () => {
    const result = await readProjects() as Project[];
    for (const p of result) {
      assert.ok(!('visible' in p) || (p as Project & { visible: boolean }).visible,
        `hidden project "${p.id}" should not be returned`);
    }
  });

  it('returns projects with required fields from JSON fallback', async () => {
    const result = await readProjects() as Project[];
    for (const p of result) {
      assert.ok(typeof p.id === 'string', 'id should be a string');
      assert.ok(typeof p.title === 'string', 'title should be a string');
      assert.ok(typeof p.status === 'string', 'status should be a string');
      assert.ok(typeof p.statusLabel === 'string', 'statusLabel should be a string');
      assert.ok(Array.isArray(p.links), 'links should be an array');
    }
  });

  it('returns projects from Edge Config when EDGE_CONFIG is set', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries = [
      { id: 'test', visible: true, title: 'Test', tagline: '', desc: '', status: 'shipped', statusLabel: 'Shipped', meta: '2025', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjects() as Project[];
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'test');
  });

  it('filters out projects with visible: false', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries = [
      { id: 'visible', visible: true,  title: 'Visible', tagline: '', desc: '', status: 'shipped', statusLabel: 'Shipped', meta: '', links: [] },
      { id: 'hidden',  visible: false, title: 'Hidden',  tagline: '', desc: '', status: 'paused',  statusLabel: 'Paused',  meta: '', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjects() as Project[];
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'visible');
  });

  it('returns [] when all projects are hidden', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries = [
      { id: 'a', visible: false, title: 'A', tagline: '', desc: '', status: 'paused', statusLabel: 'Paused', meta: '', links: [] },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjects() as Project[];
    assert.deepEqual(result, []);
  });

  it('returns [] when Edge Config key is null', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => null);
    const result = await readProjects() as Project[];
    assert.deepEqual(result, []);
  });

  it('returns [] when Edge Config key is undefined', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => undefined);
    const result = await readProjects() as Project[];
    assert.deepEqual(result, []);
  });

  it('preserves link data on returned projects', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockEntries = [
      {
        id: 'linked', visible: true, title: 'Linked', tagline: '', desc: '', status: 'shipped', statusLabel: 'Shipped', meta: '',
        links: [{ kind: 'github', label: 'Source', href: 'https://github.com/example', primary: true }],
      },
    ];
    __setMockGet(async () => mockEntries);
    const result = await readProjects() as Project[];
    assert.equal(result[0].links.length, 1);
    assert.equal(result[0].links[0].kind, 'github');
    assert.equal(result[0].links[0].primary, true);
  });
});
