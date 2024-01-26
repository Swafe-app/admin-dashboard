export type User = {
  uid: string
  email: string
  firstName: string
  lastName: string
  phoneCountryCode: string | null
  phoneNumber: string | null
  emailVerified: boolean
  phoneVerified: boolean
  role: string
  verificationToken: string | null
  selfie: string | null
  selfieStatus: string
  createdAt: Date
  updatedAt: Date
}

export type ListUsersResponse = {
  status: string,
  message: string,
  data: User[]
}

export type DatagridUser = {
  id: string
  date: Date
  name: string
  image: string
  status: string
}
