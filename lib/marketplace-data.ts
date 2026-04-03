export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Herbs'
  | 'Flowers'
  | 'Seeds'
  | 'Seedlings'
  | 'Preserves'
  | 'Honey'
  | 'Eggs'
  | 'Dairy'
  | 'Baked Goods'
  | 'Value-Added'
  | 'Other'

export type DeliveryMethod = 'PICKUP' | 'DELIVERY' | 'SHIPPING'
export type ProductStatus = 'ACTIVE' | 'SOLD_OUT' | 'DRAFT'

export interface Product {
  id: string
  title: string
  description: string
  category: ProductCategory
  price: number
  unit: string
  quantity: number
  images: string[]
  sellerId: string
  sellerName: string
  status: ProductStatus
  deliveryMethods: DeliveryMethod[]
}
