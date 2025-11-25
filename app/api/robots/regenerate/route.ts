import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    // Revalidate the robots.txt route
    revalidatePath('/robots.txt')
    
    return NextResponse.json({ success: true, message: 'Robots.txt regenerated successfully' })
  } catch (error) {
    console.error('Error regenerating robots.txt:', error)
    return NextResponse.json({ error: 'Failed to regenerate' }, { status: 500 })
  }
}
