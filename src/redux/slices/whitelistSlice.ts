import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface selcetServer{
    id: string
    name: string
    discordGuildId:string
}

export interface whiteListState {
  selectMultipleServerList :selcetServer[],
  isEditWhitelist:any,
  requiredRoleForUser:any
}

const initialState: whiteListState = {
	selectMultipleServerList : [],
  isEditWhitelist:null,
  requiredRoleForUser:null
}

export const whiteListSlice = createSlice({
  name: 'multipalServer',
  initialState,
  reducers: {
    setMultipleList: (state:any, action: PayloadAction<selcetServer[]>) => { state.selectMultipleServerList = action.payload },
    isEditWhitelist: (state:any, action:any) => { state.isEditWhitelist = action.payload },
    requiredRoleForUser: (state:any, action:any) => { state.requiredRoleForUser = action.payload },
  },
})

// Action creators are generated for each case reducer function
export const { setMultipleList,isEditWhitelist,requiredRoleForUser } = whiteListSlice.actions

const whiteListReducer = whiteListSlice.reducer;
export default whiteListReducer;