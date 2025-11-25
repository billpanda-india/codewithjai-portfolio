import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl } = await request.json()

    if (!websiteUrl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 })
    }

    // Using ApiFlash for screenshot generation
    const apiKey = process.env.APIFLASH_KEY
    const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${apiKey}&url=${encodeURIComponent(websiteUrl)}&width=1200&height=800&format=jpeg&quality=80`

    return NextResponse.json({ 
      success: true, 
      imageUrl: screenshotUrl 
    })
  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
}
