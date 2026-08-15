import type { RadioTile } from "@/lib/somafm"

/** Станция из Radio Browser API (нужные поля). */
export interface RbStation {
  stationuuid: string
  name: string
  url_resolved: string
  favicon: string
  tags: string
  country: string
  countrycode: string
  language: string
  votes: number
  clickcount: number
  homepage: string
}

const RB_BASE = "https://de1.api.radio-browser.info"

async function rbFetch(path: string): Promise<unknown> {
  const res = await fetch(`${RB_BASE}${path}`)
  if (!res.ok) throw new Error(`Radio Browser API: ${res.status}`)
  return res.json()
}

/** Поиск станций по названию и/или категории (тегу). */
export async function searchStations(params: {
  name?: string
  tag?: string
}): Promise<RbStation[]> {
  const qs = new URLSearchParams()
  if (params.name) qs.set("name", params.name)
  if (params.tag) qs.set("tag", params.tag)
  qs.set("limit", "30")
  qs.set("order", "clickcount")
  qs.set("reverse", "true")
  qs.set("hidebroken", "true")
  const data = await rbFetch(`/json/stations/search?${qs.toString()}`)
  return data as RbStation[]
}

/** Популярные категории (теги) по числу станций. */
export async function fetchPopularTags(): Promise<string[]> {
  const data = (await rbFetch(
    "/json/tags?order=stationcount&reverse=true&limit=24&hidebroken=true",
  )) as { name: string }[]
  return data.map((t) => t.name).filter((n) => n && n.length < 24)
}

/** Станция Radio Browser → плитка приложения. */
export function rbStationToTile(station: RbStation): RadioTile {
  return {
    id: `rb-${station.stationuuid}`,
    title: station.name,
    cover: station.favicon,
    stream: station.url_resolved,
  }
}
