export function initFadeInOnScroll() {
  const els = Array.from(document.querySelectorAll('[data-fade]'))
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'))
    return () => {}
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        } else {
          entry.target.classList.remove('is-visible')
        }
      })
    },
    {
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.15,
    }
  )

  els.forEach((el) => obs.observe(el))

  return () => obs.disconnect()
}
