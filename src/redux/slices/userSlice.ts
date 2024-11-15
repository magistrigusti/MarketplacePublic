import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface userState {
  hasRoles : boolean
}

const initialState: userState = {
	hasRoles : false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setHasRoles: (state, action: PayloadAction<boolean>) => {
		state.hasRoles = action.payload
	}
  },
})

// Action creators are generated for each case reducer function
export const { setHasRoles } = userSlice.actions

const userReducer = userSlice.reducer;
export default userReducer;