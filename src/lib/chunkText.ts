// Advanced text chunking utility
// Splits by paragraph, then by sentence, with overlap support

export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  if (!text) return [];
  // Split by paragraphs first
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    // If paragraph is too long, split by sentence
    if (para.length > chunkSize) {
      const sentences = para.match(/[^.!?\n]+[.!?\n]+/g) || [para];
      for (const sentence of sentences) {
        if ((currentChunk + " " + sentence).trim().length > chunkSize) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
            // Add overlap from end of last chunk
            if (overlap > 0 && currentChunk.length > overlap) {
              currentChunk = currentChunk.slice(-overlap);
            } else {
              currentChunk = "";
            }
          }
        }
        currentChunk += (currentChunk ? " " : "") + sentence.trim();
      }
    } else {
      if ((currentChunk + " " + para).trim().length > chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          if (overlap > 0 && currentChunk.length > overlap) {
            currentChunk = currentChunk.slice(-overlap);
          } else {
            currentChunk = "";
          }
        }
      }
      currentChunk += (currentChunk ? " " : "") + para;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}
