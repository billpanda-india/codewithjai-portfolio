import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  project_interest: z.string().optional(),
})

export async function POST(request: NextRequest) {
  console.log('Contact form API called')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, email, phone, message, project_interest } = contactSchema.parse(body)
    console.log('Validation passed')

    // Store in database (this is the most important part)
    console.log('Attempting to save to database...')
    const { data: insertData, error: dbError } = await supabase.from('contact_submissions').insert({
      name,
      email,
      phone: phone || null,
      message,
      project_interest: project_interest || null,
      status: 'new'
    }).select()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }
    
    console.log('Successfully saved to database:', insertData)

    // Try to send email notification (optional - won't fail if Resend is not configured)
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL || 'your-email@example.com',
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${project_interest ? `<p><strong>Project Interest:</strong> ${project_interest}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        })
      }
    } catch (emailError) {
      // Email failed but submission was saved - that's okay
      console.error('Email notification failed (submission was saved):', emailError)
    }

    console.log('Contact form submission successful!')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact form error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: error.message || 'Failed to send message',
      details: error.toString()
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  try {
    const searchParams = request.nextUrl.searchParams
    const count = searchParams.get('count')

    if (count === 'true') {
      const { count: total } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
      
      return NextResponse.json({ count: total || 0 })
    }

    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Contact fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
