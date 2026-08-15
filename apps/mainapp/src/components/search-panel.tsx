import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  CheckmarkCircle01Icon,
  MusicNote01Icon,
  PlayIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import {
  fetchPopularTags,
  rbStationToTile,
  searchStations,
  type RbStation,
} from "@/lib/radio-browser"
import type { RadioTile } from "@/lib/somafm"

interface SearchPanelProps {
  favouriteIds: Set<string>
  onPlay: (tile: RadioTile) => void
  onAdd: (tile: RadioTile) => void
}

/** Поиск радиостанций через Radio Browser API: по названию и категориям. */
export function SearchPanel({
  favouriteIds,
  onPlay,
  onAdd,
}: SearchPanelProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [results, setResults] = useState<RbStation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Популярные категории — подгружаем один раз.
  useEffect(() => {
    let cancelled = false
    void fetchPopularTags()
      .then((t) => {
        if (!cancelled) setTags(t)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Поиск с дебаунсом: по названию и/или выбранной категории.
  useEffect(() => {
    const q = query.trim()
    if (!q && !category) return
    const timer = setTimeout(() => {
      let cancelled = false
      searchStations({ name: q || undefined, tag: category ?? undefined })
        .then((stations) => {
          if (cancelled) return
          setResults(stations)
          setError(null)
        })
        .catch((err: unknown) => {
          if (cancelled) return
          setResults([])
          setError(
            err instanceof Error ? err.message : "Search failed",
          )
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
      return () => {
        cancelled = true
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query, category])

  const active = query.trim() !== "" || category !== null

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative w-full max-w-xl">
        <HugeiconsIcon
          icon={SearchIcon}
          className="absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLoading(true)
          }}
          placeholder="Search radios…"
          className="h-14 rounded-full pl-11 pr-6 text-base"
        />
      </div>

      <div className="flex max-w-2xl flex-wrap justify-center gap-1.5">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant="ghost"
            size="sm"
            aria-pressed={category === tag}
            className={category === tag ? "bg-muted" : ""}
            onClick={() => {
              setCategory((current) => (current === tag ? null : tag))
              setLoading(true)
            }}
          >
            {tag}
          </Button>
        ))}
      </div>

      {!active ? (
        <p className="text-sm text-muted-foreground">
          Search by name or pick a category
        </p>
      ) : loading ? (
        <div className="flex w-full max-w-2xl flex-col gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing found</p>
      ) : (
        <ul className="flex w-full max-w-2xl flex-col gap-2">
          {results.map((station) => {
            const id = `rb-${station.stationuuid}`
            const isFavourite = favouriteIds.has(id)
            return (
              <li
                key={station.stationuuid}
                className="flex items-center gap-3 rounded-2xl bg-card/70 p-2.5 pr-2 ring-1 ring-foreground/5"
              >
                {station.favicon ? (
                  <img
                    src={station.favicon}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                    className="size-11 shrink-0 rounded-xl object-cover ring-1 ring-foreground/10"
                  />
                ) : (
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={MusicNote01Icon} className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{station.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[station.country, station.tags].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Add ${station.name} to favourites`}
                  disabled={isFavourite}
                  onClick={() => onAdd(rbStationToTile(station))}
                >
                  <HugeiconsIcon
                    icon={isFavourite ? CheckmarkCircle01Icon : Add01Icon}
                    className="size-4"
                  />
                </Button>
                <Button
                  size="icon-sm"
                  aria-label={`Play ${station.name}`}
                  onClick={() => onPlay(rbStationToTile(station))}
                >
                  <HugeiconsIcon icon={PlayIcon} className="size-4" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
