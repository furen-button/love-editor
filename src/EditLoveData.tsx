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

        const text = data.join(' '); // 文字列を結合
        const maxWidth = canvasWidth;
        const lineHeight = 30;

        let fontSize = 30;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'black'; // 文字色を黒色に設定

        // サイズ調整
        while (ctx.measureText(text).width > canvasWidth) {
          fontSize--;
          ctx.font = `${fontSize}px Arial`;
        }

        // テキスト描画
        const words = text.split(' ');
        let line = '';
        let y = lineHeight;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, 0, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 0, y);
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
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>保存</button>
    </div>
  );
};

export default EditLoveData;