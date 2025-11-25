import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, slug } = body

    // Revalidate based on content type
    switch (type) {
      case 'project':
        revalidatePath('/projects')
        if (slug) revalidatePath(`/projects/${slug}`)
        break
      case 'page':
        if (slug) revalidatePath(`/${slug}`)
        break
      default:
        revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
