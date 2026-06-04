export interface User {
  id: string
  username: string
  name: string
  role: string
}

export interface Supplier {
  id: string
  name: string
  contact: string | null
  leadTime: number
  rating: number
}

export interface Component {
  id: string
  partNumber: string
  description: string | null
  stockQty: number
  minStock: number
  location: string | null
  supplierId: string | null
  supplier: Supplier | null
}

export interface Bom {
  id: string
  pcbName: string
  revision: string
  bomLines: BomLine[]
}

export interface BomLine {
  id: string
  bomId: string
  componentId: string
  qtyPerUnit: number
  designator: string | null
  component: Component
}

export interface Order {
  id: string
  client: string
  status: string
  priority: string
  dueDate: string | null
  notes: string | null
  createdBy: string | null
  creator: User | null
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  statusLogs: StatusLog[]
}

export interface OrderItem {
  id: string
  orderId: string
  bomId: string
  quantity: number
  unitCost: number
  notes: string | null
  bom: Bom
}

export interface StatusLog {
  id: string
  orderId: string
  fromStatus: string | null
  toStatus: string
  userId: string | null
  user: User | null
  notes: string | null
  createdAt: string
}

export interface ProductionLog {
  id: string
  orderItemId: string
  station: string
  operatorId: string | null
  operator: User | null
  startedAt: string
  completedAt: string | null
  status: string
  notes: string | null
  orderItem: OrderItem
}

export interface DashboardStats {
  activeOrders: number
  totalOrders: number
  completed: number
  rejected: number
  totalProduced: number
  yieldRate: number
  date?: string
}
