import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import nodemailer from 'nodemailer'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Get SMTP settings
    const { data: smtpSettings, error: smtpError } = await supabaseAdmin
      .from('smtp_settings')
      .select('*')
      .single()

    if (smtpError || !smtpSettings) {
      return NextResponse.json({ 
        error: 'SMTP settings not configured. Please configure SMTP in Site Settings.' 
      }, { status: 400 })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.use_ssl ?? (smtpSettings.port === 465),
      auth: {
        user: smtpSettings.user_email,
        pass: smtpSettings.password
      }
    })

    // Send email
    await transporter.sendMail({
      from: `"${smtpSettings.from_name}" <${smtpSettings.from_email}>`,
      to: lead.email,
      subject: `Re: Your message to ${smtpSettings.from_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Thank you for contacting us!</h2>
          <p>Hi ${lead.name},</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Your original message:</strong><br>
            ${lead.message.replace(/\n/g, '<br>')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This is a reply to your message sent on ${new Date(lead.created_at).toLocaleString()}
          </p>
        </div>
      `
    })

    // Update lead status
    const { error: updateError } = await supabaseAdmin
      .from('contact_submissions')
      .update({
        status: 'replied',
        reply_message: message,
        replied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending reply:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to send reply' 
    }, { status: 500 })
  }
}
