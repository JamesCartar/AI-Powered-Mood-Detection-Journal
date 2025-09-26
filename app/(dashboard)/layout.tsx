import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
];

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen flex overflow-x-hidden">
      <aside className="w-[200px] h-full border-r border-black/10">
        <div>Mood</div>
        <div>
          <ul>
            {links.map((link) => (
              <li key={link.href} className="px-2 py-6 text-xl">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex-1 flex-col flex">
        <header className="h-[60px] border-b border-black/10 px-4 py-2">
          <div className="flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)]">{children}</div>
      </div>
    </div>
  );
}
