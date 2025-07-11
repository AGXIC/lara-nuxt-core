export {}
declare global {
  declare type TPageLinks = { active: boolean; label: string; url?: string }

  declare type TPageProps<T = any> = {
    current_page: number
    data: T[]
    first_page_url: string
    from: any
    last_page: number
    last_page_url: string
    links: TPageLinks[]
    next_page_url: string
    path: string
    per_page: number
    prev_page_url: string
    to: any
    total: number
  }

  interface IModel {
    id: number
    created_at: Date
    updated_at: Date
    deleted_at?: Date | null
  }

  type FieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'time'
    | 'object'
    | 'array'
    | 'unknown'

  type InferFieldType<T> = T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends Date
        ? 'date'
        : T extends Array<any>
          ? 'array'
          : T extends object
            ? 'object'
            : T extends string
              ? 'string'
              : 'unknown'

  type TField<T, K extends keyof T> = {
    attribute: K
    value: T[K]
    type: FieldType
    label: string
    hint: string | null
    fillable: boolean
    filterable: boolean
    sortable: boolean
    showable?: boolean
    options: { value: any; label: string }[]
  }

  type TFields<T> = {
    [K in keyof T]: TField<T, K>
  }[keyof T][]
}
