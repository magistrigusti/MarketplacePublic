import { useIonAlert } from '@ionic/react';
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setWallet } from '../redux/slices/walletSlice';


function useConnectWallet() {
	const dispatch = useDispatch()
	const [present] = useIonAlert();
	const connectWallet = useCallback(async (options : { onlyIfTrusted : boolean} | null) => {
// console.log("options&&&&&&&&&",options)
			// @ts-ignore
			const { solana } = window;
			if (solana && solana.isPhantom) {
					const response = await solana.connect(options);
					// console.log('onload - Connected with Public Key:', response.publicKey.toString());

					// Set the user's publicKey in state to be used later!
					dispatch(setWallet(response.publicKey.toString()));
			} else if(options === null){
				await present('Please get a Phantom Wallet! Note a wallet is not required to use the site - you can add wallet(s) manually on the Fox Token page', [{text: 'Ok'}]);
			}
	}, [dispatch, present])
	return connectWallet
}

export default useConnectWallet
