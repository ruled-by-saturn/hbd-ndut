'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { Wish } from '../supabase'

function ShapeBg({ shape, color }: { shape: Wish['shape']; color: string }) {
  const s: React.CSSProperties = { position:'absolute', inset:0, width:'100%', height:'100%' }
  if (shape === 'heart')
    return <svg viewBox="0 0 100 92" style={s}><path d="M50 82 C50 82 8 54 8 28 C8 13 21 4 34 9 C42 12 50 22 50 22 C50 22 58 12 66 9 C79 4 92 13 92 28 C92 54 50 82 50 82Z" fill={color}/></svg>
  if (shape === 'star')
    return <svg viewBox="0 0 100 100" style={s}><polygon points="50,4 62,36 96,36 69,58 80,90 50,68 20,90 31,58 4,36 38,36" fill={color}/></svg>
  if (shape === 'cloud')
    return <svg viewBox="0 0 130 85" style={s}><ellipse cx="65" cy="58" rx="55" ry="24" fill={color}/><circle cx="38" cy="50" r="22" fill={color}/><circle cx="65" cy="40" r="28" fill={color}/><circle cx="92" cy="50" r="22" fill={color}/></svg>
  if (shape === 'duck')
    return <svg viewBox="0 0 100 100" style={s}>
      <ellipse cx="50" cy="65" rx="33" ry="25" fill={color}/>
      <circle cx="58" cy="38" r="20" fill={color}/>
      <ellipse cx="76" cy="43" rx="11" ry="8" fill="#FFD080"/>
      <circle cx="62" cy="33" r="3.5" fill="#2D5016"/>
    </svg>
  return <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:color }} />
}

function WishCard({ wish, onClick }: { wish: Wish; onClick: () => void }) {
  const preview = wish.message.split(' ').slice(0, 3).join(' ') + (wish.message.split(' ').length > 3 ? '…' : '')
  const dims: Record<Wish['shape'], [number, number]> = {
    heart:[128,118], star:[128,128], cloud:[158,108], duck:[128,128], circle:[128,128],
  }
  const [w, h] = dims[wish.shape]
  const seed = parseInt(wish.id.replace(/-/g, '').slice(0, 8), 16) || 1000
  const floatDur = 5 + (seed % 4)
  const floatDelay = (seed % 30) / 10

  return (
    <button
      onClick={onClick}
      aria-label={`Wish from ${wish.name}`}
      style={{ position:'absolute', left:`${wish.pos_x}%`, top:`${wish.pos_y}%`, width:w, height:h, transform:'translate(-50%,-50%)', background:'none', border:'none', cursor:'pointer', padding:0, animation:`floatCard ${floatDur}s ease-in-out ${floatDelay}s infinite alternate`, zIndex:2 }}
    >
      <style>{`
        @keyframes floatCard { 0%{transform:translate(-50%,-50%) rotate(-2.5deg) scale(1)} 100%{transform:translate(-50%,-50%) rotate(2.5deg) scale(1.07)} }
        .wcard { width:100%; height:100%; position:relative; filter:drop-shadow(3px 4px 0 rgba(45,80,22,.22)); transition:filter .2s, transform .15s; }
        .wcard:hover { filter:drop-shadow(5px 7px 0 rgba(45,80,22,.4)) brightness(1.06); transform:scale(1.1); }
      `}</style>
      <div className="wcard">
        <ShapeBg shape={wish.shape} color={wish.color} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: wish.shape==='cloud' ? '1.3rem 1rem 0.3rem' : '0.8rem', textAlign:'center', pointerEvents:'none' }}>
          <span style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.73rem', color:'#2D5016', letterSpacing:'0.03em', marginBottom:'2px', maxWidth:'90%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{wish.name}</span>
          <span style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.6rem', color:'#3a5f18', lineHeight:1.3, opacity:0.85 }}>{preview}</span>
        </div>
      </div>
    </button>
  )
}

function Modal({ wish, onClose }: { wish: Wish; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(45,80,22,.32)', backdropFilter:'blur(5px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--card-bg)', borderRadius:'24px', border:'2.5px solid var(--green)', boxShadow:'8px 8px 0 var(--green)', maxWidth:'480px', width:'100%', padding:'2rem', maxHeight:'88vh', overflowY:'auto', position:'relative', animation:'modalIn .28s ease' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <button onClick={onClose} style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'2px solid var(--green)', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', color:'var(--green)', fontWeight:'bold', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>

        <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1.5rem' }}>
          <div style={{ width:48, height:48, position:'relative', flexShrink:0 }}><ShapeBg shape={wish.shape} color={wish.color} /></div>
          <div>
            <h2 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1.4rem', color:'var(--green)' }}>{wish.name}</h2>
            <p style={{ fontSize:'0.72rem', color:'var(--green-pale)', fontFamily:'Helvetica' }}>sent a birthday wish 💚</p>
          </div>
        </div>

        <section style={{ marginBottom:'1.2rem' }}>
          <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.8rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>birthday wish 🎂</h3>
          <p style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.98rem', lineHeight:1.65, color:'#2a4a10', background:`${wish.color}55`, borderRadius:'14px', padding:'0.9rem 1.1rem' }}>{wish.message}</p>
        </section>

        {wish.memory && (
          <section style={{ marginBottom:'1.2rem' }}>
            <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.8rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>favorite memory 🌸</h3>
            <p style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.93rem', lineHeight:1.65, color:'#2a4a10', background:'#f4fce8', borderRadius:'14px', padding:'0.9rem 1.1rem', fontStyle:'italic' }}>"{wish.memory}"</p>
          </section>
        )}

        {wish.photo_urls && wish.photo_urls.length > 0 && (
          <section>
            <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.8rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.7rem' }}>photo(s) 📸</h3>
            <div style={{ display:'grid', gridTemplateColumns: wish.photo_urls.length === 1 ? '1fr' : '1fr 1fr', gap:'0.5rem' }}>
              {wish.photo_urls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`Photo from ${wish.name}`} style={{ width:'100%', borderRadius:'12px', objectFit:'cover', aspectRatio:'1/1', border:'2px solid #d4e9a0' }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default function Board() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [selected, setSelected] = useState<Wish | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchWishes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wishes')
      if (!res.ok) throw new Error('Failed to load')
      setWishes(await res.json())
    } catch {
      setError('Could not load wishes. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWishes() }, [fetchWishes])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
      <header style={{ position:'sticky', top:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.5rem', borderBottom:'2px solid #d4e9a0', background:'rgba(255,253,245,.95)', backdropFilter:'blur(8px)' }}>
        <Link href="/" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.82rem', opacity:0.7 }}>← home</Link>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1rem, 4vw, 1.4rem)', color:'var(--green)' }}>birthday board 💌</h1>
        <Link href="/msg" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.78rem', background:'#B5EAD7', padding:'0.38rem 0.9rem', borderRadius:'999px', border:'1.5px solid var(--green)', whiteSpace:'nowrap' }}>+ add wish</Link>
      </header>

      <div style={{ position:'relative', width:'100%', height:'calc(100vh - 62px)', minHeight:'500px' }}>
        {loading && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', animation:'spin 1.5s linear infinite', display:'inline-block' }}>🌸</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ fontFamily:'Georgia, serif', color:'var(--green)', marginTop:'0.75rem' }}>Loading wishes…</p>
            </div>
          </div>
        )}
        {!loading && error && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem' }}>
            <p style={{ fontFamily:'Helvetica', color:'#c0392b' }}>{error}</p>
            <button onClick={fetchWishes} style={{ background:'var(--green)', color:'white', border:'none', padding:'0.6rem 1.4rem', borderRadius:'999px', fontFamily:'Helvetica', cursor:'pointer' }}>Retry</button>
          </div>
        )}
        {!loading && !error && wishes.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem', textAlign:'center', padding:'2rem' }}>
            <p style={{ fontFamily:'Georgia, serif', fontSize:'1.3rem', color:'var(--green)' }}>no wishes yet!</p>
            <Link href="/msg" style={{ textDecoration:'none', color:'white', background:'var(--green)', padding:'0.75rem 1.6rem', borderRadius:'999px', fontFamily:'Helvetica', fontWeight:'bold' }}>send the first wish 🎂</Link>
          </div>
        )}
        {!loading && !error && wishes.map(w => (
          <WishCard key={w.id} wish={w} onClick={() => setSelected(w)} />
        ))}
        {!loading && !error && wishes.length > 0 && (
          <p style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', fontFamily:'Helvetica', fontSize:'0.73rem', color:'var(--green-pale)', background:'rgba(255,253,245,.82)', padding:'0.3rem 1rem', borderRadius:'999px', whiteSpace:'nowrap', zIndex:5 }}>
            click any card to read the full wish ✨
          </p>
        )}
      </div>

      {selected && <Modal wish={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
