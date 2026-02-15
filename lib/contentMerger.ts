import type { Page } from '@/types';

/**
 * Merge an array of pages back into a single HTML string
 * Pages are ordered by pageNumber
 */
export function mergePagesIntoContent(
  pages: Page[] | null | undefined
): string {
  // Handle null, undefined, or non-array input
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return '';
  }

  // Filter out any invalid pages and ensure they have content
  const validPages = pages.filter(
    (page) =>
      page &&
      typeof page === 'object' &&
      'content' in page &&
      'pageNumber' in page
  );

  if (validPages.length === 0) {
    return '';
  }

  // Sort pages by pageNumber
  const sortedPages = [...validPages].sort((a, b) => {
    const pageNumA = typeof a.pageNumber === 'number' ? a.pageNumber : 0;
    const pageNumB = typeof b.pageNumber === 'number' ? b.pageNumber : 0;
    return pageNumA - pageNumB;
  });

  // Merge all page content, ensuring content is a string
  return sortedPages
    .map((page) => (typeof page.content === 'string' ? page.content : ''))
    .join('');
}
