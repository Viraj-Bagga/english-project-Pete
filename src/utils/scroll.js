function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function smoothScrollTo(targetEl, { duration = 600 } = {}) {
  const startY = window.scrollY || window.pageYOffset
  const targetY = targetEl.getBoundingClientRect().top + startY - 12 // slight offset
  const distance = targetY - startY
  let startTime = null

  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)
    window.scrollTo(0, startY + distance * eased)
    if (elapsed < duration) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}
