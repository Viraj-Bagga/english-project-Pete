import React, { useEffect, useRef } from 'react'

export default function SectionBand({ id, title, imageSrc, children }) {
  const bgRef = useRef(null)

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.setAttribute('data-parallax', 'true')
      bgRef.current.setAttribute('data-speed', '1.1')
    }
  }, [])

  return (
    <section id={id} className="band" data-fade>
      <div ref={bgRef} className="band__bg" style={{ backgroundImage: `url(${imageSrc})` }} aria-hidden="true" />
      <div className="band__inner">
        <header className="band__header">
          <h2 className="band__title">{title}</h2>
        </header>
        <div className="band__content">
          {children}
        </div>
      </div>
    </section>
  )
}
