// Utility for compressing and parsing spreadsheet files (XLS, XLSX, CSV) into lightweight data

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 back to Uint8Array
export function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Compress data using native browser gzip CompressionStream
async function compressWithGzip(dataBuffer) {
  if (typeof CompressionStream !== 'undefined') {
    const stream = new Blob([dataBuffer]).stream().pipeThrough(new CompressionStream('gzip'));
    const compressedBlob = await new Response(stream).blob();
    const compressedBuffer = await compressedBlob.arrayBuffer();
    return compressedBuffer;
  }
  return dataBuffer;
}

// Decompress data using native browser gzip DecompressionStream
async function decompressWithGzip(compressedBuffer) {
  if (typeof DecompressionStream !== 'undefined') {
    const stream = new Blob([compressedBuffer]).stream().pipeThrough(new DecompressionStream('gzip'));
    const decompressedBlob = await new Response(stream).blob();
    const decompressedBuffer = await decompressedBlob.arrayBuffer();
    return decompressedBuffer;
  }
  return compressedBuffer;
}

// Parse text/csv preview lines
function parseCsvPreview(text, maxRows = 6) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows = lines.slice(0, maxRows).map((line) => {
    // Basic CSV split respecting quotes
    const values = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === ',' && !inQuotes) {
        values.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    values.push(cur.trim());
    return values;
  });
  return rows;
}

export async function processAndCompressSheet(file) {
  const originalSize = file.size;
  const originalSizeText = formatBytes(originalSize);

  let previewRows = [];
  const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type.includes('csv');

  if (isCsv) {
    try {
      const text = await file.text();
      previewRows = parseCsvPreview(text);
    } catch {
      // preview parsing optional
    }
  }

  // Read raw buffer
  const rawBuffer = await file.arrayBuffer();

  // Compress using native browser stream
  let compressedBuffer;
  let isCompressed = false;
  try {
    compressedBuffer = await compressWithGzip(rawBuffer);
    isCompressed = compressedBuffer.byteLength < rawBuffer.byteLength;
  } catch (err) {
    console.warn('Compression stream error, fallback to raw', err);
    compressedBuffer = rawBuffer;
  }

  const finalBuffer = isCompressed ? compressedBuffer : rawBuffer;
  const compressedSize = finalBuffer.byteLength;
  const compressedSizeText = formatBytes(compressedSize);
  const ratio = originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;
  const compressionRatioText = ratio > 0 ? `${ratio}% smaller` : 'Optimized';

  const base64Data = arrayBufferToBase64(finalBuffer);

  return {
    id: 'sheet-' + Date.now(),
    fileName: file.name,
    originalSize,
    originalSizeText,
    compressedSize,
    compressedSizeText,
    compressionRatioText,
    isGzip: isCompressed,
    mimeType: file.type || (isCsv ? 'text/csv' : 'application/vnd.ms-excel'),
    previewRows,
    base64Data,
    uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function downloadAttachment(attachment) {
  if (!attachment || !attachment.base64Data) return;

  const rawBytes = base64ToUint8Array(attachment.base64Data);

  let downloadBuffer = rawBytes.buffer;
  if (attachment.isGzip) {
    try {
      downloadBuffer = await decompressWithGzip(rawBytes.buffer);
    } catch (err) {
      console.warn('Decompression failed, downloading raw data', err);
      downloadBuffer = rawBytes.buffer;
    }
  }

  const blob = new Blob([downloadBuffer], {
    type: attachment.mimeType || 'application/octet-stream',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = attachment.fileName || 'spreadsheet.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
