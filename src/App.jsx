import React, { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero.jsx'
import Article from './components/Article.jsx'
import ProgressDots from './components/ProgressDots.jsx'
import { initFadeInOnScroll } from './utils/fadeInOnScroll.js'
import { smoothScrollTo } from './utils/scroll.js'
import analytics from './analytics/analytics.js'
import DownArrowIcon from './components/DownArrowIcon.jsx'

export default function App() {
  const [showArrow, setShowArrow] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const articleRef = useRef(null)
  const snappingRef = useRef(false)
  const touchingRef = useRef(false)

  useEffect(() => {
    const cleanupFade = initFadeInOnScroll()

    analytics.onPageLoad()
    const handleUnload = () => analytics.onPageUnload()
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      cleanupFade()
      window.removeEventListener('beforeunload', handleUnload)
      analytics.onPageUnload()
    }
  }, [])

  // Track active snap section for progress dots
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.article__section'))
    if (sections.length === 0) return
    const io = new IntersectionObserver((entries) => {
      let best = { idx: 0, ratio: 0 }
      entries.forEach((e) => {
        const idx = sections.indexOf(e.target)
        if (e.intersectionRatio > best.ratio) best = { idx, ratio: e.intersectionRatio }
      })
      // Only update when a section is clearly dominant
      if (best.ratio >= 0.6) setActiveIdx(best.idx)
    }, { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] })
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Track touch state so we don't snap while the user is dragging
  useEffect(() => {
    const onTS = () => { touchingRef.current = true }
    const onTE = () => { touchingRef.current = false }
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchend', onTE, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchend', onTE)
    }
  }, [])

  // JS snap enforcement (CSS snapping disabled) — smoothScrollTo with debounce and touch-awareness
  useEffect(() => {
    let timer = null
    const sections = () => Array.from(document.querySelectorAll('.article__section'))
    const onScroll = () => {
      if (snappingRef.current) return
      if (touchingRef.current) return // don't decide while finger is down
      clearTimeout(timer)
      timer = setTimeout(() => {
        const list = sections()
        if (!list.length) return
        const mid = window.innerHeight / 2
        let best = { el: list[0], dist: Infinity }
        for (const el of list) {
          const rect = el.getBoundingClientRect()
          const dist = Math.abs((rect.top + rect.height / 2) - mid)
          if (dist < best.dist) best = { el, dist }
        }
        if (best.el) {
          snappingRef.current = true
          smoothScrollTo(best.el, { duration: 900 })
          setTimeout(() => { snappingRef.current = false }, 950)
        }
      }, 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleExplore = () => {
    if (articleRef.current) {
      smoothScrollTo(articleRef.current, { duration: 700 })
    }
  }

  // Show a down-arrow at the bottom if more content exists below the viewport
  useEffect(() => {
    const update = () => {
      const threshold = 8 // px
      const more = window.scrollY + window.innerHeight < document.documentElement.scrollHeight - threshold
      setShowArrow(more)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="snapper">
      <Hero onExplore={handleExplore} />
      <Article />
      <ProgressDots active={activeIdx} total={4} />
    </div>
  )
}
