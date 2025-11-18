import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  // This is the main admin layout, but each page will use AdminLayout component to handle sidebar
  return <>{children}</>;
}