import { Button, buttonVariants } from "@/components/ui/button"
import GradientWaves from "@/components/GradientWaves"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { APP_URL } from "@/lib/app-url"

const stats = [
  { value: "100+", label: "curated stations" },
  { value: "0", label: "ads, ever" },
  { value: "∞", label: "hours of music" },
] as const

export function Hero() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-24 text-center sm:px-6"
    >
      {}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68dvh]" aria-hidden>
        <GradientWaves
          horizonColor="#006045"
          waveColor="#009966"
          crestColor="#FFFFFF"
          speed={0.4}
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
        {}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-8xl">
          Nomad&nbsp;FM
        </h1>
        <p className="mt-4 text-2xl font-semibold tracking-tight text-chart-2 sm:text-4xl">
          Your last next music app.
        </p>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Hundreds of hand-picked radio stations in stunning quality — no accounts,
          no ads, no clutter. Open the app, tap a tile, and disappear into the music.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "h-12 rounded-full px-8 text-base shadow-lg shadow-[#006045]/40",
            })}
          >
            Start listening
          </a>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-white/10 bg-white/5 px-8 text-base backdrop-blur"
            onClick={scrollToFeatures}
          >
            See what&apos;s inside
          </Button>
        </div>

        <dl className="mt-14 flex items-center gap-8 sm:gap-14">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#stations"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 p-2.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        aria-label="Scroll to stations"
      >
        <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
