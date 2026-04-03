export interface PlotMarker {
  id: string
  title: string
  latitude: number
  longitude: number
  acreage: number
  pricePerMonth: number
  status: string
  images: string[]
  city: string
  state: string
  soilType: string[]
  waterAccess: string[]
  hasIrrigation: boolean
  hasFencing: boolean
  hasGreenhouse: boolean
  averageRating: number
  ownerName: string
}

export const SAMPLE_PLOTS: PlotMarker[] = []
