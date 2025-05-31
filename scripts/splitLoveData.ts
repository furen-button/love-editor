import fs from 'fs';
import path from 'path';

/**
 * このスクリプトは、オリジナルのメッセージを
 * 「大好きだし」または「大好きですし」で分割し、
 * その結果をJSON形式で保存します。
 */

// Replace __dirname with the equivalent for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define the input and output file paths
const inputFilePath = path.join(__dirname, '../data/original-love.txt');
const outputFilePath = path.join(__dirname, '../public/split-love.json');

// Read the original text file
fs.readFile(inputFilePath, 'utf8', (err: Error | null, data: string) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Modify the split logic to append the split keywords to the preceding string
  const splitData = data.split(/(大好きだし|大好きですし)/).reduce((acc, curr, index) => {
    if (index % 2 === 0) {
      acc.push(curr);
    } else {
      acc[acc.length - 1] += curr;
    }
    return acc;
  }, []);

  // Write the JSON array to the output file
  fs.writeFile(outputFilePath, JSON.stringify(splitData, null, 2), 'utf8', (err: Error | null) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been successfully written to', outputFilePath);
  });
});
