// Types for the explore/map interface
export interface PlotMarker {
  id: string
  title: string
  latitude: number
  longitude: number
  acreage: number
  pricePerMonth: number
  status: 'ACTIVE' | 'RENTED' | 'INACTIVE'
  images: string[]
  city: string
  state: string
  soilType: string[]
  waterAccess: string[]
  hasIrrigation: boolean
  hasFencing: boolean
  hasGreenhouse: boolean
  averageRating?: number
  ownerName: string
  ownerAvatar?: string
}

export interface MapFilters {
  minAcreage?: number
  maxAcreage?: number
  minPrice?: number
  maxPrice?: number
  soilTypes?: string[]
  waterAccess?: string[]
  hasIrrigation?: boolean
  hasFencing?: boolean
  hasGreenhouse?: boolean
  hasElectricity?: boolean
  usdaZones?: string[]
  status?: ('ACTIVE' | 'RENTED' | 'INACTIVE')[]
  searchLocation?: string
}
