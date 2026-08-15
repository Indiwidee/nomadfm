export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <a href="#top" aria-label="Nomad FM — back to top">
          <img src={`${import.meta.env.BASE_URL}nomad-wide.svg`} alt="Nomad FM" className="h-9 w-auto" />
        </a>
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nomad FM. Your last next music app.
        </p>
        <nav aria-label="Footer" className="flex gap-5 text-sm text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#stations" className="transition-colors hover:text-foreground">
            Stations
          </a>
          <a href="#testimonials" className="transition-colors hover:text-foreground">
            Reviews
          </a>
        </nav>
      </div>
    </footer>
  )
}
