import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    ConnectionProvider,
    useWallet,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useEffect, useMemo } from 'react';
import { WalletMultiButton } from './wallet-modal/componet/WalletMultiButton';
import "./WalletButton.scss"

require('@solana/wallet-adapter-react-ui/styles.css');

const WalletButton: FC = () => {
    return (
            <Content />
    );
};
export default WalletButton;


const Content: FC = () => {
    const {  disconnect } = useWallet();
    return <WalletMultiButton />;
};
