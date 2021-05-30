import { useState, useEffect } from 'react'

export const useScroll = () => {

  // Set a single object `{ y }` once on init
  const [scroll, setScroll] = useState({
    y: document.body.getBoundingClientRect().top,
  })

  const listener = e => {
    // `prev` provides us the previous state: https://reactjs.org/docs/hooks-reference.html#functional-updates
    setScroll(prev => ({
      y: -document.body.getBoundingClientRect().top,
    }))
  }

  useEffect(() => {
    window.addEventListener('scroll', listener)
    // cleanup function occurs on unmount
    return () => window.removeEventListener('scroll', listener)
  // Run `useEffect` only once on mount, so add `, []` after the closing curly brace }
  }, [])

  return scroll
}
