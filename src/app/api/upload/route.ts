import { NextResponse } from 'next/server'
import { getSupabase } from '../../supabase'

export async function POST(req: Request) {
  const supabase = getSupabase()
  const formData = await req.formData()
  const files = formData.getAll('photos') as File[]

  if (!files || files.length === 0) return NextResponse.json({ urls: [] })

  const urls: string[] = []

  for (const file of files.slice(0, 3)) {
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
      .from('wish-photos')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) { console.error('Upload error:', error.message); continue }

    const { data } = supabase.storage.from('wish-photos').getPublicUrl(filename)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
