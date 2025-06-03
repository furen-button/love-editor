import '@testing-library/jest-dom';
import { vi } from 'vitest';

// canvas のモック
HTMLCanvasElement.prototype.getContext = vi.fn((contextId) => {
  if (contextId === '2d') {
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
    } as CanvasRenderingContext2D;
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
