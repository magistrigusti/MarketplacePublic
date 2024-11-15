import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WalletState {
  walletAddress: string | null;
  showModalInfo:boolean
  showWalletModal:boolean
}

const initialState: WalletState = {
	walletAddress : null,
  showModalInfo:false,
  showWalletModal:false
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<WalletState["walletAddress"]>) => {
      state.walletAddress= action.payload
    },
    showWalletInfo: (state, action: PayloadAction<WalletState["showModalInfo"]>) => {
      state.showModalInfo= action.payload
    },
    showWalletModalPopup: (state, action: PayloadAction<WalletState["showWalletModal"]>) => {
      state.showWalletModal= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setWallet,showWalletInfo,showWalletModalPopup } = walletSlice.actions

const walletReducer = walletSlice.reducer;
export default walletReducer;