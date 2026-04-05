'use client'

import { useEffect, useRef, useCallback, useLayoutEffect } from 'react'

/* ─────────────────────────────────────────
   GLYPH CACHE — module-level, persiste tra render
───────────────────────────────────────── */
const glyphCache = new Map()

function buildGlyph(letter, cols, rows, thresh) {
  const canvas = document.createElement('canvas')
  canvas.width  = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, cols, rows)
  ctx.fillStyle = '#fff'

  const fs = cols * 3.5
  ctx.font = `bold ${fs}px monospace`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.save()
  ctx.scale(cols / fs, rows / fs)
  ctx.fillText(letter, fs / 2, fs / 2)
  ctx.restore()

  const data = ctx.getImageData(0, 0, cols, rows).data
  const raw = new Uint8Array(cols * rows)
  for (let i = 0; i < cols * rows; i++) {
    raw[i] = data[i * 4] > thresh ? 1 : 0
  }

  // trova il bordo sinistro e destro effettivo della lettera
  let minX = cols, maxX = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (raw[y * cols + x]) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }

  // fallback se lettera vuota (es. spazio)
  if (minX > maxX) { minX = 0; maxX = Math.floor(cols / 2) }

  const trimmedCols = maxX - minX + 1
  const grid = new Uint8Array(trimmedCols * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < trimmedCols; x++) {
      grid[y * trimmedCols + x] = raw[y * cols + (x + minX)]
    }
  }

  grid._cols = trimmedCols
  grid._rows = rows
  return grid
}

function getGlyph(letter, cols, rows, thresh) {
  const key = `${letter}-${cols}-${rows}-${thresh}`
  if (!glyphCache.has(key)) {
    glyphCache.set(key, buildGlyph(letter, cols, rows, thresh))
  }
  return glyphCache.get(key)
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function AsciiText({
  text   = 'ASCII',
  cols   = 40,
  rows   = 32,
  gap    = 1,
  speed  = 70,
  chars  = '@#$%&RF3T4+=-:.',
  thresh = 30,
  className,
  style,
}) {
  const preRef = useRef(null)
  const ivRef  = useRef(null)

  const render = useCallback(() => {
    const el = preRef.current
    if (!el) return

    const letters = text.split('')
    const glyphs  = letters.map(l => getGlyph(l, cols, rows, thresh))
    const n       = glyphs.length
    const clen    = chars.length
    const out     = []

    for (let y = 0; y < rows; y++) {
      if (y > 0) out.push('\n')
      for (let g = 0; g < n; g++) {
        if (g > 0) out.push(' '.repeat(gap))
        const glyph = glyphs[g]
        const gCols = glyph._cols
        const base  = y * gCols
        for (let x = 0; x < gCols; x++) {
          out.push(
            glyph[base + x]
              ? chars[Math.floor(Math.random() * clen)]
              : ' '
          )
        }
      }
    }

    el.textContent = out.join('')
  }, [text, cols, rows, gap, chars, thresh])

useLayoutEffect(() => {
  render()
  ivRef.current = setInterval(render, speed)
  return () => {
    if (ivRef.current) clearInterval(ivRef.current)
  }
}, [render, speed])

  return (
    <pre
      ref={preRef}
      className={className}
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: `clamp(2px, ${200 / (text.length * cols)}vw, 9px)`,
        lineHeight: '1.18',
        letterSpacing: '0.07em',
        whiteSpace: 'pre',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}
