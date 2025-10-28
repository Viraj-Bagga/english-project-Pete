import React from 'react'

// A distinct down arrow icon (not the same chevron glyph) with a stem and head
export default function DownArrowIcon({ className = '' }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 3v13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M7 13l5 6 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
