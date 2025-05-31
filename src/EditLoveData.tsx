import { useState, useEffect, useRef } from 'react';
import './EditLoveData.css';

const EditLoveData = () => {
  const [data, setData] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // JSONデータを読み込む
    fetch('./split-love.json')
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

        const text = data.join(' ');
        // サイズ調整
        let fontSize = 75;
        const minFontSize = 8; // 最低フォントサイズを設定
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillStyle = 'black'; // 文字色を黒色に設定

        // フォントサイズを計算で求める
        const calculateFontSize = () => {
          let testFontSize = fontSize;
          ctx.font = `${testFontSize}px ${selectedFont}`;
          const textNum = text.length;

          // メモ化された文字幅を保持
          const memoizedCharacterWidth = (() => {
            const cache = new Map<number, number>();
            return (fontSize: number) => {
              if (!cache.has(fontSize)) {
                ctx.font = `${fontSize}px ${selectedFont}`;
                const width = ctx.measureText('あ').width;
                cache.set(fontSize, width);
              }
              return cache.get(fontSize) as number;
            };
          })();

          while (testFontSize > minFontSize) {
            const textWidth = memoizedCharacterWidth(testFontSize);
            const textHeight = testFontSize;
            const characterPerOneLine = Math.ceil(canvasWidth / textWidth);

            // 必要な行数を計算
            const lines = Math.ceil(textNum / characterPerOneLine);

            if (lines * textHeight <= canvasHeight) {
              break; // フォントサイズが適切な場合はループを抜ける
            }
            testFontSize -= 1; // フォントサイズを小さくする
          }

          return testFontSize;
        };

        fontSize = calculateFontSize();
        ctx.font = `${fontSize}px ${selectedFont}`;

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
  }, [data, selectedFont]);

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

  // Toast メッセージを表示するための関数
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // フォント選択 UI
  return (
    <div className="edit-love-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <select
        value={selectedFont}
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ marginBottom: '20px' }}
      >
        {['Arial', 'Noto Sans JP', 'Zen Maru Gothic', 'Zen Kaku Gothic'].map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
      <canvas ref={canvasRef} style={{ border: '1px solid black', marginBottom: '20px', alignSelf: 'center' }}></canvas>
      <button
        onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const link = document.createElement('a');
            link.download = `love-message-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }}
        style={{ marginTop: '10px' }}
      >
        ダウンロード
      </button>

      <h1 style={{ marginTop: '20px' }}>愛の演説編集</h1>
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
      <textarea
        value={data.join(' ')}
        readOnly
        style={{ width: '100%', height: '100px', marginTop: '20px' }}
      ></textarea>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(data.join(' '));
            showToast('テキストをコピーしました');
          }}
        >
          コピー
        </button>
        <button
          onClick={() => {
            const jsonArray = JSON.stringify(data);
            navigator.clipboard.writeText(jsonArray);
            showToast('JSON配列をコピーしました');
          }}
        >
          JSON配列化
        </button>
      </div>
    </div>
  );
};

export default EditLoveData;