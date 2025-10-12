import { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_POST } from '@/types';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === HTTP_POST) {
    const { name, email, password } = req.body;

    const hashedPassword = await hash(password, 10);
    try {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          active: true,
        },
      });
      res.status(201).json({ message: 'User created' });
    } catch {
      // eslint-disable-next-line no-console
      console.error('Registration error:');
      res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.setHeader('Allow', [HTTP_POST]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
