'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const confettiColors = ['#FFB3C6','#B5EAD7','#C7CEEA','#FFDAC1','#FFD6E0','#E2F0CB','#F9D4B6','#D4E9FF','#ECD9FA']

function FloatingPetal({ style }: { style: React.CSSProperties }) {
  return <div style={{ position:'fixed', borderRadius:'50%', opacity:0.5, pointerEvents:'none', ...style }} />
}

export default function Home() {
  const [petals] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 20 + Math.random() * 60,
      left: Math.random() * 100,
      color: confettiColors[i % confettiColors.length],
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    }))
  )

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', overflow:'hidden', position:'relative' }}>
      {/* floating background blobs */}
      {petals.map(p => (
        <FloatingPetal key={p.id} style={{
          width: p.size, height: p.size,
          left: `${p.left}%`, top: `${20 + Math.random()*60}%`,
          background: p.color,
          animation: `floatBlob ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}

      <style>{`
        @keyframes floatBlob {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 280px;
          text-align: center;
          border: 2.5px solid var(--green);
          cursor: pointer;
          text-decoration: none;
          color: var(--green);
          box-shadow: 6px 6px 0px var(--green);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.7s ease both;
          display: block;
        }
        .menu-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0px var(--green);
        }
        .menu-card:active {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0px var(--green);
        }
        .card-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .card-title {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1.4rem;
          color: var(--green);
          margin-bottom: 0.5rem;
        }
        .card-desc {
          font-family: Helvetica, sans-serif;
          font-size: 0.9rem;
          color: #557a2d;
          line-height: 1.5;
        }
        .page-title {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: clamp(2rem, 6vw, 3.5rem);
          color: var(--green);
          text-align: center;
          margin-bottom: 0.6rem;
          animation: titleFloat 3s ease-in-out infinite;
          position: relative;
          z-index: 2;
        }
        .page-subtitle {
          font-family: Helvetica, sans-serif;
          font-size: clamp(0.85rem, 2.5vw, 1.05rem);
          color: #557a2d;
          text-align: center;
          margin-bottom: 3rem;
          font-style: italic;
          position: relative;
          z-index: 2;
          letter-spacing: 0.02em;
        }
        .cards-row {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .cards-row { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🎂</div>
        <h1 className="page-title">Happy Birthday, Ndut!</h1>
        <p className="page-subtitle">thank you for being born — from your friends</p>

        <div className="cards-row">
          <Link href="/board" className="menu-card" style={{ animationDelay:'0.1s' }}>
            <span className="card-icon">💌</span>
            <div className="card-title">Birthday Board</div>
            <p className="card-desc">Read all the love and wishes from people who adore you</p>
          </Link>

          <Link href="/msg" className="menu-card" style={{ animationDelay:'0.3s' }}>
            <span className="card-icon">✍️</span>
            <div className="card-title">Leave a Wish</div>
            <p className="card-desc">Send your birthday message and a favorite memory</p>
          </Link>
        </div>

        <div style={{ marginTop:'3rem', fontSize:'0.8rem', color:'#99b87a', fontFamily:'Helvetica, sans-serif', position:'relative', zIndex:2 }}>
          made with 💚 for ndut
        </div>
      </div>
    </main>
  )
}
