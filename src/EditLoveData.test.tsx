import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach } from 'vitest';
import EditLoveData from './EditLoveData';

describe('EditLoveData Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('初期レンダリング時に正しい要素が表示される', () => {
    render(<EditLoveData />);

    expect(screen.getByText((content) => content.includes('"愛の演説"エディター'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('"愛の演説"画像'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('"愛の演説"編集'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('"愛の演説"テキストコピー'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('データリセット'))).toBeInTheDocument();
  });

  test('新しい愛を追加ボタンをクリックするとデータが追加される', () => {
    render(<EditLoveData />);

    const addButton = screen.getByText((content) => content.includes('新しい愛を追加'));
    fireEvent.click(addButton);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(1);
    expect(listItems[0].querySelector('input')?.value).toBe('大好きだし');
  });

  test('データをリセットすると初期データがロードされる', async () => {
    render(<EditLoveData />);

    const resetButton = screen.getByText((content) => content.includes('初期データへリセット'));
    fireEvent.click(resetButton);

    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  });

  test('テキストをコピーするとクリップボードに保存される', async () => {
    render(<EditLoveData />);

    const copyButtons = screen.getAllByText((content) => content.includes('コピー'));
    const copyButton = copyButtons.find((button) => button.tagName === 'BUTTON');
    if (copyButton) {
      fireEvent.click(copyButton);
    }

    await screen.findByText((content) => content.includes('テキストをコピーしました'));
  });
});
