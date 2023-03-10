import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
    user: User | null
}

const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
        },
    },
})

export const { setCurrentUser } = authSlice.actions

export default authSlice.reducer
