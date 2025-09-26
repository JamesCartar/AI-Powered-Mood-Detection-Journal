import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { User } from '@prisma/client';
import NewEntry from '../../../components/NewEntryCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import Question from '@/components/Question';
import { qa } from '@/utils/ai';

const getEntries = async () => {
  const user = await getUserByClerkId();
  const journalEntries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return journalEntries;
};

export default async function JournalPage() {
  const entries = await getEntries();

  return (
    <div className=" bg-zinc-400/10 h-full p-6">
      <h2 className="text-3xl mb-8">Journals</h2>
      <div className=" my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <NewEntry />
        {entries.slice(0, 6).map((entry) => (
          <Link href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} key={entry.id} />
          </Link>
        ))}
      </div>
    </div>
  );
}
