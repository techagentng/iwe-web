export function mockLogin(username: string, password: string) {
  return username === 'admin' && password === 'password';
}