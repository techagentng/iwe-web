import Link from 'next/link';

export default function Landing() {
  return (
    <main>
      <h1>Welcome to My App</h1>
      <Link href="/login">Login</Link>
    </main>
  );
}