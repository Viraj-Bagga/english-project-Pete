import React from 'react'

export default function Hero({ onExplore }) {
  return (
    <header className="hero" aria-label="Story introduction">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__content">
        <h1 className="hero__headline">The Pete: Power and Pulse.</h1>
        <p className="hero__subhead">Glass, steel, and the charge of a crowd.</p>
        <blockquote className="hero__quote">“A living battery — emotions transformed into consumption.”</blockquote>
        <div className="hero__meta">4 paragraphs • ~2 min</div>
        <div className="hero__actions">
          <button className="btn hero__cta" onClick={onExplore} aria-label="Begin reading">Begin Reading</button>
        </div>
      </div>

      
    </header>
  )
}
