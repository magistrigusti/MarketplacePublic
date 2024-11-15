import React, { useState, useRef, useCallback, useEffect, FC, ReactNode, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { showWalletInfo, showWalletModalPopup } from '../../redux/slices/walletSlice';
// import WalletModalPopup from './WalletModalPopup';
import { useWalletModal, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { GlowWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import './componet/wallet-modal.css';




 const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


const WalletModalInfo: FC = () => {
    return (
        <WalletContext>
            <InfoModal />
        </WalletContext>
    );
};


function InfoModal() {
    let dispatch = useDispatch();

    let handleClose = () => {
        dispatch(showWalletInfo(false));
    };
    const { setVisible,visible} = useWalletModal();
    const showModalInfo = useSelector(
        (state: RootState) => state.wallet.showModalInfo
    );
    const showWalletModal = useSelector(
        (state: RootState) => state.wallet.showWalletModal
    );

    if (showModalInfo) {
        return (
            <>
                <div
                    className="relative z-10"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="wallet-adapter-modal-container">
                        <div className="wallet-adapter-modal-wrapper">
                            <button
                                onClick={handleClose}
                                className="wallet-adapter-modal-button-close"
                            >
                                <svg width="14" height="14">
                                    <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" />
                                </svg>
                            </button>

                            <h1 className="wallet-adapter-modal-title">
                                You'll need a wallet on Solana to continue
                            </h1>
                            <div className="wallet-adapter-modal-middle">
                                {/* <WalletSVG /> */}
                                <button
                                    type="button"
                                    className="wallet-adapter-modal-middle-button"
                                    onClick={(event) => {
                                        handleClose()
                                        dispatch(showWalletModalPopup(true))
                                        setVisible(true)
                                    }}
                                >
                                    Get started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    // if(visible){
    //     return <WalletModalPopup />;
    // }
    
    return null;
}

export default WalletModalInfo;
