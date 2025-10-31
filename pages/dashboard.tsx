import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('auth') !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </Layout>
  );
}