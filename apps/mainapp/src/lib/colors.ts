export function oklchToHex(oklch: string): string {
  const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(oklch)
  if (!match) return "#000000"
  const L = Number(match[1])
  const C = Number(match[2])
  const H = (Number(match[3]) * Math.PI) / 180
  const a = C * Math.cos(H)
  const b = C * Math.sin(H)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const gamma = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  const byte = (c: number) =>
    Math.round(Math.min(1, Math.max(0, gamma(c))) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${byte(r)}${byte(g)}${byte(bl)}`
}

export async function getDominantColors(
  url: string,
): Promise<[string, string]> {
  const fallback: [string, string] = ["#8EBCA8", "#4e7a66"]
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    await img.decode()

    const size = 48
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return fallback
    ctx.drawImage(img, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)

    const buckets = new Map<
      number,
      { count: number; r: number; g: number; b: number }
    >()
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const sat = Math.max(r, g, b) - Math.min(r, g, b)
      if (luma < 40 || luma > 215 || sat < 20) continue
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
      const entry = buckets.get(key)
      if (entry) {
        entry.count++
        entry.r += r
        entry.g += g
        entry.b += b
      } else {
        buckets.set(key, { count: 1, r, g, b })
      }
    }
    if (buckets.size === 0) return fallback

    const sorted = [...buckets.values()].sort((x, y) => y.count - x.count)
    const toHex = (entry: {
      count: number
      r: number
      g: number
      b: number
    }) => {
      const byte = (n: number) =>
        Math.round(n / entry.count).toString(16).padStart(2, "0")
      return `#${byte(entry.r)}${byte(entry.g)}${byte(entry.b)}`
    }

    const isUsable = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      return luma >= 35 && luma <= 225 && Math.max(r, g, b) - Math.min(r, g, b) >= 18
    }
    const pool = sorted.map(toHex).filter(isUsable)
    if (pool.length === 0) return fallback

    const c1 = pool[0]
    let c2 = pool[1] ?? c1
    for (const candidate of pool.slice(1)) {
      if (colorDistance(c1, candidate) > 60) {
        c2 = candidate
        break
      }
    }
    return [c1, c2]
  } catch {
    return fallback
  }
}

function colorDistance(a: string, b: string): number {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ar = pa >> 16
  const ag = (pa >> 8) & 255
  const ab = pa & 255
  const br = pb >> 16
  const bg = (pb >> 8) & 255
  const bb = pb & 255
  return Math.abs(ar - br) + Math.abs(ag - bg) + Math.abs(ab - bb)
}
