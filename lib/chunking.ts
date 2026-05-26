const DEFAULT_CHUNK_SIZE = 700;
const DEFAULT_OVERLAP = 120;

function normalizeWhitespace(input: string) {
  return input.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

export function createChunks(input: string, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) {
  const text = normalizeWhitespace(input);

  if (!text) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    if (end < text.length) {
      const boundary = text.lastIndexOf("\n", end);
      const sentenceBoundary = text.lastIndexOf("。", end);
      const safeBoundary = Math.max(boundary, sentenceBoundary);

      if (safeBoundary > start + Math.floor(chunkSize * 0.55)) {
        end = safeBoundary + 1;
      }
    }

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= text.length) {
      break;
    }

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
