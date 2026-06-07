'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { saveWish, PASTEL_COLORS, SHAPES, type Wish } from '../../lib/wishes'

export default function MsgPage() {
  const [name, setName] = useState('')
  const [wishes, setWishes] = useState('')
  const [memory, setMemory] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string, wishes?: string }>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    const readers = files.map(f => new Promise<string>((res, rej) => {
      const r = new FileReader()
      r.onload = () => res(r.result as string)
      r.onerror = rej
      r.readAsDataURL(f)
    }))
    const results = await Promise.all(readers)
    setPhotos(prev => [...prev, ...results].slice(0, 3))
  }

  const removePhoto = (i: number) => setPhotos(p => p.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = 'Please enter your name!'
    if (!wishes.trim()) newErrors.wishes = 'Please write a birthday wish!'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)

    const colorIdx = Math.floor(Math.random() * PASTEL_COLORS.length)
    const shapeIdx = Math.floor(Math.random() * SHAPES.length)

    const wish: Wish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      wishes: wishes.trim(),
      memory: memory.trim() || undefined,
      photos: photos.length ? photos : [],
      createdAt: Date.now(),
      shape: SHAPES[shapeIdx],
      color: PASTEL_COLORS[colorIdx],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 75,
    }

    setTimeout(() => {
      saveWish(wish)
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '14px',
    border: '2px solid #c8e6a0',
    background: '#FFFDF5',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '0.95rem',
    color: '#2D5016',
    outline: 'none',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    color: 'var(--green)',
    marginBottom: '0.4rem',
  }

  const errorStyle: React.CSSProperties = {
    color: '#c0392b',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '0.8rem',
    marginTop: '0.3rem',
  }

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' }}>
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity:0; transform: translateY(20px); }
            to { opacity:1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ fontSize:'5rem', animation:'popIn 0.6s ease both', marginBottom:'1rem' }}>🎉</div>
        <h2 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'2rem', color:'var(--green)', animation:'fadeUp 0.6s 0.3s ease both', opacity:0 }}>Wish sent!</h2>
        <p style={{ fontFamily:'Helvetica, sans-serif', color:'#557a2d', marginTop:'0.5rem', marginBottom:'2rem', animation:'fadeUp 0.6s 0.5s ease both', opacity:0, lineHeight:1.6 }}>
          Ndut is going to love this. 💚<br/>Your message is now floating on the board.
        </p>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', animation:'fadeUp 0.6s 0.7s ease both', opacity:0 }}>
          <Link href="/board" style={{ textDecoration:'none', color:'white', background:'var(--green)', padding:'0.75rem 1.5rem', borderRadius:'999px', fontFamily:'Helvetica', fontSize:'0.95rem', fontWeight:'bold' }}>
            See the board 💌
          </Link>
          <button
            onClick={() => { setName(''); setWishes(''); setMemory(''); setPhotos([]); setSubmitted(false) }}
            style={{ background:'transparent', border:'2px solid var(--green)', color:'var(--green)', padding:'0.75rem 1.5rem', borderRadius:'999px', fontFamily:'Helvetica', fontSize:'0.95rem', cursor:'pointer' }}
          >
            Add another wish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'0 0 3rem' }}>
      <style>{`
        input:focus, textarea:focus { border-color: var(--green) !important; box-shadow: 0 0 0 3px rgba(45,80,22,0.12); }
        .file-drop { border: 2px dashed #b5d98a; border-radius: 14px; padding: 1.2rem; text-align: center; cursor: pointer; transition: background 0.2s; background: #f7fdf0; }
        .file-drop:hover { background: #edf9d8; }
        .submit-btn { background: var(--green); color: white; border: none; padding: 1rem 2.5rem; border-radius: 999px; font-family: Georgia, serif; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 4px 4px 0 #1a3a08; width: 100%; }
        .submit-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #1a3a08; }
        .submit-btn:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 #1a3a08; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <header style={{ position:'sticky', top:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'2px solid #d4e9a0', background:'#FFFDF5' }}>
        <Link href="/" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.85rem', opacity:0.7 }}>← home</Link>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1rem, 4vw, 1.4rem)', color:'var(--green)' }}>Leave a Wish ✍️</h1>
        <Link href="/board" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.8rem', opacity:0.7 }}>board →</Link>
      </header>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'2rem 1.25rem', animation:'fadeIn 0.5s ease' }}>
        {/* Greeting */}
        <div style={{ background:'#B5EAD7', borderRadius:'18px', padding:'1.25rem 1.5rem', marginBottom:'2rem', border:'1.5px solid #8fd4b4' }}>
          <p style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1.05rem', color:'var(--green)', marginBottom:'0.25rem' }}>💚 Write a wish for Ndut!</p>
          <p style={{ fontFamily:'Helvetica, sans-serif', fontSize:'0.85rem', color:'#3a6b1e', lineHeight:1.5 }}>Your message will appear as a floating card on her birthday board. Share your love! 🎂</p>
        </div>

        {/* Name */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={labelStyle}>Your Name <span style={{ color:'#c0392b' }}>*</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tia, Marco, Kiki…"
            style={{ ...inputStyle, borderColor: errors.name ? '#e74c3c' : '#c8e6a0' }}
          />
          {errors.name && <p style={errorStyle}>⚠ {errors.name}</p>}
        </div>

        {/* Birthday wish */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={labelStyle}>Birthday Wishes for Tfia <span style={{ color:'#c0392b' }}>*</span></label>
          <textarea
            value={wishes}
            onChange={e => setWishes(e.target.value)}
            placeholder="Write your heartfelt birthday message here…"
            rows={5}
            style={{ ...inputStyle, borderColor: errors.wishes ? '#e74c3c' : '#c8e6a0' }}
          />
          {errors.wishes && <p style={errorStyle}>⚠ {errors.wishes}</p>}
        </div>

        {/* Memory */}
        <div style={{ marginBottom:'1.5rem' }}>
          <label style={labelStyle}>My Favorite Memory with Tfia <span style={{ fontWeight:'normal', color:'#99b87a', fontSize:'0.8rem' }}>(optional)</span></label>
          <textarea
            value={memory}
            onChange={e => setMemory(e.target.value)}
            placeholder="Share a memory that makes you smile…"
            rows={3}
            style={inputStyle}
          />
        </div>

        {/* Photos */}
        <div style={{ marginBottom:'2rem' }}>
          <label style={labelStyle}>My Favorite Photo of/with Tfia <span style={{ fontWeight:'normal', color:'#99b87a', fontSize:'0.8rem' }}>(optional, up to 3)</span></label>
          {photos.length < 3 && (
            <>
              <div className="file-drop" onClick={() => fileRef.current?.click()}>
                <span style={{ fontSize:'2rem' }}>📷</span>
                <p style={{ fontFamily:'Helvetica', fontSize:'0.85rem', color:'#557a2d', marginTop:'0.4rem' }}>Click to upload photos</p>
                <p style={{ fontFamily:'Helvetica', fontSize:'0.75rem', color:'#99b87a', marginTop:'0.2rem' }}>JPG, PNG, GIF — up to 3 photos</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display:'none' }} />
            </>
          )}
          {photos.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.5rem', marginTop:'0.75rem' }}>
              {photos.map((src, i) => (
                <div key={i} style={{ position:'relative', aspectRatio:'1/1' }}>
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px', border:'2px solid #d4e9a0' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{ position:'absolute', top:'4px', right:'4px', background:'rgba(45,80,22,0.75)', color:'white', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sending… 🌸' : 'Send Birthday Wish 🎉'}
        </button>
      </div>
    </div>
  )
}
