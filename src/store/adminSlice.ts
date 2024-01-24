import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosBackInstance from '@/services/axiosInstances/axiosBackInstance'
import { AdminSlice } from '@/types/adminType'

const initialState: AdminSlice = {
  info: null,
  active: false,
  activeTimout: 0,
  JwtTimeout: 270000,
}

export const resolveAdmin = createAsyncThunk('admin/admin', async () => {
  const result: any = await axiosBackInstance.get('/users/one', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
    },
  })
  return result.data.data
})

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setInfo(state, action) {
      state.info = action.payload
    },
    setActive(state, action) {
      state.active = action.payload
    },
    setActiveTimout(state, action) {
      state.activeTimout = action.payload
    },
    logout(state) {
      state.info = null
      state.active = false
      localStorage.removeItem('swafe-admin')
    }
  },
  extraReducers: builder => {
    builder
      .addCase(resolveAdmin.fulfilled, (state, action) => {
        state.info = action.payload.user
        localStorage.setItem('swafe-admin', action.payload.token)
        state.active = true
      })
      .addCase(resolveAdmin.rejected, state => {
        state.active = false
        localStorage.removeItem('swafe-admin')
      })
  },
})

export const { setInfo, setActive, setActiveTimout, logout } = adminSlice.actions
export default adminSlice.reducer
