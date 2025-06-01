import { useState, useEffect, useRef } from 'react';
import './EditLoveData.css';
import { showToast } from './utils/showToast';

const EditLoveData = () => {
  const [isUsageVisible, setIsUsageVisible] = useState(false);
  const savedData = localStorage.getItem('loveData');
  const initialData = savedData ? JSON.parse(savedData) : [];
  const [data, setData] = useState<string[]>(initialData);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [manualFontSize, setManualFontSize] = useState<number | null>(null);
  const [manualCanvasHeight, setManualCanvasHeight] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchAndSetData = async () => {
    const response = await fetch('./split-love.json');
    const jsonData = await response.json();
    setData(jsonData);
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchAndSetData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loveData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const canvasWidth = 800;
        const canvasHeight = manualCanvasHeight || 418;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 背景を白色に設定
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const text = data.join(' ');
        // サイズ調整
        let fontSize = manualFontSize || 75;
        const minFontSize = 8; // 最低フォントサイズを設定
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillStyle = 'black'; // 文字色を黒色に設定

        if (!manualFontSize) {
          const calculateFontSize = () => {
            let testFontSize = fontSize;
            ctx.font = `${testFontSize}px ${selectedFont}`;
            const textNum = text.length;

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
        }

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
  }, [data, selectedFont, manualFontSize, manualCanvasHeight]);

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

  // フォント選択 UI
  const resetData = () => {
    fetchAndSetData();
  };

  return (
    <div className="edit-love-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>"愛の演説"エディター</h1>
      <div>
        『君のことが大大大大大好きな100人の彼女』の"愛の演説"の編集をするエディターです。<br />
        あらゆる大好きを詰め込んだ愛の演説を作成しましょう！<br />
        参考: <a href="https://dic.pixiv.net/a/%E6%81%8B%E5%A4%AA%E9%83%8E%E6%B5%81%E6%84%9B%E3%81%AE%E5%91%8A%E7%99%BD" target="_blank">恋太郎流愛の告白 (おもすぎるあいのげんごか)とは【ピクシブ百科事典】</a>
      </div>
      <h2 style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => setIsUsageVisible(!isUsageVisible)}>
        使い方 {isUsageVisible ? '▲' : '▼'}
      </h2>
      {isUsageVisible && (
        <div>
          <p>"愛の演説"は、以下のように編集できます。</p>
          <ul>
            <li>テキストを直接編集</li>
            <li>上下ボタンで順番を変更</li>
            <li>削除ボタンで項目を削除</li>
          </ul>
          <p>フォントやフォントサイズ、画像の高さを調整できます。ダウンロードボタンをクリックして画像を保存できます。</p>
          <p>テキストをコピーするボタンも用意しています。</p>
          <p>ページをリロードすると編集内容は復元されます。</p>
          <p>オリジナルの"愛の演説"を作成してあなたの愛を表現しましょう！</p>
          <p>※原文を参照させていただいていますが、自分の"愛の演説"を作成するためのエディターです。原文の内容をそのまま使用すること避けてください。</p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ border: '1px solid black', marginBottom: '20px', alignSelf: 'center' }}></canvas>
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
      <input
        type="number"
        value={manualFontSize || ''}
        onChange={(e) => setManualFontSize(Number(e.target.value) || null)}
        placeholder="フォントサイズを入力"
        style={{ marginTop: '20px', marginBottom: '10px' }}
      />
      <input
        type="number"
        value={manualCanvasHeight || ''}
        onChange={(e) => setManualCanvasHeight(Number(e.target.value) || null)}
        placeholder="キャンバスの高さを入力"
        style={{ marginTop: '10px', marginBottom: '10px' }}
      />
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

      <h1 style={{ marginTop: '20px' }}>"愛の演説"編集</h1>
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
            navigator.clipboard.writeText(data.join('\n'));
            showToast('テキストをコピーしました');
          }}
        >
          各行を改行してコピー
        </button>
        <button
          onClick={() => {
            const jsonArray = JSON.stringify(data);
            navigator.clipboard.writeText(jsonArray);
            showToast('JSON配列をコピーしました');
          }}
        >
          JSON配列としてコピー
        </button>
        <button onClick={resetData}>リセット</button>
      </div>
    </div>
  );
};

export default EditLoveData;