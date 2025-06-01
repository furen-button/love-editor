import React, { useState } from 'react';

interface CanvasSettingsProps {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  manualFontSize: number | null;
  setManualFontSize: (size: number | null) => void;
  manualCanvasWidth: number | null;
  setManualCanvasWidth: (width: number | null) => void;
  manualCanvasHeight: number | null;
  setManualCanvasHeight: (height: number | null) => void;
}

const commonSizes = [
  { label: 'X(Twitter) 広告投稿', width: 800, height: 418 },
  { label: 'X(Twitter) 横長投稿', width: 1200, height: 675 },
  { label: 'X(Twitter) 2枚投稿', width: 1200, height: 1350 },
  { label: 'X(Twitter) ヘッダー', width: 1500, height: 500 },
  { label: 'YouTube サムネイル', width: 1280, height: 720 },
  { label: 'YouTube バナー', width: 2560, height: 1440 },
  { label: '横長動画', width: 1920, height: 1080 },
  { label: '縦長動画', width: 1080, height: 1920 },
  { label: 'Instagram 正方形', width: 1080, height: 1080 },
  { label: 'Note 記事の見出し画像', width: 1280, height: 670 },
  { label: 'デスクトップ壁紙', width: 1920, height: 1080 },
  { label: '名刺比率', width: 910, height: 550 },
  { label: 'A4用紙', width: 2480, height: 3508 },
];

const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  selectedFont,
  setSelectedFont,
  manualFontSize,
  setManualFontSize,
  manualCanvasWidth,
  setManualCanvasWidth,
  manualCanvasHeight,
  setManualCanvasHeight,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ flex: '1', textAlign: 'right', marginRight: '5px' }}>フォント:</label>
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          style={{ flex: '2', padding: '5px' }}
        >
          {['Arial', 'Noto Sans JP', 'Zen Maru Gothic', 'Zen Kaku Gothic', 'Kosugi Maru', 'Yusei Magic'].map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <label style={{ flex: '1', textAlign: 'right', marginRight: '5px' }}>フォントサイズ:</label>
        <input
          type="number"
          value={manualFontSize || ''}
          onChange={(e) => setManualFontSize(Number(e.target.value) || null)}
          placeholder="フォントサイズ"
          style={{ flex: '2', padding: '5px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ flex: '1', textAlign: 'right', marginRight: '5px' }}>画像サイズ:</label>
        <input
          type="number"
          value={manualCanvasWidth || ''}
          onChange={(e) => setManualCanvasWidth(Number(e.target.value) || null)}
          placeholder="幅"
          style={{ flex: '2', padding: '5px' }}
        />
        <p>×</p>
        <input
          type="number"
          value={manualCanvasHeight || ''}
          onChange={(e) => setManualCanvasHeight(Number(e.target.value) || null)}
          placeholder="高さ"
          style={{ flex: '2', padding: '5px' }}
        />
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{ padding: '5px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          よく使われる画像サイズ
        </button>
      </div>
      {showHelp && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <p>よく使われる画像サイズ:</p>
          <ul>
            {commonSizes.map((size, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setManualCanvasWidth(size.width);
                    setManualCanvasHeight(size.height);
                  }}
                  style={{ padding: '5px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '5px' }}
                >
                  {size.label} - {size.width} × {size.height}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CanvasSettings;
