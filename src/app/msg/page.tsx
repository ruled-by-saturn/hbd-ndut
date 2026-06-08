'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { randomShape, randomColor } from '../supabase'

type Status = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

export default function MsgPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [memory, setMemory] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({})
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 3 - photoFiles.length)
    if (!arr.length) return
    arr.forEach(f => {
      const r = new FileReader()
      r.onload = e => setPhotoPreviews(p => [...p, e.target!.result as string].slice(0, 3))
      r.readAsDataURL(f)
    })
    setPhotoFiles(p => [...p, ...arr].slice(0, 3))
  }, [photoFiles.length])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  const removePhoto = (i: number) => {
    setPhotoFiles(p => p.filter((_, idx) => idx !== i))
    setPhotoPreviews(p => p.filter((_, idx) => idx !== i))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim()) e.name = 'Please enter your name!'
    if (!message.trim()) e.message = 'Please write a birthday wish!'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setStatus('uploading')

    let photo_urls: string[] = []
    if (photoFiles.length > 0) {
      const fd = new FormData()
      photoFiles.forEach(f => fd.append('photos', f))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const json = await res.json()
        photo_urls = json.urls ?? []
      }
    }

    setStatus('saving')
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        message: message.trim(),
        memory: memory.trim() || null,
        photo_urls,
        shape: randomShape(),
        color: randomColor(),
        pos_x: 8 + Math.random() * 84,
        pos_y: 8 + Math.random() * 78,
      }),
    })

    setStatus(res.ok ? 'done' : 'error')
  }

  const inp = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.85rem 1rem', borderRadius: '14px',
    border: `2px solid ${hasError ? '#e74c3c' : '#c8e6a0'}`,
    background: 'var(--card-bg)', fontFamily: 'Helvetica, sans-serif',
    fontSize: '0.95rem', color: 'var(--green)', outline: 'none', resize: 'vertical',
    transition: 'border-color .2s, box-shadow .2s',
  })

  if (status === 'done') return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center' }}>
      <style>{`@keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}} @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ fontSize:'5rem', animation:'popIn .55s ease both', marginBottom:'1rem' }}>🎉</div>
      <h2 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'2rem', color:'var(--green)', animation:'fadeUp .5s .25s ease both', opacity:0 }}>Wish sent!</h2>
      <p style={{ fontFamily:'Helvetica', color:'var(--green-light)', marginTop:'0.5rem', marginBottom:'2rem', animation:'fadeUp .5s .45s ease both', opacity:0, lineHeight:1.65 }}>
        Ndut is going to love this. 💚<br/>Your message is now floating on her birthday board.
      </p>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', animation:'fadeUp .5s .65s ease both', opacity:0 }}>
        <Link href="/board" style={{ textDecoration:'none', color:'white', background:'var(--green)', padding:'0.75rem 1.6rem', borderRadius:'999px', fontFamily:'Helvetica', fontWeight:'bold' }}>See the board 💌</Link>
        <button onClick={() => { setName(''); setMessage(''); setMemory(''); setPhotoFiles([]); setPhotoPreviews([]); setStatus('idle') }} style={{ background:'none', border:'2px solid var(--green)', color:'var(--green)', padding:'0.75rem 1.6rem', borderRadius:'999px', fontFamily:'Helvetica', cursor:'pointer' }}>Add another wish</button>
      </div>
    </div>
  )

  const isLoading = status === 'uploading' || status === 'saving'

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'3rem' }}>
      <style>{`
        input:focus, textarea:focus { border-color: var(--green) !important; box-shadow: 0 0 0 3px rgba(45,80,22,.12); }
        .dropzone { border:2px dashed #b5d98a; border-radius:14px; padding:1.4rem 1rem; text-align:center; cursor:pointer; transition:background .18s,border-color .18s; background:#f7fdf0; }
        .dropzone:hover, .dropzone.drag { background:#edf9d8; border-color:var(--green); }
        .submit-btn { background:var(--green); color:white; border:none; padding:1rem 2.5rem; border-radius:999px; font-family:Georgia,serif; font-weight:bold; font-size:1.05rem; cursor:pointer; transition:transform .15s,box-shadow .15s; box-shadow:4px 4px 0 #1a3a08; width:100%; }
        .submit-btn:hover:not(:disabled) { transform:translate(-2px,-2px); box-shadow:6px 6px 0 #1a3a08; }
        .submit-btn:active:not(:disabled) { transform:translate(1px,1px); box-shadow:2px 2px 0 #1a3a08; }
        .submit-btn:disabled { opacity:.65; cursor:not-allowed; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <header style={{ position:'sticky', top:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.5rem', borderBottom:'2px solid #d4e9a0', background:'rgba(255,253,245,.95)', backdropFilter:'blur(8px)' }}>
        <Link href="/" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.82rem', opacity:.7 }}>← home</Link>
        <h1 style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'clamp(1rem,4vw,1.4rem)', color:'var(--green)' }}>Leave a Wish ✍️</h1>
        <Link href="/board" style={{ textDecoration:'none', color:'var(--green)', fontFamily:'Helvetica', fontSize:'0.82rem', opacity:.7 }}>board →</Link>
      </header>

      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'2rem 1.25rem', animation:'fadeIn .5s ease' }}>
        <div style={{ background:'#B5EAD7', borderRadius:'18px', padding:'1.2rem 1.4rem', marginBottom:'2rem', border:'1.5px solid #8fd4b4' }}>
          <p style={{ fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'1.05rem', color:'var(--green)', marginBottom:'0.25rem' }}>💚 Write a wish for Ndut!</p>
          <p style={{ fontFamily:'Helvetica', fontSize:'0.85rem', color:'var(--green-mid)', lineHeight:1.55 }}>Your message will float as a card on her birthday board for everyone to see 🎂</p>
        </div>

        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.95rem', color:'var(--green)', marginBottom:'0.4rem' }}>Your Name <span style={{ color:'#c0392b' }}>*</span></label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tia, Marco, Kiki…" style={inp(!!errors.name)} />
          {errors.name && <p style={{ color:'#c0392b', fontFamily:'Helvetica', fontSize:'0.78rem', marginTop:'0.3rem' }}>⚠ {errors.name}</p>}
        </div>

        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.95rem', color:'var(--green)', marginBottom:'0.4rem' }}>Birthday Wishes for Tfia <span style={{ color:'#c0392b' }}>*</span></label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your heartfelt birthday message here…" rows={5} style={inp(!!errors.message)} />
          {errors.message && <p style={{ color:'#c0392b', fontFamily:'Helvetica', fontSize:'0.78rem', marginTop:'0.3rem' }}>⚠ {errors.message}</p>}
        </div>

        <div style={{ marginBottom:'1.5rem' }}>
          <label style={{ display:'block', fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.95rem', color:'var(--green)', marginBottom:'0.4rem' }}>My Favorite Memory with Tfia <span style={{ fontFamily:'Helvetica', fontWeight:'normal', color:'var(--green-pale)', fontSize:'0.8rem' }}>(optional)</span></label>
          <textarea value={memory} onChange={e => setMemory(e.target.value)} placeholder="Share a memory that makes you smile…" rows={3} style={inp()} />
        </div>

        <div style={{ marginBottom:'2rem' }}>
          <label style={{ display:'block', fontFamily:'Georgia, serif', fontWeight:'bold', fontSize:'0.95rem', color:'var(--green)', marginBottom:'0.4rem' }}>My Favorite Photo of/with Tfia <span style={{ fontFamily:'Helvetica', fontWeight:'normal', color:'var(--green-pale)', fontSize:'0.8rem' }}>(optional, up to 3)</span></label>
          {photoFiles.length < 3 && (
            <div className={`dropzone${isDragging ? ' drag' : ''}`} onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
              <span style={{ fontSize:'2rem' }}>📷</span>
              <p style={{ fontFamily:'Helvetica', fontSize:'0.85rem', color:'var(--green-light)', marginTop:'0.4rem' }}>Click or drag photos here</p>
              <p style={{ fontFamily:'Helvetica', fontSize:'0.75rem', color:'var(--green-pale)', marginTop:'0.2rem' }}>JPG, PNG, GIF — up to 3 photos</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFileChange} style={{ display:'none' }} />
          {photoPreviews.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginTop:'0.75rem' }}>
              {photoPreviews.map((src, i) => (
                <div key={i} style={{ position:'relative', aspectRatio:'1/1' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px', border:'2px solid #d4e9a0' }} />
                  <button onClick={() => removePhoto(i)} style={{ position:'absolute', top:'4px', right:'4px', background:'rgba(45,80,22,.75)', color:'white', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {status === 'error' && <p style={{ color:'#c0392b', fontFamily:'Helvetica', fontSize:'0.88rem', marginBottom:'1rem', textAlign:'center' }}>⚠ Something went wrong. Please try again.</p>}

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {status === 'uploading' ? 'Uploading photos… 📸' : status === 'saving' ? 'Sending wish… 🌸' : 'Send Birthday Wish 🎉'}
        </button>
      </div>
    </div>
  )
}
