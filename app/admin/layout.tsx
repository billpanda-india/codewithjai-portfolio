import { getAdminSession } from '@/lib/auth'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()
  
  // Allow login page without authentication
  if (!session) {
    return <>{children}</>
  }

  // For authenticated users, show sidebar + header layout
  return <AdminLayoutClient user={session}>{children}</AdminLayoutClient>
}
