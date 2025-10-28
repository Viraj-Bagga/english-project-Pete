import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChevronIcon from './ChevronIcon.jsx'

export default function AccordionSection({ id, title, imageSrc, open, onToggle, children }) {
  const headerId = `${id}-header`
  const panelId = `${id}-panel`
  const bgRef = useRef(null)
  const innerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.setAttribute('data-parallax', 'true')
      bgRef.current.setAttribute('data-speed', '1.1')
    }
  }, [])

  useEffect(() => {
    if (open) {
      setIsActive(true)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(5) } catch {}
      }
    } else {
      // Delay removing active so the collapse animation can run smoothly
      const t = setTimeout(() => setIsActive(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  // Measure content height for smooth max-height animation
  useEffect(() => {
    const measure = () => {
      if (innerRef.current) {
        const next = open ? innerRef.current.scrollHeight : 0
        setPanelHeight(next)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open, children])

  // Build a short teaser string from the first two paragraphs (perf: no heavy DOM)
  const teaserText = useMemo(() => {
    const out = []
    let count = 0
    React.Children.forEach(children, (child) => {
      if (count >= 2) return
      if (typeof child === 'string') {
        if (child.trim()) { out.push(child.trim()); count += 1 }
      } else if (React.isValidElement(child)) {
        const txt = typeof child.props.children === 'string'
          ? child.props.children
          : Array.isArray(child.props.children)
            ? child.props.children.filter(c => typeof c === 'string').join(' ')
            : ''
        if (txt && txt.trim()) { out.push(txt.trim()); count += 1 }
      }
    })
    return out.join(' ')
  }, [children])

  return (
    <div className={`card ${open ? 'card--open' : ''}`}>
      <div ref={bgRef} className="card__bg" style={{ backgroundImage: `url(${imageSrc})` }} aria-hidden="true" />

      <div id={headerId} className={`card__header ${open ? 'tap-highlight' : ''}`}>
        <div className="card__headerContent">
          <h2 className="card__title">{title}</h2>
        </div>
      </div>

      {!open && (
        <div className="card__teaser" aria-hidden={open}>
          <div className="card__teaserText"><p>{teaserText}</p></div>
          <div className="card__teaserActions">
            <button
              className="icon-btn card__teaserBtn"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={`Expand ${title}`}
              onClick={onToggle}
            >
              <ChevronIcon className="chevron" />
            </button>
          </div>
        </div>
      )}

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="card__panel"
        style={{ maxHeight: panelHeight }}
      >
        <div ref={innerRef} className="card__panelInner">
          {children}
          <div className="card__panelActions">
            <button
              className="icon-btn icon-btn--up"
              onClick={onToggle}
              aria-controls={panelId}
              aria-expanded={open}
              aria-label={`Collapse ${title}`}
            >
              <ChevronIcon className="chevron chevron--open" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
