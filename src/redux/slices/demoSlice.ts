import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DemoState {
  demo: boolean;
  role:string | null
}

const initialState: DemoState = {
	demo : false,
  role:''
}

export const demoSlice = createSlice({
  name: 'Demo',
  initialState,
  reducers: {
    setDemo: (state, action: PayloadAction<boolean>) => {
      state.demo = action.payload
    },
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDemo,setRole } = demoSlice.actions

const demoReducer = demoSlice.reducer;
export default demoReducer;