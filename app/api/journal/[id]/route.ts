import { analyze } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const user = await getUserByClerkId();

  const { content } = await req.json();
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  });

  const analysis = await prisma.analysis.update({
    where: {
      entryId: updatedEntry.id,
    },
    data: {
      userId: user.id,
      ...(await analyze(updatedEntry.content)),
    },
  });

  // revalidatePath(`/journal/${updatedEntry.id}`);

  return NextResponse.json({ data: { ...updatedEntry, analysis } });
};
