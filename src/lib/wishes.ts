export interface Wish {
  id: string
  name: string
  wishes: string
  memory?: string
  photos?: string[] // base64 data URLs
  createdAt: number
  shape: 'circle' | 'cloud' | 'heart' | 'star' | 'duck'
  color: string
  x: number // % from left
  y: number // % from top
}

export const PASTEL_COLORS = [
  '#FFB3C6','#B5EAD7','#C7CEEA','#FFDAC1',
  '#FFD6E0','#E2F0CB','#F9D4B6','#D4E9FF',
  '#ECD9FA','#FFFACD','#FFC8DD','#BDE0FE',
]

export const SHAPES: Wish['shape'][] = ['circle','cloud','heart','star','duck']

export function loadWishes(): Wish[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('hbd-ndut-wishes')
    return raw ? JSON.parse(raw) : getSampleWishes()
  } catch { return getSampleWishes() }
}

export function saveWish(wish: Wish) {
  const wishes = loadWishes()
  wishes.push(wish)
  localStorage.setItem('hbd-ndut-wishes', JSON.stringify(wishes))
}

export function getSampleWishes(): Wish[] {
  return [
    { id:'sample-1', name:'Tia', wishes:'Happy birthday to the most wonderful person! Wishing you all the joy today and always.', memory:'That time we got lost together and ended up finding the most amazing hidden café!', photos:[], createdAt: Date.now()-1000, shape:'heart', color:'#FFB3C6', x:15, y:20 },
    { id:'sample-2', name:'Rara', wishes:'May your day be as bright and beautiful as you are. So lucky to call you my friend!', memory:'Our late night talks that always somehow made me feel so much better.', photos:[], createdAt: Date.now()-2000, shape:'star', color:'#B5EAD7', x:55, y:15 },
    { id:'sample-3', name:'Dani', wishes:'Another year wiser and more amazing. Cheers to you, Ndut!', memory:'That road trip where you sang every single song off-key but somehow it was perfect.', photos:[], createdAt: Date.now()-3000, shape:'cloud', color:'#C7CEEA', x:75, y:50 },
    { id:'sample-4', name:'Kiki', wishes:'Happy birthday bestie! You deserve every good thing coming your way.', memory:'', photos:[], createdAt: Date.now()-4000, shape:'duck', color:'#FFDAC1', x:30, y:60 },
    { id:'sample-5', name:'Marco', wishes:'Wishing you a magical birthday filled with love and laughter!', memory:'Laughing until we cried over absolutely nothing. Classic us.', photos:[], createdAt: Date.now()-5000, shape:'circle', color:'#D4E9FF', x:60, y:70 },
  ]
}
