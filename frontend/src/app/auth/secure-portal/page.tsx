import { redirect } from 'next/navigation';

export default function SecurePortalRedirect() {
  redirect('/auth/login');
}
