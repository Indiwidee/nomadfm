import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { Stations } from "@/components/stations"
import { Features } from "@/components/features"
import { Preview } from "@/components/preview"
import { Testimonials } from "@/components/testimonials"
import { Cta } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function App() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Stations />
        <Features />
        <Preview />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
