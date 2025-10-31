import Link from 'next/link';
import { useState } from 'react';
import styles from './Sidebar.module.css'; // Optional: use CSS module for styling

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={open ? styles.sidebarOpen : styles.sidebarClosed}>
      <button className={styles.toggleBtn} onClick={() => setOpen(o => !o)}>
        {open ? '☰' : '☰'}
      </button>
      <nav>
        <ul>
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}