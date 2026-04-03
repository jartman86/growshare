export type ToolCategory = string

export type ToolCondition = string

export type ToolListingType = 'RENT' | 'SALE' | 'BOTH'

export interface Tool {
  id: string
  title: string
  description: string
  category: ToolCategory
  condition: ToolCondition
  listingType: ToolListingType
  pricePerDay?: number
  salePrice?: number
  images: string[]
  ownerId: string
  ownerName: string
}
