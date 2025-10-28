const STORAGE_KEYS = {
  SESSION: 'analytics_session_id',
  SESSIONS: 'analytics_sessions',
  AGG: 'analytics_aggregate'
}

function getOrCreateSessionId() {
  let id = localStorage.getItem(STORAGE_KEYS.SESSION)
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(STORAGE_KEYS.SESSION, id)
  }
  return id
}

function now() { return Date.now() }

class Analytics {
  constructor() {
    this.sessionId = getOrCreateSessionId()
    this.loadedAt = now()
    this.sectionOpenStart = {}
    this.sectionOpenCounts = {}
    this.totalTime = 0
    this.queue = []
    this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || null
  }

  onPageLoad() {
    this.loadedAt = now()
  }

  onPageUnload() {
    const dur = now() - this.loadedAt
    this.totalTime += dur

    // persist session
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]')
    sessions.push({ id: this.sessionId, totalTime: dur, opened: { ...this.sectionOpenCounts }, perSectionTime: this._computeSectionTimes() })
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))

    // update aggregate
    const agg = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGG) || '{}')
    agg.totalSessions = (agg.totalSessions || 0) + 1
    agg.totalTime = (agg.totalTime || 0) + dur

    // accumulate counts and times
    agg.sectionOpenCounts = agg.sectionOpenCounts || {}
    agg.perSectionTime = agg.perSectionTime || {}
    for (const [k, v] of Object.entries(this.sectionOpenCounts)) {
      agg.sectionOpenCounts[k] = (agg.sectionOpenCounts[k] || 0) + v
    }
    const perTimes = this._computeSectionTimes()
    for (const [k, v] of Object.entries(perTimes)) {
      agg.perSectionTime[k] = (agg.perSectionTime[k] || 0) + v
    }

    localStorage.setItem(STORAGE_KEYS.AGG, JSON.stringify(agg))

    // queue flush (no-op by default)
    this._flushQueue()
  }

  averageTime() {
    const agg = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGG) || '{}')
    if (!agg.totalSessions) return 0
    return Math.round(agg.totalTime / agg.totalSessions)
  }

  mostOpenedSection() {
    const agg = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGG) || '{}')
    const counts = agg.sectionOpenCounts || {}
    let maxK = null, maxV = -1
    for (const [k, v] of Object.entries(counts)) {
      if (v > maxV) { maxV = v; maxK = k }
    }
    return maxK
  }

  mostReadSection() {
    const agg = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGG) || '{}')
    const times = agg.perSectionTime || {}
    let maxK = null, maxV = -1
    for (const [k, v] of Object.entries(times)) {
      if (v > maxV) { maxV = v; maxK = k }
    }
    return maxK
  }

  trackSectionOpen(id) {
    this.sectionOpenCounts[id] = (this.sectionOpenCounts[id] || 0) + 1
    this.queue.push({ type: 'section_open', id, ts: now(), sessionId: this.sessionId })
  }

  markSectionOpen(id) {
    this.sectionOpenStart[id] = now()
  }

  markSectionClose(id) {
    const start = this.sectionOpenStart[id]
    if (start) {
      const delta = now() - start
      const key = `time_${id}`
      const prev = parseInt(localStorage.getItem(key) || '0', 10)
      localStorage.setItem(key, String(prev + delta))
      this.queue.push({ type: 'section_close', id, delta, ts: now(), sessionId: this.sessionId })
      delete this.sectionOpenStart[id]
    }
  }

  _computeSectionTimes() {
    const out = {}
    Object.keys(this.sectionOpenCounts).forEach(id => {
      const key = `time_${id}`
      out[id] = parseInt(localStorage.getItem(key) || '0', 10)
    })
    return out
  }

  async _flushQueue() {
    if (!this.endpoint || this.queue.length === 0) return
    const payload = this.queue.splice(0, this.queue.length)
    try {
      // prototype: no-op by default; if endpoint configured, still avoid sending automatically
      // await fetch(this.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } catch (e) {
      // swallow
    }
  }
}

// Export singleton instance so default import is the analytics object
const analytics = new Analytics()
export default analytics
