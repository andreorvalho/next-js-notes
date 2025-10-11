import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
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
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
