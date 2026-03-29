import { redirect } from 'next/navigation';

export default function DisabledLoginPage() {
  // Securely and silently kicks anyone trying to visit /auth/login back to the homepage
  redirect('/');
}