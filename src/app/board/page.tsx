'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { Wish } from '../supabase'

/* ─── Shape backgrounds ─── */
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
      <circle cx="62" cy="33" r="3.5" fill="#3D7A1A"/>
    </svg>
  return <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:color }} />
}

/* ─── Card dimensions ─── */
const DIMS: Record<Wish['shape'], [number, number]> = {
  heart:[128,118], star:[128,128], cloud:[158,108], duck:[128,128], circle:[128,128],
}

/* ─── DVD-style moving card (no delete button here) ─── */
interface CardState { id: string; x: number; y: number; vx: number; vy: number }

function DVDCard({ wish, state, onClick }: { wish: Wish; state: CardState; onClick: () => void }) {
  const preview = wish.message.split(' ').slice(0, 3).join(' ') + (wish.message.split(' ').length > 3 ? '…' : '')
  const [w, h] = DIMS[wish.shape]

  return (
    <div style={{ position:'absolute', left: state.x, top: state.y, width:w, height:h, willChange:'left,top', zIndex:2 }}>
      <style>{`
        .wcard-inner { width:100%; height:100%; position:relative; filter:drop-shadow(3px 4px 0 rgba(45,80,22,.22)); transition:filter .2s, transform .15s; cursor:pointer; background:none; border:none; padding:0; }
        .wcard-inner:hover { filter:drop-shadow(5px 7px 0 rgba(45,80,22,.4)) brightness(1.06); transform:scale(1.08); }
      `}</style>
      <button onClick={onClick} className="wcard-inner" aria-label={`wish from ${wish.name}`}>
        <ShapeBg shape={wish.shape} color={wish.color} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: wish.shape==='cloud' ? '1.3rem 1rem 0.3rem' : '0.8rem', textAlign:'center', pointerEvents:'none' }}>
          <span style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.73rem', color:'#2D5016', letterSpacing:'0.03em', marginBottom:'2px', maxWidth:'90%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{wish.name}</span>
          <span style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.6rem', color:'#3a5f18', lineHeight:1.3, opacity:0.85 }}>{preview}</span>
        </div>
      </button>
    </div>
  )
}

/* ─── Wish detail modal (with delete button inside) ─── */
function Modal({ wish, onClose, onDeleteClick }: { wish: Wish; onClose: () => void; onDeleteClick: () => void }) {
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

        {/* close button */}
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
          <section style={{ marginBottom:'1.2rem' }}>
            <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.8rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.7rem' }}>photo(s) 📸</h3>
            <div style={{ display:'grid', gridTemplateColumns: wish.photo_urls.length === 1 ? '1fr' : '1fr 1fr', gap:'0.5rem' }}>
              {wish.photo_urls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`photo from ${wish.name}`} style={{ width:'100%', borderRadius:'12px', objectFit:'cover', aspectRatio:'1/1', border:'2px solid #d4e9a0' }} />
              ))}
            </div>
          </section>
        )}

        {/* delete button at the bottom of the modal */}
        <div style={{ borderTop:'1.5px solid #e8f5d0', paddingTop:'1rem', marginTop:'0.5rem', display:'flex', justifyContent:'flex-end' }}>
          <button
            onClick={onDeleteClick}
            style={{ background:'none', border:'1.5px solid #e74c3c', color:'#e74c3c', fontFamily:'Helvetica', fontSize:'0.78rem', padding:'0.4rem 1rem', borderRadius:'999px', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.35rem', transition:'background .15s, color .15s' }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background='#e74c3c'; (e.currentTarget as HTMLButtonElement).style.color='white' }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background='none'; (e.currentTarget as HTMLButtonElement).style.color='#e74c3c' }}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            delete this wish
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Delete password modal ─── */
function DeleteModal({ wish, onClose, onDeleted }: { wish: Wish; onClose: () => void; onDeleted: (id: string) => void }) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  const handleDelete = async () => {
    setStatus('loading')
    const res = await fetch('/api/wishes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: wish.id, password }),
    })
    if (res.ok) { onDeleted(wish.id); onClose() }
    else setStatus('error')
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(45,80,22,.32)', backdropFilter:'blur(5px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--card-bg)', borderRadius:'24px', border:'2.5px solid var(--green)', boxShadow:'8px 8px 0 var(--green)', maxWidth:'360px', width:'100%', padding:'2rem', animation:'modalIn .28s ease' }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🔒</div>
          <h2 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1.2rem', color:'var(--green)', marginBottom:'0.3rem' }}>enter the secret code</h2>
          <p style={{ fontFamily:'Helvetica', fontSize:'0.82rem', color:'var(--green-light)' }}>to delete <strong>{wish.name}</strong>'s wish</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setStatus('idle') }}
          onKeyDown={e => { if (e.key === 'Enter') handleDelete() }}
          placeholder="secret code"
          autoFocus
          style={{ width:'100%', padding:'0.85rem 1rem', borderRadius:'14px', border:`2px solid ${status === 'error' ? '#e74c3c' : '#c8e6a0'}`, background:'var(--bg)', fontFamily:'Helvetica', fontSize:'0.95rem', color:'var(--green)', outline:'none', marginBottom:'0.5rem', textAlign:'center', letterSpacing:'0.15em' }}
        />
        {status === 'error' && <p style={{ color:'#e74c3c', fontFamily:'Helvetica', fontSize:'0.78rem', textAlign:'center', marginBottom:'0.5rem' }}>⚠ wrong code, try again</p>}
        <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
          <button onClick={onClose} style={{ flex:1, padding:'0.75rem', borderRadius:'999px', border:'2px solid var(--green)', background:'none', color:'var(--green)', fontFamily:'Helvetica', cursor:'pointer' }}>cancel</button>
          <button onClick={handleDelete} disabled={!password || status === 'loading'} style={{ flex:1, padding:'0.75rem', borderRadius:'999px', border:'none', background:'#e74c3c', color:'white', fontFamily:'Georgia, serif', fontWeight:'bold', cursor:'pointer', opacity: !password || status === 'loading' ? 0.6 : 1 }}>
            {status === 'loading' ? 'deleting…' : 'delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Board gate ─── */
function BoardGate({ onUnlock }: { onUnlock: () => void }) {
  const [answer, setAnswer] = useState('')
  const [shake, setShake] = useState(false)
  const [unlocking, setUnlocking] = useState(false)

  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === 'melon') {
      setUnlocking(true)
      setTimeout(onUnlock, 600)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setAnswer('')
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <style>{`
        @keyframes gateIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
        @keyframes unlockPop { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.08)} }
      `}</style>
      <div style={{ maxWidth:'400px', width:'100%', textAlign:'center', animation: unlocking ? 'unlockPop .6s ease forwards' : 'gateIn .5s ease' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔐</div>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1.3rem, 5vw, 1.8rem)', color:'var(--green)', marginBottom:'0.75rem', lineHeight:1.3 }}>hold on. are you tafia?</h1>
        <p style={{ fontFamily:'Helvetica', fontSize:'0.95rem', color:'var(--green-light)', marginBottom:'2rem', lineHeight:1.6 }}>what is tafia's favorite milk flavor?</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="type your answer…"
            autoFocus
            style={{ width:'100%', padding:'0.9rem 1.2rem', borderRadius:'14px', border:'2px solid #c8e6a0', background:'var(--card-bg)', fontFamily:'Helvetica', fontSize:'1rem', color:'var(--green)', outline:'none', textAlign:'center', animation: shake ? 'shake .5s ease' : 'none' }}
          />
          <button
            onClick={handleSubmit}
            style={{ width:'100%', padding:'0.9rem', borderRadius:'999px', border:'none', background:'var(--green)', color:'white', fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1rem', cursor:'pointer', boxShadow:'4px 4px 0 #1a4a08' }}
          >
            let me in 🍈
          </button>
        </div>
        <Link href="/" style={{ display:'inline-block', marginTop:'1.5rem', fontFamily:'Helvetica', fontSize:'0.8rem', color:'var(--green-pale)', textDecoration:'none' }}>← back to home</Link>
      </div>
    </div>
  )
}

/* ─── DVD bounce engine ─── */
const SPEED = 1.2

function initCardStates(wishes: Wish[], boardW: number, boardH: number): CardState[] {
  return wishes.map(w => {
    const [cw, ch] = DIMS[w.shape]
    return {
      id: w.id,
      x: Math.random() * Math.max(1, boardW - cw),
      y: Math.random() * Math.max(1, boardH - ch),
      vx: (Math.random() > 0.5 ? 1 : -1) * (SPEED * 0.7 + Math.random() * SPEED * 0.6),
      vy: (Math.random() > 0.5 ? 1 : -1) * (SPEED * 0.7 + Math.random() * SPEED * 0.6),
    }
  })
}

/* ─── Main board ─── */
function BoardContent() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [cardStates, setCardStates] = useState<CardState[]>([])
  const [selected, setSelected] = useState<Wish | null>(null)
  const [toDelete, setToDelete] = useState<Wish | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const boardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const statesRef = useRef<CardState[]>([])
  const wishesRef = useRef<Wish[]>([])

  const fetchWishes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wishes')
      if (!res.ok) throw new Error('fail')
      const data: Wish[] = await res.json()
      setWishes(data)
      wishesRef.current = data
    } catch {
      setError('could not load wishes. please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWishes() }, [fetchWishes])

  useEffect(() => {
    if (!wishes.length || !boardRef.current) return
    const { clientWidth: w, clientHeight: h } = boardRef.current
    const states = initCardStates(wishes, w, h)
    statesRef.current = states
    setCardStates(states)
  }, [wishes])

  useEffect(() => {
    if (!cardStates.length) return
    const animate = () => {
      const board = boardRef.current
      if (!board) return
      const boardW = board.clientWidth
      const boardH = board.clientHeight

      statesRef.current = statesRef.current.map(s => {
        const wish = wishesRef.current.find(w => w.id === s.id)
        if (!wish) return s
        const [cw, ch] = DIMS[wish.shape]
        let { x, y, vx, vy } = s
        x += vx; y += vy
        if (x <= 0) { x = 0; vx = Math.abs(vx) }
        else if (x + cw >= boardW) { x = boardW - cw; vx = -Math.abs(vx) }
        if (y <= 0) { y = 0; vy = Math.abs(vy) }
        else if (y + ch >= boardH) { y = boardH - ch; vy = -Math.abs(vy) }
        return { ...s, x, y, vx, vy }
      })

      setCardStates([...statesRef.current])
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cardStates.length])

  const handleDeleted = useCallback((id: string) => {
    setWishes(prev => {
      const next = prev.filter(w => w.id !== id)
      wishesRef.current = next
      statesRef.current = statesRef.current.filter(s => s.id !== id)
      return next
    })
    setSelected(null)
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <header style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.5rem', borderBottom:'2px solid #d4e9a0', background:'rgba(253,250,232,.95)', backdropFilter:'blur(8px)', zIndex:10 }}>
        <Link href="/" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.82rem', opacity:0.7 }}>← home</Link>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1rem, 4vw, 1.4rem)', color:'var(--green)' }}>birthday board 💌</h1>
        <Link href="/msg" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.78rem', background:'#B5EAD7', padding:'0.38rem 0.9rem', borderRadius:'999px', border:'1.5px solid var(--green)', whiteSpace:'nowrap' }}>+ add wish</Link>
      </header>

      <div ref={boardRef} style={{ flex:1, position:'relative', overflow:'hidden', minHeight:'calc(100vh - 62px)' }}>
        {/* watermark */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, pointerEvents:'none' }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');`}</style>
          <div style={{ textAlign:'center', color:'#2D5016', opacity:0.18, lineHeight:1.3, userSelect:'none' }}>
            <div style={{ fontFamily:"'Caveat', cursive", fontSize:'clamp(2.8rem, 8vw, 5.5rem)', fontWeight:600 }}>happy birthday :)</div>
            <div style={{ fontFamily:"'Caveat', cursive", fontSize:'clamp(1.6rem, 5vw, 3.2rem)', fontWeight:600, marginTop:'0.1em' }}>2026.06.10</div>
          </div>
        </div>
        {loading && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', animation:'spin 1.5s linear infinite', display:'inline-block' }}>🌸</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ fontFamily:'Georgia, serif', color:'var(--green)', marginTop:'0.75rem' }}>loading wishes…</p>
            </div>
          </div>
        )}
        {!loading && error && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem' }}>
            <p style={{ fontFamily:'Helvetica', color:'#c0392b' }}>{error}</p>
            <button onClick={fetchWishes} style={{ background:'var(--green)', color:'white', border:'none', padding:'0.6rem 1.4rem', borderRadius:'999px', fontFamily:'Helvetica', cursor:'pointer' }}>retry</button>
          </div>
        )}
        {!loading && !error && wishes.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem', textAlign:'center', padding:'2rem' }}>
            <p style={{ fontFamily:'Georgia, serif', fontSize:'1.3rem', color:'var(--green)' }}>no wishes yet!</p>
            <Link href="/msg" style={{ textDecoration:'none', color:'white', background:'var(--green)', padding:'0.75rem 1.6rem', borderRadius:'999px', fontFamily:'Helvetica', fontWeight:'bold' }}>send the first wish 🎂</Link>
          </div>
        )}

        {cardStates.map(state => {
          const wish = wishes.find(w => w.id === state.id)
          if (!wish) return null
          return <DVDCard key={wish.id} wish={wish} state={state} onClick={() => setSelected(wish)} />
        })}

        {!loading && !error && wishes.length > 0 && (
          <p style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', fontFamily:'Helvetica', fontSize:'0.73rem', color:'var(--green-pale)', background:'rgba(253,250,232,.82)', padding:'0.3rem 1rem', borderRadius:'999px', whiteSpace:'nowrap', zIndex:5, pointerEvents:'none' }}>
            click any card to read the full wish ✨
          </p>
        )}
      </div>

      {selected && (
        <Modal
          wish={selected}
          onClose={() => setSelected(null)}
          onDeleteClick={() => { setToDelete(selected); setSelected(null) }}
        />
      )}
      {toDelete && (
        <DeleteModal
          wish={toDelete}
          onClose={() => setToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}

/* ─── Page root ─── */
export default function Board() {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('board-unlocked') === 'yes') setUnlocked(true)
  }, [])

  const handleUnlock = () => {
    sessionStorage.setItem('board-unlocked', 'yes')
    setUnlocked(true)
  }

  if (!unlocked) return <BoardGate onUnlock={handleUnlock} />
  return <BoardContent />
}
