let ticking = false

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset
      document.querySelectorAll('[data-parallax="true"]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed') || '1')
        const translate = y * (1 - speed)
        el.style.transform = `translateY(${translate.toFixed(2)}px)`
      })
      ticking = false
    })
    ticking = true
  }
}

export function initParallax() {
  window.addEventListener('scroll', onScroll, { passive: true })
  // initial position
  onScroll()
  return () => {
    window.removeEventListener('scroll', onScroll)
  }
}
