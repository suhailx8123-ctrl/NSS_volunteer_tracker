import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampusImpact | Student Club & Volunteering Hour Tracker',
  description: 'Enterprise volunteering hour tracking and academic honor certification system for college clubs, NSS units, and IEDC drives.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-campus-bg text-campus-parchment antialiased selection:bg-campus-emerald selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
