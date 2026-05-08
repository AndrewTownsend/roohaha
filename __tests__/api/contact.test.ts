import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

// @ts-expect-error — direct .ts import resolved by --experimental-strip-types + loader
import { POST } from '../../app/api/contact/route.ts';

function makeReq(body: unknown) {
  return { json: async () => body };
}

afterEach(() => {
  (globalThis as Record<string, unknown>).__mockResendSend = undefined;
});

const VALID = {
  name: 'Alice',
  email: 'alice@example.com',
  message: 'Hello this is a test message',
};

async function captureEmail(body: typeof VALID): Promise<Record<string, unknown>> {
  let captured: Record<string, unknown> = {};
  (globalThis as Record<string, unknown>).__mockResendSend = async (p: unknown) => {
    captured = p as Record<string, unknown>;
  };
  await POST(makeReq(body) as never);
  return captured;
}

describe('contact POST handler', () => {
  describe('validation', () => {
    it('returns 400 when json cannot be parsed', async () => {
      const req = { json: async () => { throw new Error('bad'); } };
      const res = await POST(req as never) as Record<string, unknown>;
      assert.equal(res['status'], 400);
    });

    it('returns 400 when name is too short', async () => {
      const res = await POST(makeReq({ ...VALID, name: 'A' }) as never) as Record<string, unknown>;
      assert.equal(res['status'], 400);
    });

    it('returns 400 when email is invalid', async () => {
      const res = await POST(makeReq({ ...VALID, email: 'notanemail' }) as never) as Record<string, unknown>;
      assert.equal(res['status'], 400);
    });

    it('returns 400 when message has fewer than 5 words', async () => {
      const res = await POST(makeReq({ ...VALID, message: 'too short' }) as never) as Record<string, unknown>;
      assert.equal(res['status'], 400);
    });
  });

  describe('HTML escaping in email body', () => {
    it('escapes < and > in name', async () => {
      const { html } = await captureEmail({ ...VALID, name: '<b>Alice</b>' });
      assert.ok((html as string).includes('&lt;b&gt;Alice&lt;/b&gt;'));
      assert.ok(!(html as string).includes('<b>Alice</b>'));
    });

    it('escapes & in name', async () => {
      const { html } = await captureEmail({ ...VALID, name: 'Tom & Jerry' });
      assert.ok((html as string).includes('Tom &amp; Jerry'));
    });

    it('escapes " in name', async () => {
      const { html } = await captureEmail({ ...VALID, name: 'Say "hi"' });
      assert.ok((html as string).includes('Say &quot;hi&quot;'));
    });

    it('escapes HTML tags in message', async () => {
      const { html } = await captureEmail({
        ...VALID,
        message: '<script>alert(1)</script> plus more words here',
      });
      assert.ok((html as string).includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
      assert.ok(!(html as string).includes('<script>'));
    });

    it('converts message newlines to <br/> after HTML escaping', async () => {
      const { html } = await captureEmail({
        ...VALID,
        message: '<tag>line one</tag>\nline two plus words',
      });
      assert.ok((html as string).includes('&lt;tag&gt;line one&lt;/tag&gt;<br/>line two'));
    });

    it('does not escape the plain text body', async () => {
      const { text } = await captureEmail({ ...VALID, name: 'Tom & Jerry' });
      assert.ok((text as string).includes('Tom & Jerry'));
    });
  });

  describe('submission', () => {
    it('returns 200 with { ok: true } on success', async () => {
      (globalThis as Record<string, unknown>).__mockResendSend = async () => ({});
      const res = await POST(makeReq(VALID) as never) as Record<string, unknown>;
      assert.equal(res['status'], 200);
      assert.deepEqual(res['_json'], { ok: true });
    });

    it('sends to the configured recipient with correct from address', async () => {
      const email = await captureEmail(VALID);
      assert.deepEqual(email['to'], ['to@test.com']);
      assert.equal(email['from'], 'from@test.com');
    });

    it('sets replyTo to the sender email', async () => {
      const email = await captureEmail(VALID);
      assert.equal(email['replyTo'], 'alice@example.com');
    });

    it('returns 500 when Resend throws', async () => {
      (globalThis as Record<string, unknown>).__mockResendSend = async () => { throw new Error('API error'); };
      const res = await POST(makeReq(VALID) as never) as Record<string, unknown>;
      assert.equal(res['status'], 500);
      assert.deepEqual(res['_json'], { error: 'Failed to send message' });
    });
  });
});
