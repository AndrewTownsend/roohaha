import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — stub export not in package types
import { __setMockGet } from '@vercel/edge-config';
// @ts-expect-error — direct .ts import resolved by --experimental-strip-types + loader
import { readFeatureGates, DEFAULT_GATES } from '../../app/lib/feature-gates.ts';
import type { FeatureGates } from '../../app/lib/feature-gates.ts';

describe('readFeatureGates', () => {
  beforeEach(() => {
    delete process.env.EDGE_CONFIG;
    __setMockGet(async () => null);
  });

  it('returns DEFAULT_GATES when EDGE_CONFIG is not set', async () => {
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, DEFAULT_GATES);
  });

  it('does not call Edge Config client when EDGE_CONFIG is not set', async () => {
    let called = false;
    __setMockGet(async () => { called = true; return null; });
    await readFeatureGates();
    assert.equal(called, false);
  });

  it('all flags are enabled by default', () => {
    assert.equal(DEFAULT_GATES.githubGraph, true);
    assert.equal(DEFAULT_GATES.writing, true);
  });

  it('returns gates from Edge Config when EDGE_CONFIG is set', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    const mockGates: FeatureGates = { githubGraph: false, writing: true };
    __setMockGet(async () => mockGates);
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, mockGates);
  });

  it('uses stored value for githubGraph and defaults writing to false when absent', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => ({ githubGraph: true }));
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: true, writing: false });
  });

  it('uses stored value for writing and defaults githubGraph to false when absent', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => ({ writing: true }));
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: false, writing: true });
  });

  it('returns all-false when Edge Config key is missing (null)', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => null);
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: false, writing: false });
  });

  it('returns all-false when Edge Config key is missing (undefined)', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => undefined);
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: false, writing: false });
  });

  it('defaults missing individual flags to false when key is a partial object', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => ({}));
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: false, writing: false });
  });

  it('returns all gates disabled when Edge Config explicitly disables all', async () => {
    process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test';
    __setMockGet(async () => ({ githubGraph: false, writing: false }));
    const result = await readFeatureGates() as FeatureGates;
    assert.deepEqual(result, { githubGraph: false, writing: false });
  });
});
