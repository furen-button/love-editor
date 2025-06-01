import React from 'react';

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
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
      <label style={{ flex: '1', textAlign: 'right', marginRight: '5px' }}>フォント:</label>
      <select
        value={selectedFont}
        onChange={(e) => setSelectedFont(e.target.value)}
        style={{ flex: '2', padding: '5px' }}
      >
        {['Arial', 'Noto Sans JP', 'Zen Maru Gothic', 'Zen Kaku Gothic'].map((font) => (
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
    </div>
  );
};

export default CanvasSettings;
