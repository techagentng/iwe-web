import { useRouter } from 'next/router';
import { useState } from 'react';
import { mockLogin } from '../utils/auth';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockLogin(user, pass)) {
      localStorage.setItem('auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} />
      <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}