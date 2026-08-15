import { buttonVariants } from "@/components/ui/button"

/** Куда ведёт CTA «Open app» — dev-сервер mainapp по умолчанию. */
const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173"

const links = [
  { href: "#features", label: "Features" },
  { href: "#stations", label: "Stations" },
  { href: "#testimonials", label: "Reviews" },
] as const

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Nomad FM — back to top" className="flex items-center">
          <img src="/nomad-wide.svg" alt="Nomad FM" className="h-10 w-auto" />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={APP_URL}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Open app
        </a>
      </div>
    </header>
  )
}
