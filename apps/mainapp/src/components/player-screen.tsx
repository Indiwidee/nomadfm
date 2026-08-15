import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PauseIcon,
  PlayIcon,
  VolumeMute01Icon,
  VolumeUpIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

import { COVER_TRANSITION } from "@/lib/animations"

import type { RadioTile } from "@/lib/somafm"

const CONTROLS_ENTER = {
  type: "spring",
  stiffness: 300,
  damping: 24,
} as const

interface PlayerScreenProps {
  tile: RadioTile | null
  playing: boolean
  connecting: boolean
  error: string | null
  volume: number
  onToggle: () => void
  onVolumeChange: (value: number) => void
}

export function PlayerScreen({
  tile,
  playing,
  connecting,
  error,
  volume,
  onToggle,
  onVolumeChange,
}: PlayerScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16">
        {tile && (
          <motion.img
            layoutId={`radio-cover-${tile.id}`}
            transition={COVER_TRANSITION}
            src={tile.cover}
            alt={tile.title}
            className="aspect-square w-full max-w-sm rounded-3xl object-cover shadow-2xl ring-1 ring-foreground/10"
          />
        )}

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { ...CONTROLS_ENTER, delay: 0.15 },
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.85,
              transition: { duration: 0.15 },
            }}
          >
            <Card
              className="items-center gap-0 py-0"
              size="sm"
            >
              <Button
                size="icon-sm"
                className="size-14 rounded-full"
                aria-label={
                  connecting ? "Cancel" : playing ? "Pause" : "Play"
                }
                onClick={onToggle}
                variant="ghost"
              >
                {connecting ? (
                  <span className="size-6 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : (
                  <HugeiconsIcon
                    icon={playing ? PauseIcon : PlayIcon}
                    className="size-7"
                  />
                )}
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { ...CONTROLS_ENTER, delay: 0.22 },
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.85,
              transition: { duration: 0.15 },
            }}
          >
            <Card
              className="w-44 flex-row items-center gap-2 px-3 py-2.5"
            >
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={volume === 0 ? "Unmute" : "Mute"}
                onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
              >
                <HugeiconsIcon
                  icon={volume === 0 ? VolumeMute01Icon : VolumeUpIcon}
                  className="size-4"
                />
              </Button>
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                aria-label="Volume"
                className="flex-1"
                onValueChange={(value) =>
                  onVolumeChange(Array.isArray(value) ? value[0] : value)
                }
              />
            </Card>
          </motion.div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="max-w-xs text-center text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  )
}
