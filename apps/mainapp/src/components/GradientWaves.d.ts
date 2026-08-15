import type { JSX } from "react"

interface GradientWavesProps {
  horizonColor?: string
  waveColor?: string
  crestColor?: string
  speed?: number
  amplitude?: number
  waveScale?: number
  waveRatio?: number
  swell?: number
  turbulence?: number
  tilt?: number
  zoom?: number
  height?: number
  fogDepth?: number
  detail?: "low" | "medium" | "high"
  brightness?: number
  opacity?: number
  mouseInteraction?: boolean
  parallaxStrength?: number
  grain?: boolean
  grainIntensity?: number
  className?: string
}

declare const GradientWaves: (props: GradientWavesProps) => JSX.Element

export default GradientWaves
