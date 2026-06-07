'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { loadWishes, type Wish, PASTEL_COLORS, SHAPES } from '../../lib/wishes'

// SVG shape paths
function ShapeContent({ shape, color }: { shape: Wish['shape'], color: string }) {
  const style: React.CSSProperties = { width:'100%', height:'100%', position:'absolute', top:0, left:0 }
  switch(shape) {
    case 'heart':
      return <svg viewBox="0 0 100 90" style={style}><path d="M50 80 C50 80 10 55 10 30 C10 15 22 5 35 10 C42 13 50 22 50 22 C50 22 58 13 65 10 C78 5 90 15 90 30 C90 55 50 80 50 80Z" fill={color} /></svg>
    case 'star':
      return <svg viewBox="0 0 100 100" style={style}><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={color} /></svg>
    case 'cloud':
      return <svg viewBox="0 0 120 80" style={style}><ellipse cx="60" cy="55" rx="50" ry="22" fill={color}/><circle cx="35" cy="48" r="20" fill={color}/><circle cx="60" cy="38" r="26" fill={color}/><circle cx="85" cy="46" r="20" fill={color}/></svg>
    case 'duck':
      return <svg viewBox="0 0 100 100" style={style}>
        <ellipse cx="50" cy="62" rx="32" ry="24" fill={color}/>
        <circle cx="58" cy="38" r="18" fill={color}/>
        <ellipse cx="74" cy="42" rx="10" ry="7" fill="#FFD080"/>
        <circle cx="62" cy="34" r="3" fill="#2D5016"/>
      </svg>
    default: // circle
      return <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:color }} />
  }
}

function WishCard({ wish, onClick }: { wish: Wish, onClick: () => void }) {
  const preview = wish.wishes.split(' ').slice(0,3).join(' ') + (wish.wishes.split(' ').length > 3 ? '…' : '')
  const sizes: Record<Wish['shape'], { w: number, h: number }> = {
    heart: { w:130, h:120 },
    star: { w:130, h:130 },
    cloud: { w:160, h:110 },
    duck: { w:130, h:130 },
    circle: { w:130, h:130 },
  }
  const sz = sizes[wish.shape]

  return (
    <div
      onClick={onClick}
      style={{
        position:'absolute',
        left:`${wish.x}%`,
        top:`${wish.y}%`,
        width: sz.w,
        height: sz.h,
        cursor:'pointer',
        transform:'translate(-50%, -50%)',
        animation:`floatWish ${5 + (wish.createdAt % 4)}s ease-in-out ${(wish.createdAt % 30)/10}s infinite alternate`,
        zIndex: 2,
      }}
    >
      <style>{`
        @keyframes floatWish {
          0% { transform: translate(-50%,-50%) rotate(-2deg) scale(1); }
          100% { transform: translate(-50%,-50%) rotate(2deg) scale(1.06); }
        }
        .wish-card-inner {
          width: 100%; height: 100%;
          position: relative;
          filter: drop-shadow(3px 4px 0px rgba(45,80,22,0.25));
          transition: filter 0.2s, transform 0.2s;
        }
        .wish-card-inner:hover {
          filter: drop-shadow(5px 6px 0px rgba(45,80,22,0.45)) brightness(1.05);
          transform: scale(1.1);
        }
        .wish-card-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: ${wish.shape === 'cloud' ? '1.2rem 1rem 0.4rem' : '0.8rem'};
          text-align: center;
          pointer-events: none;
        }
        .wish-name {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 0.75rem;
          color: #2D5016;
          margin-bottom: 2px;
          letter-spacing: 0.03em;
        }
        .wish-preview {
          font-family: Helvetica, sans-serif;
          font-size: 0.62rem;
          color: #3a5f18;
          line-height: 1.3;
          opacity: 0.85;
        }
      `}</style>
      <div className="wish-card-inner">
        <ShapeContent shape={wish.shape} color={wish.color} />
        <div className="wish-card-text">
          <div className="wish-name">{wish.name}</div>
          <div className="wish-preview">{preview}</div>
        </div>
      </div>
    </div>
  )
}

function Modal({ wish, onClose }: { wish: Wish, onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(45,80,22,0.35)', backdropFilter:'blur(4px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:'#FFFDF5', borderRadius:'24px', border:'2.5px solid var(--green)', boxShadow:'8px 8px 0 var(--green)', maxWidth:'480px', width:'100%', padding:'2rem', maxHeight:'85vh', overflowY:'auto', position:'relative', animation:'modalIn 0.3s ease' }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity:0; transform: scale(0.9) translateY(20px); }
            to { opacity:1; transform: scale(1) translateY(0); }
          }
        `}</style>
        <button
          onClick={onClose}
          style={{ position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'2px solid var(--green)', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', fontSize:'1rem', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' }}
        >×</button>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
          <div style={{ width:48, height:48, position:'relative', flexShrink:0 }}>
            <ShapeContent shape={wish.shape} color={wish.color} />
          </div>
          <div>
            <h2 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1.4rem', color:'var(--green)' }}>{wish.name}</h2>
            <p style={{ fontSize:'0.75rem', color:'#99b87a', fontFamily:'Helvetica' }}>sent a birthday wish 💚</p>
          </div>
        </div>

        <section style={{ marginBottom:'1.25rem' }}>
          <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.85rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Birthday Wish 🎂</h3>
          <p style={{ fontFamily:'Helvetica, sans-serif', fontSize:'1rem', lineHeight:1.6, color:'#2a4a10', background: wish.color + '55', borderRadius:'12px', padding:'0.9rem 1rem' }}>{wish.wishes}</p>
        </section>

        {wish.memory && (
          <section style={{ marginBottom:'1.25rem' }}>
            <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.85rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Favorite Memory 🌸</h3>
            <p style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.95rem', lineHeight:1.6, color:'#2a4a10', background:'#f5fce8', borderRadius:'12px', padding:'0.9rem 1rem', fontStyle:'italic' }}>"{wish.memory}"</p>
          </section>
        )}

        {wish.photos && wish.photos.length > 0 && (
          <section>
            <h3 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.85rem', color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>Favorite Photo(s) 📸</h3>
            <div style={{ display:'grid', gridTemplateColumns: wish.photos.length === 1 ? '1fr' : '1fr 1fr', gap:'0.5rem' }}>
              {wish.photos.map((src, i) => (
                <img key={i} src={src} alt={`Photo from ${wish.name}`} style={{ width:'100%', borderRadius:'12px', objectFit:'cover', aspectRatio:'1/1', border:'2px solid #d4e9b0' }} />
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
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const raw = loadWishes()
    // spread them around if no position set
    const placed = raw.map((w, i) => ({
      ...w,
      x: w.x ?? (10 + (i * 17) % 80),
      y: w.y ?? (15 + (i * 23) % 70),
    }))
    setWishes(placed)
    setLoaded(true)
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes floatWish {
          0% { transform: translate(-50%,-50%) rotate(-2deg) scale(1); }
          100% { transform: translate(-50%,-50%) rotate(2deg) scale(1.06); }
        }
      `}</style>

      {/* Header */}
      <header style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'2px solid #d4e9a0', background:'#FFFDF5' }}>
        <Link href="/" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem', opacity:0.7 }}>
          ← home
        </Link>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1rem, 4vw, 1.4rem)', color:'var(--green)', textAlign:'center' }}>
          Birthday Board 💌
        </h1>
        <Link href="/msg" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.8rem', background:'#B5EAD7', padding:'0.4rem 0.9rem', borderRadius:'999px', border:'1.5px solid var(--green)', whiteSpace:'nowrap' }}>
          + Add wish
        </Link>
      </header>

      {/* Board area */}
      <div style={{ position:'relative', width:'100%', height:'calc(100vh - 64px)', minHeight:'500px' }}>
        {!loaded && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
            <p style={{ fontFamily:'Georgia, serif', color:'var(--green)', fontSize:'1.2rem' }}>Loading wishes… 🌸</p>
          </div>
        )}
        {loaded && wishes.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem' }}>
            <p style={{ fontFamily:'Georgia, serif', color:'var(--green)', fontSize:'1.3rem' }}>No wishes yet!</p>
            <Link href="/msg" style={{ textDecoration:'none', color:'white', background:'var(--green)', padding:'0.75rem 1.5rem', borderRadius:'999px', fontFamily:'Helvetica', fontSize:'0.9rem' }}>Be the first to wish 🎂</Link>
          </div>
        )}
        {loaded && wishes.map(w => (
          <WishCard key={w.id} wish={w} onClick={() => setSelected(w)} />
        ))}

        {/* Hint */}
        {loaded && wishes.length > 0 && (
          <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', fontFamily:'Helvetica', fontSize:'0.75rem', color:'#99b87a', background:'rgba(255,253,245,0.8)', padding:'0.35rem 1rem', borderRadius:'999px', whiteSpace:'nowrap', zIndex:5 }}>
            click any card to read the full wish ✨
          </div>
        )}
      </div>

      {selected && <Modal wish={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
