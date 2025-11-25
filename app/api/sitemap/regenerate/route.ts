import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    // Revalidate the sitemap route
    revalidatePath('/sitemap.xml')
    
    return NextResponse.json({ success: true, message: 'Sitemap regenerated successfully' })
  } catch (error) {
    console.error('Error regenerating sitemap:', error)
    return NextResponse.json({ error: 'Failed to regenerate sitemap' }, { status: 500 })
  }
}
