import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const DIST = path.join(ROOT, '.test-dist');

const STUBS = {
  'next/cache': [
    'export const unstable_cache = (fn, _k, _o) => fn;',
    'export const revalidateTag = () => {};',
    'export const revalidatePath = () => {};',
    'export const updateTag = () => {};',
    'export const cacheTag = () => {};',
    'export const cacheLife = () => {};',
  ].join(''),

  pino: [
    'export default function pino() {',
    '  return { error: () => {}, warn: () => {}, info: () => {}, debug: () => {} };',
    '}',
  ].join(''),

  '@vercel/edge-config': [
    'let _impl = async () => null;',
    'export function __setMockGet(fn) { _impl = fn; }',
    'export function createClient() { return { get: (_key) => _impl(_key) }; }',
  ].join(''),

  '@/app/lib/env': [
    'export const env = {',
    '  RESEND_API_KEY: "test-key",',
    '  CONTACT_FROM_EMAIL: "from@test.com",',
    '  CONTACT_TO_EMAIL: "to@test.com",',
    '};',
  ].join('\n'),

  'next/server': [
    'export class NextResponse {',
    '  constructor(body, init) { this._json = body; this.status = (init && init.status) || 200; }',
    '  static json(body, init) { return new NextResponse(body, init); }',
    '}',
    'export class NextRequest {}',
  ].join(''),

  resend: [
    'export class Resend {',
    '  constructor(_k) {}',
    '  get emails() {',
    '    return { send: (p) => {',
    '      const fn = globalThis.__mockResendSend;',
    '      return Promise.resolve(typeof fn === "function" ? fn(p) : {});',
    '    } };',
    '  }',
    '}',
  ].join(''),
};

function fileExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  if (Object.prototype.hasOwnProperty.call(STUBS, specifier)) {
    return {
      url: `data:text/javascript,${encodeURIComponent(STUBS[specifier])}`,
      shortCircuit: true,
    };
  }

  const parentPath = context.parentURL ? fileURLToPath(context.parentURL) : '';
  const isFromDist = parentPath.startsWith(DIST + path.sep);

  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2);

    if (isFromDist) {
      const candidate = path.join(DIST, rel + '.js');
      if (fileExists(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }

    for (const ext of ['', '.ts', '.tsx', '.js']) {
      const candidate = path.join(ROOT, rel + ext);
      if (fileExists(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
    }
  }

  if (
    isFromDist &&
    (specifier.startsWith('./') || specifier.startsWith('../')) &&
    !path.extname(specifier)
  ) {
    const parentDir = path.dirname(parentPath);
    const candidate = path.join(parentDir, specifier + '.js');
    if (fileExists(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
  }

  return nextResolve(specifier, context);
}
