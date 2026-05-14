import { redirect } from 'next/navigation';

export default function QRRedirectPage({ params }: { params: { slug: string } }) {
  // Directly redirect to the actual menu page
  // The QR code URL will be /qr/[slug], and it redirects to /[slug]
  redirect(`/${params.slug}`);
}
