import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data: rules, error } = await supabaseAdmin
      .from('firewall_rules')
      .select('*')
      .order('priority', { ascending: true })

    if (error) throw error

    return NextResponse.json(rules || [])
  } catch (error) {
    console.error('Error fetching firewall rules:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, rule_type, pattern, priority, enabled, description } = body

    const { data, error } = await supabaseAdmin
      .from('firewall_rules')
      .insert({
        name,
        rule_type,
        pattern,
        priority,
        enabled,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error adding firewall rule:', error)
    return NextResponse.json({ error: 'Failed to add rule' }, { status: 500 })
  }
}
