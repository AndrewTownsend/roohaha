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
