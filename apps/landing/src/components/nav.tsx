import { buttonVariants } from "@/components/ui/button"
import { APP_URL } from "@/lib/app-url"

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Nomad FM — back to top" className="flex items-center">
          <img src={`${import.meta.env.BASE_URL}nomad-wide.svg`} alt="Nomad FM" className="h-10 w-auto" />
        </a>
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
