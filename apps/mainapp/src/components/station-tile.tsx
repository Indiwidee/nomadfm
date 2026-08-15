import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete01Icon,
  Edit01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { COVER_TRANSITION } from "@/lib/animations"
import type { RadioTile } from "@/lib/somafm"

interface StationTileProps {
  tile: RadioTile
  index: number
  /** Плитка, из которой обложка «улетела» на экран плеера — её не прячем. */
  keepVisible: boolean
  onPlay: (tile: RadioTile) => void
  onEdit: (tile: RadioTile) => void
  onDelete: (tile: RadioTile) => void
}

/**
 * Клик/клавиша пришли из меню настроек (триггер или пункты — они в портале,
 * и React «пузырит» их по дереву компонентов до плитки).
 */
function isMenuInteraction(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "[data-slot='dropdown-menu-trigger'], [data-slot='dropdown-menu-content']",
    )
  )
}

/** Квадратная плитка: обложка + меню настроек (edit/delete). Вся плитка — play. */
export function StationTile({
  tile,
  index,
  keepVisible,
  onPlay,
  onEdit,
  onDelete,
}: StationTileProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Play: ${tile.title}`}
      title={tile.title}
      onClick={(e) => {
        // Клики по меню настроек не должны запускать воспроизведение.
        if (isMenuInteraction(e.target)) return
        onPlay(tile)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (isMenuInteraction(e.target)) return
          e.preventDefault()
          onPlay(tile)
        }
      }}
      whileTap={{ scale: 0.94 }}
      initial={keepVisible ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      animate={
        keepVisible
          ? { opacity: 1, transition: { duration: 0.25 } }
          : {
              opacity: 1,
              scale: 1,
              transition: {
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut",
              },
            }
      }
      exit={
        keepVisible
          ? { opacity: 1, scale: 1, transition: { duration: 0.2 } }
          : {
              opacity: 0,
              scale: 0.7,
              transition: {
                delay: index * 0.04,
                duration: 0.22,
                ease: "easeIn",
              },
            }
      }
      className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5 transition-shadow hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
    >
      <motion.img
        layoutId={`radio-cover-${tile.id}`}
        transition={COVER_TRANSITION}
        src={tile.cover}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Settings: ${tile.title}`}
          title="Settings"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 grid size-7 cursor-pointer place-items-center rounded-full bg-background/70 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-background/90 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
        >
          <HugeiconsIcon icon={Settings01Icon} className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem onClick={() => onEdit(tile)}>
            <HugeiconsIcon icon={Edit01Icon} className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(tile)}
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
