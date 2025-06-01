import { useState, useEffect, useRef } from 'react';
import './EditLoveData.css';
import { showToast } from './utils/showToast';
import CanvasSettings from './components/CanvasSettings';
import UsageInstructions from './components/UsageInstructions';

const EditLoveData = () => {
  const [isUsageVisible, setIsUsageVisible] = useState(false);
  const savedData = localStorage.getItem('loveData');
  const initialData = savedData ? JSON.parse(savedData) : [];
  const [data, setData] = useState<string[]>(initialData);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [manualFontSize, setManualFontSize] = useState<number | null>(null);
  const [manualCanvasWidth, setManualCanvasWidth] = useState<number | null>(null);
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

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const canvasWidth = manualCanvasWidth || 800;
        const canvasHeight = manualCanvasHeight || 418;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 背景を白色に設定
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const text = data.join(' ');
        let fontSize = manualFontSize || 75;
        const minFontSize = 8;
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillStyle = 'black';

        if (!manualFontSize) {
          const calculateFontSize = () => {
            let testFontSize = fontSize;
            ctx.font = `${testFontSize}px ${selectedFont}`;
            const textNum = text.length;

            const memoizedCharacterWidth = (() => {
              const cache = new Map<string, number>();
              return (fontSize: number) => {
                const cacheKey = `${fontSize}-${selectedFont}`;
                if (!cache.has(cacheKey)) {
                  ctx.font = `${fontSize}px ${selectedFont}`;
                  const width = ctx.measureText('あ').width;
                  cache.set(cacheKey, width);
                }
                return cache.get(cacheKey) || 0;
              };
            })();

            while (testFontSize > minFontSize) {
              const textWidth = memoizedCharacterWidth(testFontSize);
              const textHeight = testFontSize;
              const characterPerOneLine = Math.ceil(canvasWidth / textWidth);

              const lines = Math.ceil(textNum / characterPerOneLine);

              if (lines * textHeight <= canvasHeight) {
                break;
              }
              testFontSize -= 1;
            }

            return testFontSize;
          };

          fontSize = calculateFontSize();
        }

        ctx.font = `${fontSize}px ${selectedFont}`;

        let x = 0;
        let y = fontSize;

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
  };

  useEffect(() => {
    updateCanvas();
    document.fonts.ready.then(updateCanvas);
  }, [data, selectedFont, manualFontSize, manualCanvasWidth, manualCanvasHeight]);

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

  const loadDataByFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const lines = text.split('\n').map((line) => line.trim()).filter((line) => line);
        setData(lines);
      }
    };

    input.click();
  };

  return (
    <div className="edit-love-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        "愛の演説"エディター
      </h1>
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        『君のことが大大大大大好きな100人の彼女』の"愛の演説"を編集するエディターです。<br />
        あらゆる大好きを詰め込んだ"愛の演説"を作成しよう！<br />
        参考1: <a href="https://hyakkano.com/" target="_blank" style={{ color: '#007BFF', textDecoration: 'none' }}>TVアニメ「君のことが大大大大大好きな100人の彼女」公式サイト</a><br />
        参考2: <a href="https://dic.pixiv.net/a/%E6%81%8B%E5%A4%AA%E9%83%8E%E6%B5%81%E6%84%9B%E3%81%AE%E5%91%8A%E7%99%BD" target="_blank" style={{ color: '#007BFF', textDecoration: 'none' }}>恋太郎流愛の告白 (おもすぎるあいのげんごか)とは【ピクシブ百科事典】</a>
      </div>
      <UsageInstructions
        isUsageVisible={isUsageVisible}
        toggleUsageVisibility={() => setIsUsageVisible(!isUsageVisible)}
      />
      <h1 style={{ marginTop: '20px' }}>
        "愛の演説"画像
      </h1>
      <canvas ref={canvasRef} style={{ border: '1px solid black', marginBottom: '20px', alignSelf: 'center' }}></canvas>
      <CanvasSettings
        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        manualFontSize={manualFontSize}
        setManualFontSize={setManualFontSize}
        manualCanvasWidth={manualCanvasWidth}
        setManualCanvasWidth={setManualCanvasWidth}
        manualCanvasHeight={manualCanvasHeight}
        setManualCanvasHeight={setManualCanvasHeight}
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
      <button
        onClick={() => {
          const newData = [...data, '大好きだし'];
          setData(newData);
        }}
        style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        新しい愛を追加
      </button>
      <h1 style={{ marginTop: '20px' }}>"愛の演説"テキストコピー</h1>
      <textarea
        value={data.join(' ')}
        readOnly
        style={{ width: '100%', height: '100px', marginTop: '10px' }}
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
            showToast('各行を改行してコピーしました');
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
      </div>
      <h1 style={{ marginTop: '20px' }}>データリセット</h1>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <button onClick={resetData}>初期データへリセット</button>
        <button onClick={() => {
          localStorage.removeItem('loveData');
          setData([]);
        }} style={{ marginLeft: '10px' }}>データを0件にする</button>
        <button onClick={loadDataByFile} style={{ marginLeft: '10px' }}>改行のテキストファイルから読み込む</button>
      </div>
    </div>
  );
};

export default EditLoveData;