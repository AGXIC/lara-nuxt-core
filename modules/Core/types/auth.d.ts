export interface IAuth {
  user: IUser
  can: Record<string, boolean>
  token: string
  roles: string[]
}

export interface IUser extends IModel {
  // columns
  password?: string
  profile_photo_path?: string | null
  profile_photo_url?: string | null
  remember_token?: string | null
  deleted_at?: Date | null
  // mutators
  has_password: bool
  full_name: string
  // relations
  roles: IRole[]
  permissions: IPermissions[]
}

export interface IRole extends IModel {
  // columns
  name: string
  guard_name?: string
  title?: string | null
  // relations
  users?: User[]
  permissions?: IPermissions[]
}

export interface IPermissions extends IModel {
  name: string
  title: string
  guard_name: string
}
