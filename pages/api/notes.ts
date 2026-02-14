import prisma from '@lib/prisma';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_GET, HTTP_POST } from '@/types';
import { splitContentIntoPages } from '@/lib/contentSplitter';
import { mergePagesIntoContent } from '@/lib/contentMerger';
import type { Note } from '@/types';

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === HTTP_POST) {
    const parseResult = noteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { title, content } = parseResult.data;
    try {
      // Split content into pages
      const pageContents = splitContentIntoPages(content);

      // Create note with pages
      const note = await prisma.note.create({
        data: {
          title,
          pages: {
            create: pageContents.map((pageContent, index) => ({
              content: pageContent,
              pageNumber: index + 1,
            })),
          },
        },
        include: {
          pages: {
            orderBy: { pageNumber: 'asc' },
          },
        },
      });

      // Return note with merged content (transparent to UI)
      const noteWithContent: Note = {
        id: note.id,
        title: note.title,
        content: mergePagesIntoContent(note.pages),
        created_at: note.created_at,
        updated_at: note.updated_at,
      };

      return res.status(200).json(noteWithContent);
    } catch (error) {
      console.error('Error creating note:', error);
      return res.status(500).json({ error: 'Failed to create note' });
    }
  }

  if (req.method === HTTP_GET) {
    const { search, orderBy, orderDirection } = req.query;

    const orderByField = (orderBy as string) || 'updated_at';
    const orderDirectionValue = orderDirection === 'asc' ? 'asc' : 'desc';

    try {
      // Build where clause for search
      const where: any = {};
      if (search) {
        where.OR = [
          {
            title: {
              contains: search as string,
              mode: 'insensitive' as const,
            },
          },
          {
            pages: {
              some: {
                content: {
                  contains: search as string,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        ];
      }

      const notes = await prisma.note.findMany({
        where,
        orderBy: { [orderByField]: orderDirectionValue },
        include: {
          pages: {
            orderBy: { pageNumber: 'asc' },
          },
        },
      });

      // Merge pages into content; truncate for list to stay under Next.js 4MB response limit
      const LIST_PREVIEW_MAX = 2000;
      const notesWithContent: Note[] = notes.map((note) => {
        const pages = Array.isArray(note.pages) ? note.pages : [];
        const fullContent = mergePagesIntoContent(pages);
        const content =
          fullContent.length <= LIST_PREVIEW_MAX
            ? fullContent
            : fullContent.slice(0, LIST_PREVIEW_MAX);
        return {
          id: note.id,
          title: note.title,
          content,
          created_at: note.created_at,
          updated_at: note.updated_at,
        };
      });

      return res.json(notesWithContent);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Log the full error for debugging
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return res.status(500).json({
        error: 'Failed to fetch notes',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
