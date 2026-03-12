import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trail Mixx Radio - Seattle Community Radio',
  description: "Seattle's decentralized cover-song community radio station",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
