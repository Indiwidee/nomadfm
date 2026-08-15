export function Preview() {
  return (
    <section id="stations" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            One tap. Infinite music.
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Your stations live on a grid of tiles. Tap one and the whole screen
            becomes the music — with waves that pulse along in real time.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <img
            src="/appDesktop.webp"
            alt="Nomad FM — сетка станций и плеер"
            loading="lazy"
            className="w-full rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10"
          />
        </div>
      </div>
    </section>
  )
}
