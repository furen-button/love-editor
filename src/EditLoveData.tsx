import React, { useState, useEffect, useRef } from 'react';
import './EditLoveData.css';

const EditLoveData = () => {
  const [data, setData] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // JSONデータを読み込む
    fetch('/data/split-love.json')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const canvasWidth = 800;
        const canvasHeight = 418;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 背景を白色に設定
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const text = data.length > 0 ? data.join(' ') : 'デフォルトの文字列'; // デフォルト文字列を設定

        // サイズ調整
        let fontSize = 30;
        const minFontSize = 8; // 最低フォントサイズを設定
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'black'; // 文字色を黒色に設定

        // フォントサイズを計算で求める
        const calculateFontSize = () => {
          let testFontSize = fontSize;
          ctx.font = `${testFontSize}px Arial`;
          const textNum = text.length;
          while (testFontSize > minFontSize) {
            const characterSize = ctx.measureText('あ'); // 日本語の文字を使用してフォントサイズを測定
            const textWidth = characterSize.width;
            const textHeight = testFontSize;
            const characterPerOneLine = Math.ceil(canvasWidth / textWidth);
            const lines = Math.ceil(textNum / characterPerOneLine);
            console.log(`Testing font size: ${testFontSize}, characterPerOneLine: ${characterPerOneLine}, lines: ${lines}`);
            if (lines * textHeight <= canvasHeight) {
              break; // フォントサイズが適切な場合はループを抜ける
            }
            testFontSize -= 1; // フォントサイズを小さくする
            ctx.font = `${testFontSize}px Arial`;
          }
          return testFontSize;
        };

        fontSize = calculateFontSize();
        ctx.font = `${fontSize}px Arial`;

        // テキスト描画
        let x = 0;
        let y = fontSize; // フォントサイズと改行幅を統一

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const charWidth = ctx.measureText(char).width;

          if (x + charWidth > canvasWidth) {
            x = 0;
            y += fontSize;
          }

          ctx.fillText(char, x, y);
          x += charWidth;
        }
      }
    }
  }, [data]);

  const handleEdit = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    setData(newData);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const newData = [...data];
    const [movedItem] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedItem);
    setData(newData);
  };

  const handleSave = () => {
    // 保存処理（例: サーバーに送信）
    console.log('保存されたデータ:', data);
  };

  return (
    <div className="edit-love-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid black', marginBottom: '20px', alignSelf: 'center' }}></canvas>
      <h1 style={{ marginTop: '20px' }}>恋愛データ編集</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
            />
            <button
              onClick={() => handleMove(index, index - 1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              onClick={() => handleMove(index, index + 1)}
              disabled={index === data.length - 1}
            >
              ↓
            </button>
            <button
              onClick={() => {
                const newData = data.filter((_, i) => i !== index);
                setData(newData);
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

export default EditLoveData;