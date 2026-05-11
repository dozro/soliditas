import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fromMatrixID, toMatrixID } from '../src/mxcId';

describe('toMatrixID', () => {
  it('encodes a filename with the provided prefix', () => {
    const result = toMatrixID('example.txt', 'mxc_');

    expect(result).toBe('mxc_ZXhhbXBsZS50eHQ');
  });

  it('supports unicode filenames', () => {
    const result = toMatrixID('📁-résumé.txt', 'mxc_');

    expect(fromMatrixID(result)).toBe('📁-résumé.txt');
  });

  it('produces url-safe base64 output', () => {
    const result = toMatrixID('file/with+symbols', 'mxc_');

    expect(result).not.toContain('+');
    expect(result).not.toContain('/');
    expect(result).not.toContain('=');
  });

  it('works with an empty filename', () => {
    const result = toMatrixID('', 'mxc_');

    expect(result).toBe('mxc_');
  });
});

describe('fromMatrixID', () => {
  it('decodes a matrix id back to the original filename', () => {
    const mxcID = toMatrixID('photo.png', 'mxc_');

    expect(fromMatrixID(mxcID)).toBe('photo.png');
  });

  it('decodes unicode filenames correctly', () => {
    const mxcID = toMatrixID('こんにちは.txt', 'mxc_');

    expect(fromMatrixID(mxcID)).toBe('こんにちは.txt');
  });

  it('throws when no separator is present', () => {
    expect(() => fromMatrixID('invalid')).toThrow(
      'Invalid MXC id: missing encoded payload',
    );
  });

  it('throws when separator exists but payload is missing', () => {
    expect(() => fromMatrixID('mxc_')).toThrow(
      'Invalid MXC id: missing encoded payload',
    );
  });

  it('ignores everything before the first underscore', () => {
    const encoded = toMatrixID('file.txt', 'prefix_');

    expect(fromMatrixID(`custom_${encoded.split('_')[1]}`)).toBe('file.txt');
  });
});

describe('runtime fallbacks', () => {
  const originalBtoa = globalThis.btoa;
  const originalAtob = globalThis.atob;
  const originalBuffer = globalThis.Buffer;

  afterEach(() => {
    globalThis.btoa = originalBtoa;
    globalThis.atob = originalAtob;
    globalThis.Buffer = originalBuffer;
  });

  it('uses Buffer fallback when btoa is unavailable', () => {
    // @ts-expect-error test override
    globalThis.btoa = undefined;

    const result = toMatrixID('buffer-test.txt', 'mxc_');

    expect(result).toBe('mxc_YnVmZmVyLXRlc3QudHh0');
  });

  it('uses Buffer fallback when atob is unavailable', () => {
    // @ts-expect-error test override
    globalThis.atob = undefined;

    const encoded = toMatrixID('buffer-decode.txt', 'mxc_');

    expect(fromMatrixID(encoded)).toBe('buffer-decode.txt');
  });

  it('throws if no encoder runtime is available', async () => {
    // @ts-expect-error test override
    globalThis.btoa = undefined;
    // @ts-expect-error test override
    globalThis.Buffer = undefined;

    expect(() => toMatrixID('fail.txt', 'mxc_')).toThrow(
      'No base64 encoder available in this runtime',
    );
  });

  it('throws if no decoder runtime is available', async () => {
    // @ts-expect-error test override
    globalThis.atob = undefined;
    // @ts-expect-error test override
    globalThis.Buffer = undefined;

    expect(() => fromMatrixID('mxc_ZmlsZS50eHQ')).toThrow(
      'No base64 decoder available in this runtime',
    );
  });
});