import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import SocialPreviewClient from './SocialPreviewClient'

export default async function AdminSocialPreviewPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return <SocialPreviewClient />
}
