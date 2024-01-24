export type Admin = {
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
}

export type AdminSlice = {
  info: Admin | null
  active: boolean
  activeTimout: number
  JwtTimeout: number
}
