import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import SEOClient from './SEOClient'

export default async function AdminSEOPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return <SEOClient />
}
