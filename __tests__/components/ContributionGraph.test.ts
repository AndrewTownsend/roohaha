import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import type { ContributionData } from '../../app/lib/github.ts';

let mockImpl: () => Promise<ContributionData>;

const mockReadContributions = mock.fn(async () => mockImpl());

const GITHUB_LIB_URL = new URL('../../.test-dist/app/lib/github.js', import.meta.url).href;

await mock.module(GITHUB_LIB_URL, {
  namedExports: { readContributions: mockReadContributions },
});

const { default: ContributionGraph } = await import(
  '../../.test-dist/app/components/ContributionGraph.js'
) as { default: () => Promise<React.ReactElement | null> };

const EMPTY_CALENDAR: ContributionData = {
  totalContributions: 0,
  weeks: [],
  commits: 0,
  pullRequests: 0,
  codeReviews: 0,
};

function makeCalendar(totalContributions = 365): ContributionData {
  const week1 = {
    contributionDays: [
      { date: '2025-01-05', contributionCount: 0,  weekday: 0 },
      { date: '2025-01-06', contributionCount: 1,  weekday: 1 },
      { date: '2025-01-07', contributionCount: 2,  weekday: 2 },
      { date: '2025-01-08', contributionCount: 4,  weekday: 3 },
      { date: '2025-01-09', contributionCount: 7,  weekday: 4 },
      { date: '2025-01-10', contributionCount: 10, weekday: 5 },
      { date: '2025-01-11', contributionCount: 0,  weekday: 6 },
    ],
  };
  const week2 = {
    contributionDays: [
      { date: '2025-02-02', contributionCount: 3, weekday: 0 },
      { date: '2025-02-03', contributionCount: 0, weekday: 1 },
    ],
  };
  return { totalContributions, weeks: [week1, week2], commits: 42, pullRequests: 8, codeReviews: 15 };
}

function renderComponent(el: React.ReactElement | null): string {
  if (el === null) return '';
  return renderToString(el);
}

describe('ContributionGraph', () => {
  beforeEach(() => {
    mockReadContributions.mock.resetCalls();
  });

  it('returns null when readContributions throws (GitHub unreachable)', async () => {
    mockImpl = async () => { throw new Error('GitHub is down'); };
    const result = await ContributionGraph();
    assert.equal(result, null);
  });

  it('returns null when readContributions rejects with a network error', async () => {
    mockImpl = async () => { throw new TypeError('Failed to fetch'); };
    const result = await ContributionGraph();
    assert.equal(result, null);
  });

  it('returns null when readContributions rejects due to missing PAT', async () => {
    mockImpl = async () => { throw new Error('GITHUB_PAT is not set'); };
    const result = await ContributionGraph();
    assert.equal(result, null);
  });

  it('returns a non-null React element when data is available', async () => {
    mockImpl = async () => makeCalendar();
    const result = await ContributionGraph();
    assert.ok(result !== null, 'expected a React element, got null');
  });

  it('renders the "GitHub Activity" section label', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('GitHub Activity'), `expected "GitHub Activity" in HTML:\n${html}`);
  });

  it('renders the commits count', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('42'), `expected commits count "42" in HTML:\n${html}`);
  });

  it('renders the "Commits" label', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Commits'), `expected "Commits" label in HTML:\n${html}`);
  });

  it('renders the pull requests count', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('8'), `expected pull requests count "8" in HTML:\n${html}`);
  });

  it('renders the "Pull Requests" label', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Pull Requests'), `expected "Pull Requests" label in HTML:\n${html}`);
  });

  it('renders the code reviews count', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('15'), `expected code reviews count "15" in HTML:\n${html}`);
  });

  it('renders the "Code Reviews" label', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Code Reviews'), `expected "Code Reviews" label in HTML:\n${html}`);
  });

  it('renders the correct total contribution count', async () => {
    mockImpl = async () => makeCalendar(1234);
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('1,234'), `expected "1,234" in HTML:\n${html}`);
  });

  it('renders "contributions in the last year" summary text', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('contributions in the last year'), `expected summary text in HTML:\n${html}`);
  });

  it('renders a "Jan" month label when data contains a January week', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Jan'), `expected "Jan" month label in HTML:\n${html}`);
  });

  it('renders a "Feb" month label when data crosses into February', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Feb'), `expected "Feb" month label in HTML:\n${html}`);
  });

  it('renders day cells with title attributes containing dates', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('2025-01-05'), `expected cell title with date "2025-01-05" in HTML:\n${html}`);
  });

  it('renders the correct tooltip for a cell with contributions', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('1 contribution'), `expected "1 contribution" tooltip in HTML:\n${html}`);
  });

  it('renders the correct plural tooltip for a cell with multiple contributions', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('2 contributions'), `expected "2 contributions" tooltip in HTML:\n${html}`);
  });

  it('applies the empty-cell colour (#eef1f5) for zero contributions', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('#eef1f5'), `expected empty-cell colour #eef1f5 in HTML:\n${html}`);
  });

  it('applies the full-accent colour (#4a7fa5) for high contribution counts (≥7)', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('#4a7fa5'), `expected full-accent colour #4a7fa5 in HTML:\n${html}`);
  });

  it('renders without crashing for an empty weeks array', async () => {
    mockImpl = async () => EMPTY_CALENDAR;
    const result = await ContributionGraph();
    assert.ok(result !== null, 'should still render a card even with no weeks');
    const html = renderComponent(result);
    assert.ok(html.includes('0'), 'total contributions should be 0');
  });

  it('shows a zero contribution count and summary phrase for empty data', async () => {
    mockImpl = async () => EMPTY_CALENDAR;
    const html = renderComponent(await ContributionGraph());
    assert.ok(
      html.includes('>0<') || html.includes('>0<!--'),
      `expected "0" in the contributions paragraph`,
    );
    assert.ok(html.includes('contributions in the last year'), `expected "contributions in the last year" in HTML:\n${html}`);
  });

  it('renders day-of-week labels (Mon, Wed, Fri)', async () => {
    mockImpl = async () => makeCalendar();
    const html = renderComponent(await ContributionGraph());
    assert.ok(html.includes('Mon'), 'expected Mon label');
    assert.ok(html.includes('Wed'), 'expected Wed label');
    assert.ok(html.includes('Fri'), 'expected Fri label');
  });
});
