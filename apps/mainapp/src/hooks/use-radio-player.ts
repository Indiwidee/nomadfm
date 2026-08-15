import { useCallback, useEffect, useRef, useState } from "react"

import { resolveStreams, type RadioTile } from "@/lib/somafm"

const VOLUME_KEY = "nomadfm:volume"

export function useRadioPlayer() {
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null)
  const selectTokenRef = useRef(0)

  const [current, setCurrent] = useState<RadioTile | null>(null)
  const [sources, setSources] = useState<string[]>([])
  const [srcIndex, setSrcIndex] = useState(0)
  const [connecting, setConnecting] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(VOLUME_KEY))
    return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.8
  })

  const src = sources.length > 0 ? sources[srcIndex] : null

  const select = useCallback(
    async (tile: RadioTile) => {
      const same = current?.id === tile.id
      const sameStream = same && current?.stream === tile.stream

      if (sameStream && audioEl && !audioEl.paused) {
        audioEl.pause()
        return
      }
      if (sameStream && src) {
        audioEl?.play().catch(() => setStreamError("Press play again"))
        return
      }

      const token = ++selectTokenRef.current
      setCurrent(tile)
      setConnecting(true)
      setPlaying(false)
      setStreamError(null)

      const urls = tile.stream.endsWith(".pls")
        ? await resolveStreams(tile.stream)
        : [tile.stream]
      if (token !== selectTokenRef.current) return 
      if (urls.length === 0) {
        setConnecting(false)
        setStreamError("Failed to get the stream address")
        return
      }

      setSources(urls)
      setSrcIndex(0)
    },
    [audioEl, current, src],
  )

  const toggle = useCallback(() => {
    if (!audioEl || !current) return
    if (audioEl.paused) {
      void audioEl.play().catch(() => setStreamError("Press play again"))
    } else {
      audioEl.pause()
    }
  }, [audioEl, current])

  const handleError = useCallback(() => {
    const next = srcIndex + 1
    if (next < sources.length) {
      setSrcIndex(next)
    } else {
      setConnecting(false)
      setStreamError("Failed to connect to the stream")
    }
  }, [srcIndex, sources.length])

  const stop = useCallback(() => {
    selectTokenRef.current++ 
    if (audioEl) {
      audioEl.pause()
      audioEl.removeAttribute("src")
      audioEl.load()
    }
    setCurrent(null)
    setSources([])
    setSrcIndex(0)
    setConnecting(false)
    setPlaying(false)
    setStreamError(null)
  }, [audioEl])

  const changeVolume = useCallback((value: number) => {
    setVolume(value)
    localStorage.setItem(VOLUME_KEY, String(value))
  }, [])

  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: "SomaFM",
      artwork: [{ src: current.cover, sizes: "512x512" }],
    })
    navigator.mediaSession.setActionHandler("play", () => toggle())
    navigator.mediaSession.setActionHandler("pause", () => toggle())
    return () => {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
    }
  }, [current, toggle])

  return {
    src,
    current,
    connecting,
    playing,
    streamError,
    volume,
    select,
    toggle,
    stop,
    changeVolume,
    onElement: setAudioEl,
    onAudioPlaying: () => {
      setConnecting(false)
      setPlaying(true)
    },
    onAudioPause: () => setPlaying(false),
    onAudioWaiting: () => setConnecting(true),
    onAudioError: handleError,
  }
}
