import { useWallet } from '@solana/wallet-adapter-react';
import {
    useWalletModal,
    WalletConnectButton,
    WalletModalButton,
} from '@solana/wallet-adapter-react-ui';
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button, ButtonProps } from './Button';
import { Tooltip } from 'react-tippy';
import { setWallet } from '../../../redux/slices/walletSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery as useReactQuery } from 'react-query';
import { instance } from '../../../axios';
import { AxiosResponse } from 'axios';
import { RootState } from '../../../redux/store';
import { queryClient } from '../../../queryClient';

export const WalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLUListElement>(null);
    const dispatch = useDispatch();
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [children, wallet, base58]);


    // const { data: multWallet, isLoading: multWalletLoading } = useReactQuery(
    //     ['multWallet'],
    //     async () => {
    //         try {
    //             const {
    //                 data: { body: multWallet },
    //             } = await instance.get('/getMultWallet');
    //             console.log('Wallets Added', multWallet);
    //             return multWallet as string[];
    //         } catch (e) {
    //             console.error('try/catch in FoxToken.tsx: ', e);
    //             const error = e as Error & { response?: AxiosResponse };
    //
    //             let msg = '';
    //             if (error?.response) {
    //                 msg = String(error.response.data.body);
    //             } else {
    //                 msg = 'Unable to connect. Please try again later';
    //             }
    //         }
    //     }
    // );

    // useEffect(() => {
    //     if (base58) {
    //         dispatch(setWallet(base58));
    //     } else if (multWallet && multWallet.length > 0) {
    //         dispatch(setWallet(multWallet[0]));
    //     } else {
    //         dispatch(setWallet(null));
    //     }
    // }, [base58, multWallet,content]);

    useEffect(() => {
        if (base58) {
            dispatch(setWallet(base58));
        } else {
            dispatch(setWallet(null));
        }
    }, [base58, content]);


    const openDropdown = useCallback(() => {
        setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setActive(false);
    }, []);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);

    useEffect(() => {
        console.log("walletAddress",walletAddress)
    }, [walletAddress])


    if (!wallet && !walletAddress )
        return <WalletModalButton {...props}>{children}</WalletModalButton>;
    if (!base58  && !walletAddress)
        return <WalletConnectButton {...props}>{children}</WalletConnectButton>;



    return (
        <Tooltip
            html={(
                <div>
                 <Button className="tooltip-btn" onClick={async()=>{
                    if(base58){
                        disconnect()
                        // if(multWallet && multWallet.length > 0){
                        //     dispatch(setWallet(multWallet[0]));
                        // }else{
                            dispatch(null);
                        // }
                        return;
                    }

                    // await instance.delete('/resetMultWallet');
                    // queryClient.setQueryData('multWallet', () => []);
                    // dispatch(setWallet(null));
                    // console.log("null")

                    }}>
                 Disconnect
                 </Button>
                </div>
              )}
            position="bottom"
            trigger="click"
            animation="perspective"
        >
            <Button
                aria-expanded={active}
                className="wallet-adapter-button-trigger"

                style={{
                    pointerEvents: active ? 'none' : 'auto',
                    ...props.style,
                }}
                onClick={openDropdown}
                {...props}
            >
                {walletAddress
                    ? walletAddress.slice(0, 4) + '..' + walletAddress.slice(-4)
                    : content}
            </Button>
        </Tooltip>

    );
};
