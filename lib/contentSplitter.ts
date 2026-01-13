/**
 * Maximum size for a single page in bytes (1MB)
 */
export const MAX_PAGE_SIZE = 1024 * 1024; // 1MB

/**
 * Calculate the UTF-8 byte size of a string
 */
export function calculateByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * Find the best split point in HTML content that respects tag boundaries
 * Returns the index where to split, or -1 if no good split point found
 */
function findSplitPoint(
  html: string,
  startIndex: number,
  maxSize: number
): number {
  // Preferred split points (in order of preference)
  const splitPatterns = [
    /<\/p>/gi, // Paragraph end
    /<\/div>/gi, // Div end
    /<br\s*\/?>/gi, // Line break
    /<\/li>/gi, // List item end
    /<\/h[1-6]>/gi, // Heading end
    /\n\n/g, // Double newline
    /\n/g, // Single newline
    /\s/g, // Any whitespace
  ];

  // Try each pattern to find a split point before maxSize
  for (const pattern of splitPatterns) {
    let lastMatch = -1;
    let match: RegExpExecArray | null;

    // Reset regex
    pattern.lastIndex = startIndex;

    while ((match = pattern.exec(html)) !== null) {
      const matchIndex = match.index + match[0].length;
      const size = calculateByteSize(html.substring(startIndex, matchIndex));

      if (size > maxSize) {
        // This match is too large, use the previous one
        if (lastMatch >= startIndex) {
          return lastMatch;
        }
        break;
      }

      lastMatch = matchIndex;

      // If we're close to maxSize, this is a good split point
      if (size >= maxSize * 0.8) {
        return matchIndex;
      }
    }

    // If we found a match but it's smaller than maxSize, use it
    if (lastMatch >= startIndex) {
      const size = calculateByteSize(html.substring(startIndex, lastMatch));
      if (size >= maxSize * 0.5) {
        // Only use if we got at least 50% of maxSize
        return lastMatch;
      }
    }
  }

  // If no good split point found, split at maxSize (may break tags, but better than nothing)
  return startIndex + maxSize;
}

/**
 * Split HTML content into page chunks that respect MAX_PAGE_SIZE
 * Tries to split at HTML tag boundaries when possible
 */
export function splitContentIntoPages(html: string): string[] {
  if (!html || html.trim() === '') {
    return [''];
  }

  const totalSize = calculateByteSize(html);
  if (totalSize <= MAX_PAGE_SIZE) {
    return [html];
  }

  const pages: string[] = [];
  let currentIndex = 0;

  while (currentIndex < html.length) {
    const remainingSize = calculateByteSize(html.substring(currentIndex));
    if (remainingSize <= MAX_PAGE_SIZE) {
      // Remaining content fits in one page
      pages.push(html.substring(currentIndex));
      break;
    }

    // Find the best split point
    const splitIndex = findSplitPoint(html, currentIndex, MAX_PAGE_SIZE);

    // Extract the page content
    const pageContent = html.substring(currentIndex, splitIndex);
    pages.push(pageContent);

    currentIndex = splitIndex;
  }

  return pages;
}
