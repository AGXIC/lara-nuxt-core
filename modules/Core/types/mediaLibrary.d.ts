export {}
declare global {
  interface IMediaItem {
    id: number
    title: string
    path: string
    path_url: string
    type: string
    size: string
    collection: string
    user: IUserItem
    user_id: number
    customer_id?: number | null
    archive_code?: number | null
    owner?: string | null
    order_type?: string | null
    customer?: ICustomer
    peaks?: number[]
    created_at?: Date
    updated_at?: Date
  }
}
