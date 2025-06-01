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
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>キャンバス設定</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', alignItems: 'center' }}>
        <label style={{ textAlign: 'right', color: '#555' }}>フォント:</label>
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {['Arial', 'Noto Sans JP', 'Zen Maru Gothic', 'Zen Kaku Gothic', 'Kosugi Maru', 'Yusei Magic'].map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <label style={{ textAlign: 'right', color: '#555' }}>フォントサイズ:</label>
        <input
          type="number"
          value={manualFontSize || ''}
          onChange={(e) => setManualFontSize(Number(e.target.value) || null)}
          placeholder="フォントサイズ"
          style={{ paddingTop: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ textAlign: 'right', color: '#555' }}>画像幅:</label>
        <input
          type="number"
          value={manualCanvasWidth || ''}
          onChange={(e) => setManualCanvasWidth(Number(e.target.value) || null)}
          placeholder="幅"
          style={{ paddingTop: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ textAlign: 'right', color: '#555' }}>画像高さ:</label>
        <input
          type="number"
          value={manualCanvasHeight || ''}
          onChange={(e) => setManualCanvasHeight(Number(e.target.value) || null)}
          placeholder="高さ"
          style={{ paddingTop: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <button
        onClick={() => setShowHelp(!showHelp)}
        style={{ marginTop: '20px', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
      >
        よく使われる画像サイズ
      </button>

      {showHelp && (
        <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ marginBottom: '10px', color: '#333' }}>よく使われる画像サイズ:</p>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            {commonSizes.map((size, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => {
                    setManualCanvasWidth(size.width);
                    setManualCanvasHeight(size.height);
                  }}
                  style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
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
