import { NextResponse } from 'next/server'
import { getSupabase } from '../../supabase'

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = getSupabase()
  const body = await req.json()
  const { name, message, memory, photo_urls, shape, color, pos_x, pos_y } = body

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('wishes')
    .insert([{ name, message, memory, photo_urls: photo_urls ?? [], shape, color, pos_x, pos_y }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
