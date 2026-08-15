import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AudioWave02Icon,
  BanIcon,
  BoltIcon,
  Playlist02Icon,
  Radio01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"

const features = [
  {
    icon: Radio01Icon,
    title: "Every station, one roof",
    description:
      "Hundreds of hand-picked channels — ambient, metal, synthwave, jazz and everything in between — all in a single tap.",
  },
  {
    icon: BanIcon,
    title: "Zero ads, forever",
    description:
      "No interruptions, no sponsored blocks, no premium upsells. Just the music you came for, from the first second.",
  },
  {
    icon: AudioWave02Icon,
    title: "Crystal-clear sound",
    description:
      "Lossless-quality streams with adaptive buffering, so the music keeps flowing even on a shaky connection.",
  },
  {
    icon: Playlist02Icon,
    title: "Favourites that follow you",
    description:
      "Pin the stations you love and rearrange them into your own personal grid. Your setup, your rules.",
  },
  {
    icon: BoltIcon,
    title: "Instant start",
    description:
      "No sign-up, no account, no onboarding gauntlet. Open the app and you're already listening.",
  },
  {
    icon: Shield01Icon,
    title: "Open source & private",
    description:
      "Built in the open, with no tracking and no data harvesting. Your listening history stays yours.",
  },
] as const

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Music apps keep getting heavier — Nomad FM goes the other way.
            A beautiful player that gets out of your way and lets the sound in.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-card/60 transition-colors hover:bg-card"
            >
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <HugeiconsIcon icon={feature.icon} className="size-5" />
                </div>
                <CardTitle className="mt-4 text-lg font-semibold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
