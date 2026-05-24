'use client'

import { useSyncExternalStore } from 'react'

function formatTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
}

let clockTimer: ReturnType<typeof setInterval> | null = null
let clockListeners = new Set<() => void>()

function subscribeToMinute(callback: () => void) {
  if (clockListeners.size === 0) {
    clockTimer = setInterval(() => clockListeners.forEach(cb => cb()), 10_000)
  }
  clockListeners.add(callback)
  return () => {
    clockListeners.delete(callback)
    if (clockListeners.size === 0 && clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
  }
}

export function DigitalClock() {
  const time = useSyncExternalStore(subscribeToMinute, formatTime, () => '')
  if (!time) return null
  return (
    <span className="text-xs text-muted-foreground digital-clock">
      {time}
    </span>
  )
}
