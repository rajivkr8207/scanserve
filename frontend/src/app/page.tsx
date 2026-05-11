import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to a default restaurant page or login
  redirect('/spice-garden');
}
