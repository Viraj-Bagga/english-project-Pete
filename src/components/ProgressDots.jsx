import React from 'react'

export default function ProgressDots({ active = 0, total = 4 }) {
  return (
    <nav className="progress" aria-label="Reading progress">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to section ${i + 1}`}
          className={"progress__dot" + (i === active ? " is-active" : "")}
          onClick={() => {
            const el = document.querySelectorAll('.article__section')[i]
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
      ))}
    </nav>
  )
}
