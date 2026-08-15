import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { HeartIcon, SearchIcon } from "@hugeicons/core-free-icons"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import GradientWaves from "@/components/GradientWaves"
import { StationTile } from "@/components/station-tile"
import { PlayerScreen } from "@/components/player-screen"
import { EditTileDialog } from "@/components/edit-tile-dialog"
import { SearchPanel } from "@/components/search-panel"
import { useRadioPlayer } from "@/hooks/use-radio-player"
import { useTiles } from "@/hooks/use-tiles"

import { getDominantColors, oklchToHex } from "@/lib/colors"
import { cn } from "@/lib/utils"
import type { RadioTile } from "@/lib/somafm"

const TILE_COUNT = 6

const SCREEN_FADE = { duration: 0.18, ease: "easeInOut" } as const

/** Акцентный цвет темы в hex (тёмная тема принудительно включена). */
const PRIMARY_HEX = oklchToHex(
  getComputedStyle(document.documentElement).getPropertyValue("--primary"),
)

export default function App() {
  const [screen, setScreen] = useState<"home" | "player">("home")
  const [tab, setTab] = useState<"favourites" | "search">("favourites")
  const {
    tiles,
    ready: tilesReady,
    error: loadError,
    updateTile,
    addTile,
    deleteTile,
    retry,
  } = useTiles()
  const [editingTile, setEditingTile] = useState<RadioTile | null>(null)
  /** Какая плитка «улетела» на экран плеера — для реверса анимации. */
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null)
  /** Доминирующие цвета обложки играющей станции. */
  const [dominantColors, setDominantColors] = useState<{
    id: string
    colors: [string, string]
  } | null>(null)

  const player = useRadioPlayer()

  const playerCurrent = player.current

  // Доминирующие цвета обложки — для фоновых волн при воспроизведении.
  useEffect(() => {
    if (!playerCurrent) return
    let cancelled = false
    void getDominantColors(playerCurrent.cover).then((colors) => {
      if (!cancelled) setDominantColors({ id: playerCurrent.id, colors })
    })
    return () => {
      cancelled = true
    }
  }, [playerCurrent])

  const activeColors =
    player.playing && dominantColors && dominantColors.id === playerCurrent?.id
      ? dominantColors.colors
      : null

  const favouriteIds = useMemo(
    () => new Set(tiles.map((tile) => tile.id)),
    [tiles],
  )

  const handlePlay = (tile: RadioTile) => {
    setLastPlayedId(tile.id)
    void player.select(tile)
    setScreen("player")
  }

  /** Плей/пауза: пауза закрывает плеер, спиннер во время загрузки — тоже. */
  const handleToggle = () => {
    if (player.connecting) {
      player.stop()
      setScreen("home")
      return
    }
    if (player.playing) {
      player.toggle()
      setScreen("home")
      return
    }
    player.toggle() // возобновление — остаёмся на экране
  }

  const handleSaveTile = (updated: RadioTile) => {
    setEditingTile(null)
    updateTile(updated)
  }

  const handleDeleteTile = (tile: RadioTile) => {
    deleteTile(tile.id)
  }

  return (
    <div className="relative min-h-dvh">
      {/* Волны: на телефоне — полоса снизу (у портрета волна обрезается), */}
      {/* на десктопе — весь экран. */}
      <div
        className="fixed inset-0 -z-10 max-sm:inset-x-0 max-sm:top-auto max-sm:bottom-0 max-sm:h-[55dvh]"
        aria-hidden
      >
        <GradientWaves
          horizonColor={activeColors ? activeColors[0] : PRIMARY_HEX}
          waveColor={activeColors ? activeColors[1] : PRIMARY_HEX}
          crestColor="#ffffff"
          speed={activeColors ? 0.4 : 0}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      <AudioPlayer
        src={player.src}
        volume={player.volume}
        onElement={player.onElement}
        onPlaying={player.onAudioPlaying}
        onPause={player.onAudioPause}
        onWaiting={player.onAudioWaiting}
        onError={player.onAudioError}
      />

      <AnimatePresence mode="popLayout" initial={false}>
        {screen === "player" ? (
          <motion.div
            key="player"
            className="min-h-dvh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: SCREEN_FADE }}
          >
            <PlayerScreen
              tile={player.current}
              playing={player.playing}
              connecting={player.connecting}
              error={player.streamError}
              volume={player.volume}
              onToggle={handleToggle}
              onVolumeChange={player.changeVolume}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            className="min-h-dvh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: SCREEN_FADE }}
          >
            {/* Логотип (мобильный) */}
            <img
              src="/nomad-wide.svg"
              alt="NomadFM"
              className="absolute top-4 left-4 h-12 w-auto sm:hidden"
            />

            {/* Сайдбар с лого и вкладками (десктоп) */}
            <nav className="absolute top-4 left-4 hidden flex-col items-start gap-3 sm:flex">
              <img
                src="/nomad-wide.svg"
                alt="NomadFM"
                className="h-12 w-auto"
              />
              <div className="flex w-32 flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-pressed={tab === "favourites"}
                  className={cn(
                    "justify-start",
                    tab === "favourites" && "bg-muted",
                  )}
                  onClick={() => setTab("favourites")}
                >
                  Favourites
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-pressed={tab === "search"}
                  className={cn(
                    "justify-start",
                    tab === "search" && "bg-muted",
                  )}
                  onClick={() => setTab("search")}
                >
                  Search
                </Button>
              </div>
            </nav>

            <main className="flex min-h-dvh items-center justify-center px-4 pt-24 pb-28 sm:py-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {tab === "search" ? (
                  <motion.div
                    key="search"
                    className="w-full"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25 },
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      transition: { duration: 0.15 },
                    }}
                  >
                    <SearchPanel
                      favouriteIds={favouriteIds}
                      onPlay={handlePlay}
                      onAdd={addTile}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="favourites"
                    className="w-full max-w-3xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25 },
                    }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      transition: { duration: 0.15 },
                    }}
                  >
                  {loadError ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <p className="text-sm text-muted-foreground">
                        Failed to load SomaFM stations
                      </p>
                      <p className="text-xs text-destructive">{loadError}</p>
                      <Button variant="outline" onClick={retry}>
                        Retry
                      </Button>
                    </div>
                  ) : !tilesReady ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                      {Array.from({ length: TILE_COUNT }, (_, i) => (
                        <Skeleton
                          key={i}
                          className="aspect-square w-full rounded-2xl"
                        />
                      ))}
                    </div>
                  ) : tiles.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      No tiles yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                      {tiles.map((tile, index) => (
                        <StationTile
                          key={tile.id}
                          tile={tile}
                          index={index}
                          keepVisible={tile.id === lastPlayedId}
                          onPlay={handlePlay}
                          onEdit={setEditingTile}
                          onDelete={handleDeleteTile}
                        />
                      ))}
                    </div>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Bottom navigation (мобильный) */}
            <nav className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:hidden">
              <div className="flex gap-1 rounded-full bg-background/85 p-1 shadow-lg ring-1 ring-foreground/10 backdrop-blur">
                <Button
                  variant="ghost"
                  size="sm"
                  data-icon="inline-start"
                  aria-pressed={tab === "favourites"}
                  className={cn(tab === "favourites" && "bg-muted")}
                  onClick={() => setTab("favourites")}
                >
                  <HugeiconsIcon icon={HeartIcon} className="size-4" />
                  Favourites
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  data-icon="inline-start"
                  aria-pressed={tab === "search"}
                  className={cn(tab === "search" && "bg-muted")}
                  onClick={() => setTab("search")}
                >
                  <HugeiconsIcon icon={SearchIcon} className="size-4" />
                  Search
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {editingTile && (
        <EditTileDialog
          tile={editingTile}
          onSave={handleSaveTile}
          onClose={() => setEditingTile(null)}
        />
      )}
    </div>
  )
}
