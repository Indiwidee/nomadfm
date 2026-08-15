import { buttonVariants } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlayIcon } from "@hugeicons/core-free-icons"

/** Куда ведёт финальный CTA — dev-сервер mainapp по умолчанию. */
const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173"

export function Cta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-20 text-center sm:px-16 sm:py-24">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,96,69,0.4) 0%, rgba(0,124,85,0.12) 45%, rgba(0,188,125,0.3) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60rem 20rem at 50% 120%, rgba(94,233,181,0.3) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ready to press play?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Nomad FM is free, open and ready when you are. Your next favourite
            station is one tap away.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className:
                "mt-9 h-12 rounded-full px-9 text-base shadow-lg shadow-[#006045]/40",
            })}
            data-icon="inline-start"
          >
            <HugeiconsIcon icon={PlayIcon} className="size-4" />
            Open Nomad FM
          </a>
        </div>
      </div>
    </section>
  )
}
