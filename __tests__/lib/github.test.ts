import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error — direct .ts import resolved by --experimental-strip-types + loader
import { readContributions } from '../../app/lib/github.ts';

const MOCK_DATA = {
  totalContributions: 42,
  weeks: [
    {
      contributionDays: [
        { date: '2025-05-01', contributionCount: 3, weekday: 4 },
        { date: '2025-05-02', contributionCount: 0, weekday: 5 },
      ],
    },
  ],
  commits: 30,
  pullRequests: 5,
  codeReviews: 7,
};

function makeResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as unknown as Response;
}

function successResponse() {
  return makeResponse({
    data: {
      user: {
        contributionsCollection: {
          totalCommitContributions: MOCK_DATA.commits,
          totalPullRequestContributions: MOCK_DATA.pullRequests,
          totalPullRequestReviewContributions: MOCK_DATA.codeReviews,
          contributionCalendar: {
            totalContributions: MOCK_DATA.totalContributions,
            weeks: MOCK_DATA.weeks,
          },
        },
      },
    },
  });
}

describe('readContributions', () => {
  beforeEach(() => {
    delete process.env.GITHUB_PAT;
  });

  it('throws when GITHUB_PAT is not set', async () => {
    globalThis.fetch = async () => makeResponse({});
    await assert.rejects(() => readContributions(), /GITHUB_PAT is not set/);
  });

  it('throws when fetch returns a non-OK HTTP status (503)', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({}, false, 503);
    await assert.rejects(() => readContributions(), /status 503/);
  });

  it('throws when fetch returns a non-OK HTTP status (401)', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({}, false, 401);
    await assert.rejects(() => readContributions(), /status 401/);
  });

  it('propagates a network error when fetch itself rejects', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => { throw new Error('Network failure'); };
    await assert.rejects(() => readContributions(), /Network failure/);
  });

  it('throws when the GraphQL response contains an errors array', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({ errors: [{ message: 'Unauthorized' }] });
    await assert.rejects(() => readContributions(), /GraphQL request failed/);
  });

  it('throws when data.user is null', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({ data: { user: null } });
    await assert.rejects(() => readContributions(), /missing contribution calendar/);
  });

  it('throws when contributionsCollection is absent', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({ data: { user: { contributionsCollection: null } } });
    await assert.rejects(() => readContributions(), /missing contribution calendar/);
  });

  it('throws when contributionCalendar key is absent', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({ data: { user: { contributionsCollection: {} } } });
    await assert.rejects(() => readContributions(), /missing contribution calendar/);
  });

  it('returns the full ContributionData shape on success', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.deepEqual(result, MOCK_DATA);
  });

  it('returns correct totalContributions value', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.equal(result.totalContributions, 42);
  });

  it('returns correct weeks array', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.equal(result.weeks.length, 1);
    assert.equal(result.weeks[0].contributionDays.length, 2);
  });

  it('returns correct commits count', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.equal(result.commits, 30);
  });

  it('returns correct pullRequests count', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.equal(result.pullRequests, 5);
  });

  it('returns correct codeReviews count', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => successResponse();
    const result = await readContributions();
    assert.equal(result.codeReviews, 7);
  });

  it('defaults missing stat fields to 0', async () => {
    process.env.GITHUB_PAT = 'test-token';
    globalThis.fetch = async () => makeResponse({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: { totalContributions: 1, weeks: [] },
          },
        },
      },
    });
    const result = await readContributions();
    assert.equal(result.commits, 0);
    assert.equal(result.pullRequests, 0);
    assert.equal(result.codeReviews, 0);
  });

  it('sends a POST request to the GitHub GraphQL endpoint', async () => {
    process.env.GITHUB_PAT = 'test-token';
    let capturedUrl = '';
    let capturedMethod = '';
    globalThis.fetch = async (url, init) => {
      capturedUrl = url as string;
      capturedMethod = (init as RequestInit).method ?? '';
      return successResponse();
    };
    await readContributions();
    assert.equal(capturedUrl, 'https://api.github.com/graphql');
    assert.equal(capturedMethod, 'POST');
  });

  it('sends the correct Bearer Authorization header', async () => {
    process.env.GITHUB_PAT = 'my-secret-pat';
    let capturedAuth = '';
    globalThis.fetch = async (_url, init) => {
      capturedAuth = ((init as RequestInit).headers as Record<string, string>)['Authorization'] ?? '';
      return successResponse();
    };
    await readContributions();
    assert.equal(capturedAuth, 'Bearer my-secret-pat');
  });

  it('sends Content-Type: application/json', async () => {
    process.env.GITHUB_PAT = 'test-token';
    let capturedContentType = '';
    globalThis.fetch = async (_url, init) => {
      capturedContentType = ((init as RequestInit).headers as Record<string, string>)['Content-Type'] ?? '';
      return successResponse();
    };
    await readContributions();
    assert.equal(capturedContentType, 'application/json');
  });

  it('includes a GraphQL query in the request body', async () => {
    process.env.GITHUB_PAT = 'test-token';
    let parsedBody: { query?: string } = {};
    globalThis.fetch = async (_url, init) => {
      parsedBody = JSON.parse((init as RequestInit).body as string) as typeof parsedBody;
      return successResponse();
    };
    await readContributions();
    assert.ok(typeof parsedBody.query === 'string', 'body.query should be a string');
    assert.ok(parsedBody.query.includes('contributionCalendar'), 'query should request contributionCalendar');
  });
});
