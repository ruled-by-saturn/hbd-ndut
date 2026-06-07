'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BLOB_COLORS = ['#FFB3C6','#B5EAD7','#C7CEEA','#FFDAC1','#FFD6E0','#E2F0CB','#F9D4B6','#D4E9FF','#ECD9FA','#FFFACD','#FFC8DD','#BDE0FE']

interface Blob { id: number; size: number; left: number; top: number; color: string; dur: number; delay: number }

export default function Home() {
  const [blobs, setBlobs] = useState<Blob[]>([])

  useEffect(() => {
    setBlobs(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: 30 + Math.random() * 80,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: BLOB_COLORS[i % BLOB_COLORS.length],
      dur: 5 + Math.random() * 5,
      delay: Math.random() * 6,
    })))
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes floatBlob { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(-28px) scale(1.08)} }
        @keyframes titleBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes cardReveal { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes emojiSpin { 0%{transform:rotate(-8deg)} 100%{transform:rotate(8deg)} }

        .menu-card {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          width: 260px;
          text-align: center;
          border: 2.5px solid var(--green);
          cursor: pointer;
          text-decoration: none;
          color: var(--green);
          box-shadow: 6px 6px 0 var(--green);
          transition: transform 0.18s, box-shadow 0.18s;
          display: block;
        }
        .menu-card:nth-child(1) { animation: cardReveal 0.6s 0.1s ease both; }
        .menu-card:nth-child(2) { animation: cardReveal 0.6s 0.28s ease both; }
        .menu-card:hover { transform: translate(-3px,-3px); box-shadow: 9px 9px 0 var(--green); }
        .menu-card:active { transform: translate(2px,2px); box-shadow: 3px 3px 0 var(--green); }

        .card-emoji { font-size: 3.2rem; display: block; margin-bottom: 1rem; animation: emojiSpin 2.5s ease-in-out infinite alternate; }
        .card-title { font-family: Georgia, serif; font-weight: bold; font-size: 1.35rem; color: var(--green); margin-bottom: 0.4rem; }
        .card-desc { font-family: Helvetica, sans-serif; font-size: 0.88rem; color: var(--green-light); line-height: 1.55; }

        .page-title {
          font-family: Georgia, serif; font-weight: bold;
          font-size: clamp(2rem, 7vw, 3.8rem);
          color: var(--green); text-align: center;
          animation: titleBob 3.5s ease-in-out infinite;
          position: relative; z-index: 2; line-height: 1.15;
        }
        .page-subtitle {
          font-family: Helvetica, sans-serif;
          font-size: clamp(0.82rem, 2.2vw, 1rem);
          color: var(--green-light); text-align: center;
          margin: 0.65rem 0 3rem; font-style: italic;
          position: relative; z-index: 2; letter-spacing: 0.025em;
        }
        .cards-row {
          display: flex; flex-wrap: wrap; gap: 2rem;
          justify-content: center; position: relative; z-index: 2;
        }
        @media (max-width: 580px) { .cards-row { flex-direction: column; align-items: center; } .menu-card { width: 100%; max-width: 300px; } }
      `}</style>

      {/* Background blobs */}
      {blobs.map(b => (
        <div key={b.id} style={{ position:'fixed', borderRadius:'50%', width:b.size, height:b.size, left:`${b.left}%`, top:`${b.top}%`, background:b.color, opacity:0.45, pointerEvents:'none', animation:`floatBlob ${b.dur}s ease-in-out ${b.delay}s infinite alternate` }} />
      ))}

      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
        <div style={{ fontSize:'2.8rem', marginBottom:'0.6rem', position:'relative', zIndex:2 }}>🎂</div>
        <h1 className="page-title">Happy Birthday, Ndut!</h1>
        <p className="page-subtitle">thank you for being born — from your friends</p>

        <div className="cards-row">
          <Link href="/board" className="menu-card">
            <span className="card-emoji">💌</span>
            <div className="card-title">Birthday Board</div>
            <p className="card-desc">Read all the love and wishes from everyone who adores you</p>
          </Link>
          <Link href="/msg" className="menu-card">
            <span className="card-emoji">✍️</span>
            <div className="card-title">Leave a Wish</div>
            <p className="card-desc">Send your birthday message, memory, and a photo</p>
          </Link>
        </div>

        <p style={{ marginTop:'3rem', fontSize:'0.78rem', color:'var(--green-pale)', fontFamily:'Helvetica', position:'relative', zIndex:2 }}>
          made with 💚 just for ndut
        </p>
      </div>
    </main>
  )
}
