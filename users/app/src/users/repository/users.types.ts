type User = {
  name: string
  email: string
}

type Pagination = { offset?: number; limit?: number }
type UserFilter = { id?: string } & Partial<User>
type UserFilterMany = Partial<User>
type UserCreate = User
type UserUpdate = Partial<User>
