export interface Playlist {
  url: string
  format: string
  quality: string
}

export interface RadioTile {
  id: string
  title: string
  cover: string
  stream: string
}

export interface Channel {
  id: string
  title: string
  description: string
  dj?: string
  genre: string
  featured?: number
  image: string
  largeimage: string
  xlimage: string
  playlists: Playlist[]
  listeners: string
  lastPlaying: string
}

const CHANNELS_URL = "https://api.somafm.com/channels.json"

export async function fetchChannels(): Promise<Channel[]> {
  const res = await fetch(CHANNELS_URL)
  if (!res.ok) {
    throw new Error(`SomaFM API: ${res.status} ${res.statusText}`)
  }
  const data: { channels: Channel[] } = await res.json()
  return data.channels
}

export function pickPlaylist(channel: Channel): Playlist {
  const rank: Record<string, number> = { mp3: 0, aac: 1, aacp: 2 }
  return (
    [...channel.playlists].sort(
      (a, b) => (rank[a.format] ?? 9) - (rank[b.format] ?? 9),
    )[0] ?? channel.playlists[0]
  )
}

export async function resolveStreams(plsUrl: string): Promise<string[]> {
  const res = await fetch(plsUrl)
  if (!res.ok) return []
  const text = await res.text()
  const urls: string[] = []
  for (const line of text.split(/\r?\n/)) {
    const match = /^File\d+\s*=\s*(.+)$/i.exec(line.trim())
    if (match) urls.push(match[1].trim())
  }
  return urls
}

export function formatListeners(count: string): string {
  const num = Number(count)
  if (!Number.isFinite(num)) return count
  return new Intl.NumberFormat("ru-RU").format(num)
}

export const DEFAULT_TILE_IDS = [
  "synphaera",
  "groovesalad",
  "metal",
  "dronezone",
  "secretagent",
  "indiepop",
]

export async function fetchDefaultTiles(): Promise<RadioTile[]> {
  const channels = await fetchChannels()
  const byId = new Map(channels.map((c) => [c.id, c]))
  const picked = DEFAULT_TILE_IDS.map((id) => byId.get(id)).filter(
    (c): c is Channel => Boolean(c),
  )
  const tiles = await Promise.all(
    picked.map(async (channel) => {
      const urls = await resolveStreams(pickPlaylist(channel).url)
      return {
        id: channel.id,
        title: channel.title,
        cover: channel.xlimage,
        stream: urls[0] ?? "",
      }
    }),
  )
  return tiles.filter((tile) => tile.stream !== "")
}
