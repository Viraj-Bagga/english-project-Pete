import React from 'react'

export default function SubNav({ items, activeId, onSelect }) {
  return (
    <nav className="subnav" aria-label="Section navigation">
      <ul className="subnav__list">
        {items.map((it) => (
          <li key={it.id} className="subnav__item">
            <button
              className={`subnav__btn ${activeId === it.id ? 'is-active' : ''}`}
              onClick={() => onSelect(it.id)}
              aria-current={activeId === it.id ? 'page' : undefined}
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
