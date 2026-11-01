import type { Metadata } from 'next';
import './admin-theme.css';

export const metadata: Metadata = {
  title: 'Vastu Vihar | Admin Portal',
  description: 'Executive Management Portal for Vastu Vihar',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-apple-root">{children}</div>;
}
