import { useCallback, useEffect, useState } from "react"

import { fetchDefaultTiles, type RadioTile } from "@/lib/somafm"

const TILES_KEY = "nomadfm:tiles"

function readTilesFromStorage(): RadioTile[] | null {
  try {
    const raw = localStorage.getItem(TILES_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(
      (t): t is RadioTile =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as RadioTile).id === "string",
    )
  } catch {
    return null
  }
}

function writeTilesToStorage(tiles: RadioTile[]) {
  try {
    localStorage.setItem(TILES_KEY, JSON.stringify(tiles))
  } catch {
    // переполнение хранилища — игнорируем
  }
}

/**
 * Плитки радио: сохранённые в localStorage, либо стартовые из channels.json.
 * Все изменения сразу пишутся в localStorage.
 */
export function useTiles() {
  const [tiles, setTiles] = useState<RadioTile[]>(
    () => readTilesFromStorage() ?? [],
  )
  const [ready, setReady] = useState(() => readTilesFromStorage() !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ready) return
    let cancelled = false
    fetchDefaultTiles()
      .then((defaults) => {
        if (cancelled) return
        setTiles(defaults)
        setError(null)
        setReady(true)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(
          err instanceof Error ? err.message : "Failed to load stations",
        )
        setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [ready])

  // Сохраняем плитки при каждом изменении.
  useEffect(() => {
    if (ready) writeTilesToStorage(tiles)
  }, [tiles, ready])

  const updateTile = useCallback((updated: RadioTile) => {
    setTiles((prev) =>
      prev.map((tile) => (tile.id === updated.id ? updated : tile)),
    )
  }, [])

  const addTile = useCallback((tile: RadioTile) => {
    setTiles((prev) =>
      prev.some((t) => t.id === tile.id) ? prev : [...prev, tile],
    )
  }, [])

  const deleteTile = useCallback((id: string) => {
    setTiles((prev) => prev.filter((tile) => tile.id !== id))
  }, [])

  const retry = useCallback(() => {
    setError(null)
    setReady(false)
  }, [])

  return { tiles, ready, error, updateTile, addTile, deleteTile, retry }
}
