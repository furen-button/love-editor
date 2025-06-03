import '@testing-library/jest-dom';
import { vi } from 'vitest';

// canvas のモック
// getContextの型に合わせて各contextIdごとに適切なモックを返す
// 型エラー回避のため any を使用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype.getContext as any) = vi.fn(function (
  contextId: "2d" | "bitmaprenderer" | "webgl" | "webgl2",
  options?: any
) {
  if (contextId === "2d") {
    return {
      fillRect: vi.fn(),
      measureText: vi.fn(() => ({ width: 10 })),
      fillText: vi.fn(),
      font: '',
      fillStyle: '',
      canvas: document.createElement('canvas'),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      clip: vi.fn(),
      fill: vi.fn(),
      isPointInPath: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      // 必要に応じて他のプロパティを追加
    } as unknown as CanvasRenderingContext2D;
  }
  if (contextId === "bitmaprenderer") {
    // transferFromImageBitmapを持つダミーオブジェクトを返す
    return {
      transferFromImageBitmap: vi.fn(),
    } as unknown as ImageBitmapRenderingContext;
  }
  if (contextId === "webgl" || contextId === "webgl2") {
    // WebGLRenderingContextのダミー
    return {} as WebGLRenderingContext;
  }
  return null;
});

// fetch のモック
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(['愛の演説データ1', '愛の演説データ2']),
  })
));

// document.fonts.ready のモック
Object.defineProperty(document, 'fonts', {
  value: {
    ready: Promise.resolve(),
  },
});

// navigator.clipboard のモック
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});
