import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"

const testimonials = [
  {
    quote:
      "I deleted three music apps after a week with Nomad FM. Tiles, no ads, and the waves behind the player are hypnotic.",
    name: "Ana Kovac",
    role: "Ambient obsessive",
  },
  {
    quote:
      "As a touring musician I need something that just works. Tap, play, done. This is the last music app I'll ever need.",
    name: "Dmitri Volkov",
    role: "Touring musician",
  },
  {
    quote:
      "It's beautiful, it's fast, and there's not a single thing trying to sell me something. Nomad FM is what streaming should feel like.",
    name: "Sara Lindqvist",
    role: "Product designer",
  },
] as const

export function Testimonials() {
  return (
    <section id="testimonials" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            People who pressed play
            <br />
            never pressed pause.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-card/60">
              <CardContent className="flex h-full flex-col gap-5 pt-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }, (_, i) => (
                    <HugeiconsIcon key={i} icon={StarIcon} className="size-4" />
                  ))}
                </div>
                <p className="flex-1 leading-relaxed text-foreground/90">
                  “{t.quote}”
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
