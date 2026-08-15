import { HugeiconsIcon } from "@hugeicons/react"
import { MusicNote01Icon } from "@hugeicons/core-free-icons"

const stations = [
  "Groove Salad",
  "Drone Zone",
  "Secret Agent",
  "Indie Pop",
  "Metal",
  "Synphæra",
  "Underground 80s",
  "Fluid",
  "Def Con",
  "Boom Box",
  "Cloude 88",
  "Flytrap",
] as const

export function Stations() {
  return (
    <section
      aria-label="Stations"
      className="relative border-y border-white/5 bg-background/60 py-8 backdrop-blur-sm"
    >
      <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex animate-marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-10 pr-10"
            >
              {stations.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-10 text-sm font-medium tracking-[0.2em] text-muted-foreground/80 uppercase"
                >
                  {name}
                  <HugeiconsIcon
                    icon={MusicNote01Icon}
                    className="size-4 text-primary/60"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
