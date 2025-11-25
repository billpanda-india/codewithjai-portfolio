import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    // Fetch SMTP settings
    const { data: smtpSettings, error } = await supabase
      .from('smtp_settings')
      .select('*')
      .single()

    if (error || !smtpSettings) {
      return NextResponse.json(
        { error: 'SMTP settings not configured' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.use_ssl ?? (smtpSettings.port === 465),
      auth: {
        user: smtpSettings.user_email,
        pass: smtpSettings.password,
      },
    })

    // Send test email
    const info = await transporter.sendMail({
      from: `"${smtpSettings.from_name}" <${smtpSettings.from_email}>`,
      to: testEmail,
      subject: 'SMTP Test Email',
      html: `
        <h1>SMTP Configuration Test</h1>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <p>If you received this email, your SMTP configuration is successful!</p>
      `,
    })

    console.log('Email sent successfully:', info)

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: info.messageId
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email. Please check your SMTP settings.' },
      { status: 500 }
    )
  }
}
