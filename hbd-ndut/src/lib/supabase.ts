import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _client = createClient(url, key)
  }
  return _client
}

export interface Wish {
  id: string
  name: string
  message: string
  memory?: string
  photo_urls: string[]
  shape: 'circle' | 'cloud' | 'heart' | 'star' | 'duck'
  color: string
  pos_x: number
  pos_y: number
  created_at: string
}

export const PASTEL_COLORS = [
  '#FFB3C6','#B5EAD7','#C7CEEA','#FFDAC1',
  '#FFD6E0','#E2F0CB','#F9D4B6','#D4E9FF',
  '#ECD9FA','#FFFACD','#FFC8DD','#BDE0FE',
]

export const SHAPES: Wish['shape'][] = ['circle','cloud','heart','star','duck']

export function randomShape(): Wish['shape'] {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

export function randomColor(): string {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)]
}
