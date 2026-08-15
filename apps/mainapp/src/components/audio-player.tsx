import { useEffect, useRef } from "react"

interface AudioPlayerProps {
  src: string | null
  volume: number
  onElement: (el: HTMLAudioElement | null) => void
  onPlaying: () => void
  onPause: () => void
  onWaiting: () => void
  onError: () => void
}

export function AudioPlayer({
  src,
  volume,
  onElement,
  onPlaying,
  onPause,
  onWaiting,
  onError,
}: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    onElement(ref.current)
  }, [onElement])

  useEffect(() => {
    if (ref.current) ref.current.volume = volume
  }, [volume])

  return (
    <audio
      ref={ref}
      src={src ?? undefined}
      autoPlay={src !== null}
      className="hidden"
      onPlaying={onPlaying}
      onPause={onPause}
      onWaiting={onWaiting}
      onError={onError}
    />
  )
}
