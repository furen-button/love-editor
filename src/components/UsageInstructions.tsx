import React from 'react';

interface UsageInstructionsProps {
  isUsageVisible: boolean;
  toggleUsageVisibility: () => void;
}

const UsageInstructions: React.FC<UsageInstructionsProps> = ({
  isUsageVisible,
  toggleUsageVisibility,
}) => {
  return (
    <>
      <h2
        style={{
          marginTop: '20px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: '#fff',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={toggleUsageVisibility}
      >
        使い方 {isUsageVisible ? '▲' : '▼'}
      </h2>
      {isUsageVisible && (
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
          }}
        >
          <p style={{ marginBottom: '10px' }}>
            "愛の演説"は、以下のように編集できます。
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
            <li>テキストを直接編集</li>
            <li>上下ボタンで順番を変更</li>
            <li>削除ボタンで項目を削除</li>
          </ul>
          <p style={{ marginBottom: '10px' }}>
            フォントやフォントサイズ、画像の高さを調整できます。ダウンロードボタンをクリックして画像を保存できます。
          </p>
          <p style={{ marginBottom: '10px' }}>
            テキストをコピーするボタンも用意しています。
          </p>
          <p style={{ marginBottom: '10px' }}>
            ページをリロードすると編集内容は復元されます。
          </p>
          <p style={{ marginBottom: '10px' }}>
            オリジナルの"愛の演説"を作成してあなたの愛を表現しましょう！
          </p>
          <p>
            ※原文を参照させていただいていますが、オリジナルの"愛の演説"を作成するためのエディターです。原文の内容をそのまま使用すること避けてください。
          </p>
        </div>
      )}
    </>
  );
};

export default UsageInstructions;
