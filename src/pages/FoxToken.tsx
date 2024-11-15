import {
    IonButton,
    IonList,
    IonLabel,
    IonItem,
    IonInput,
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    useIonToast,
    IonIcon,
    IonRippleEffect,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
} from '@ionic/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Loader from '../components/Loader';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import * as solanaWeb3 from '@solana/web3.js';
import {
    add,
    albums,
    chevronDown,
    chevronUp,
    close,
    notifications,
    notificationsOutline,
    wallet,
    cog,
    logoDiscord,
    logoTwitter,
} from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ReactTooltip from 'react-tooltip';
import Cookies from 'universal-cookie';
import {
    getLiveFoxTokenData,
    shortenedWallet,
} from '../components/FoxTokenFns';
import Table from '../components/Table';
import { Column } from '@material-table/core';
import _ from 'lodash';
import { AppComponentProps } from '../components/Route';
import FoxTokenCharts from '../components/FoxTokenCharts';
import { FoxTokenData } from '../types/FoxTokenTypes';
import useFoxTokenChartCookies from '../components/useFoxTokenChartCookies';
import { css } from '@emotion/react';
import moment from 'moment';
import { useHistory, Route, useParams } from 'react-router';
import FfNamed from './home/FfNamed';
import usePersistentState from '../hooks/usePersistentState';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery as useReactQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { queryClient } from '../queryClient';
import { RefresherEventDetail } from '@ionic/core';
import { Virtuoso } from 'react-virtuoso';
import './FoxToken.scss';
import { setWallet } from '../redux/slices/walletSlice';
import TVChartContainer from '../components/ChartContainer';
import { useWallet } from '@solana/wallet-adapter-react';

// @ts-ignore
const columns: Column<FoxTokenData>[] = [
    {
        title: 'Token',
        render: (record) => (
            <div className="w-44">
                <span className="relative top-2 pr-3 w-24">
                    {/*ff link*/}
                    <a
                        href={`https://famousfoxes.com/tokenmarket/${record.token}`}
                        target="_blank"
                        className="hover:opacity-80 "
                    >
                        <img
                            src="/assets/icons/FoxTokenLogo.svg"
                            css={css`
                                color: var(--ion-text-color);
                            `}
                            className="h-5 pr-1 inline mb-4"
                        />
                    </a>

                    {/*solscan*/}
                    <a
                        href={`https://solscan.io/token/${record.token}`}
                        target="_blank"
                        className="hover:opacity-80"
                    >
                        <img
                            src="/assets/icons/solscan.png"
                            className="h-5 pr-1 inline mb-4"
                        />
                    </a>
                </span>

                <br className="xl:hidden lg:hidden" />

                {shortenedWallet(record.token)}
            </div>
        ),
        width: '300px',
        customSort: (a, b) => a.token.localeCompare(b.token),
        customFilterAndSearch: (term, rowData) =>
            rowData?.token?.toLowerCase().includes(term.toLowerCase()),
    },
    {
        title: 'Name',
        customSort: (a, b) => a.name?.localeCompare(b.name),
        render: (record) => <span>{record?.name}</span>,
        customFilterAndSearch: (term, rowData) =>
            rowData?.name?.toLowerCase().includes(term.toLowerCase()),
    },
    {
        title: 'Price',
        customSort: (a, b) => a.floorPrice - b.floorPrice,
        render: (record) => (
            <div className="break-all whitespace-normal w-40">
                {record?.floorPrice} ◎
            </div>
        ),
        // customFilterAndSearch: ( rowData) => rowData.floorPrice,        customFilterAndSearch: (term, rowData,) =>   JSON.stringify(rowData.floorPrice).toLowerCase().includes(term.toLowerCase()),
    },
    {
        title: 'Listings',
        customSort: (a, b) => a.totalTokenListings - b.totalTokenListings,
        render: (record) => <span>{record?.totalTokenListings}</span>,
    },
    {
        title: 'Created',
        // @ts-ignore
        render: (record) => (
            <span>{moment(record.createdAt).format('MM-DD-YYYY')}</span>
        ),
        // @ts-ignore
        customSort: (a, b) =>
            (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any),
    },
    {
        title: 'Last Sale',
        customSort: (a, b) =>
            (new Date(a.lastSaleDate ? a.lastSaleDate : 0) as any) -
            (new Date(b.lastSaleDate ? b.lastSaleDate : 0) as any),
        render: (record) => (
            <div className="w-20">
                {record && record.lastSaleDate
                    ? moment(record.lastSaleDate).fromNow()
                    : '-'}
            </div>
        ),
    },
    {
        title: '# Owned',
        render: (record) => (
            <div className="w-20">{record?.whichMyWallets?.split('-')[0]}</div>
        ),
        // sorter: (a, b) => a.whichMyWallets.localeCompare(b.whichMyWallets),
    },
    {
        title: 'Wallet',
        render: (record) => (
            <span>{record?.whichMyWallets?.split('-')[1]}</span>
        ),
        // sorter: (a, b) => a.whichMyWallets.localeCompare(b.whichMyWallets),
    },
    {
        title: '',
        render: (record) => (
            <>
                {/*twitter*/}
                <a
                    href={'https://twitter.com/' + record.twitter}
                    className="hover:opacity-80"
                    target="_blank"
                    hidden={!record.twitter}
                >
                    <IonIcon icon={logoTwitter} className="big-emoji " />
                    <IonRippleEffect />
                </a>

                {/*discord*/}
                <a
                    href={'https://discord.gg/' + record.discord}
                    target="_blank"
                    className={'hover:opacity-80 pr-1'}
                    hidden={!record.discord}
                >
                    <IonIcon icon={logoDiscord} className="big-emoji " />
                    <IonRippleEffect />
                </a>

    {/*        </>,*/}
    {/*        hiddenByColumnsButton:true*/}

    {/*}*/}

            </>
        ),
        hiddenByColumnsButton: true,
    },

];
const columns_mobile: Column<FoxTokenData>[] = [
    {
        title: 'Details',
        render: (record: any) => (
            <span className="">
                <div>
                    {/*twitter*/}
                    {record.twitter ? (
                        <a
                            href={'https://twitter.com/' + record.twitter}
                            className="hover:opacity-80"
                            target="_blank"
                            hidden={!record.twitter}
                        >
                            <IonIcon
                                icon={logoTwitter}
                                className="big-emoji "
                            />
                            <IonRippleEffect />
                        </a>
                    ) : null}

                    {/*discord*/}
                    {record.discord ? (
                        <>
                            {' '}
                            <a
                                href={'https://discord.gg/' + record.discord}
                                target="_blank"
                                className={'hover:opacity-80 ml-1'}
                                hidden={!record.discord}
                            >
                                <IonIcon
                                    icon={logoDiscord}
                                    className="big-emoji "
                                />
                                <IonRippleEffect />
                            </a>{' '}
                        </>
                    ) : null}

                    {/*ff link*/}
                    <a
                        href={`https://famousfoxes.com/tokenmarket/${record.token}`}
                        target="_blank"
                        className="hover:opacity-80 ml-1 "
                    >
                        <img
                            src="/assets/icons/FoxTokenLogo.svg"
                            css={css`
                                color: var(--ion-text-color);
                            `}
                            className="h-5 pr-1 inline mb-4"
                        />
                    </a>

                    {/*solscan*/}
                    <a
                        href={`https://solscan.io/token/${record.token}`}
                        target="_blank"
                        className="hover:opacity-80"
                    >
                        <img
                            src="/assets/icons/solscan.png"
                            className="h-5 ml-1 inline mb-4"
                        />
                    </a>
                </div>

                {/* <br className="xl:hidden lg:hidden" /> */}
                {
                    <>
                        <span>
                            {' '}
                            <b>Token : </b>
                            {shortenedWallet(record?.row_obj?.token)}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Name : </b>
                            {record?.row_obj?.name}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Price : </b>
                            {record?.row_obj?.floorPrice} ◎
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Listings : </b>
                            {record?.row_obj?.totalTokenListings}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Created : </b>
                            {moment(record?.row_obj?.createdAt).format(
                                'DD-MM-YYYY'
                            )}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Last Sale Date : </b>
                            {moment(record?.row_obj?.lastSaleDate).fromNow()}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Owned : </b>
                            {record?.row_obj?.whichMyWallets?.split('-')[0]}
                        </span>
                    </>
                }
                {
                    <>
                        <br />
                        <span>
                            <b>Wallet : </b>
                            {record?.row_obj?.whichMyWallets?.split('-')[1]}
                        </span>
                    </>
                }
            </span>
        ),
        customSort: (a, b) => a.token.localeCompare(b.token),
        customFilterAndSearch: (term, rowData) => {
            return (
                rowData?.token?.toLowerCase().includes(term.toLowerCase()) ||
                rowData?.name?.toLowerCase().includes(term.toLowerCase())
            );
        },
    },
];

interface FoxToken {
    contentRef: AppComponentProps['contentRef'];
}

function FoxToken({ contentRef }: FoxToken) {
    const isDemo = useSelector<RootState, boolean>(
        (state: RootState) => state?.demo.demo
    );

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const viewmytoken = query.get('viewmytoken');

    // search value from today's mint
    const [searchValue, setSearchValue] = useState<string>();
    const location = useLocation();

    /**
     * Adding multiple wallets
     */
    const [addMultWallModalOpen, setAddMultWallModalOpen] = useState(false); // model open or not
    const [formWalletMult, setFormWalletMult] = useState(''); // single wallet in the form

    const local_host_str = 'localhost';
    const firstUpdate = useRef(true);

    const [popoverOpened, setPopoverOpened] = useState(false);
    const [viewAbuse, setViewAbuse] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [mode] = usePersistentState('mode', 'dark');
    const cookies = useMemo(() => new Cookies(), []);

    const {
        chartDateSelected,
        setChartDateSelected,
        lineColorSelected,
        setLineColorSelected,
        shadedAreaColorSelected,
        setShadedAreaColorSelected,
    } = useFoxTokenChartCookies();
    const [hidHelpTop, setHidHelpTop] = usePersistentState<boolean>(
        'hidHelpTop',
        false
    );


    const { disconnect } = useWallet();

    const clickedSetHidHelpTop = () => {
        setHidHelpTop(true);
    };

    const { data: multWallet, isLoading: multWalletLoading } = useReactQuery(
        ['multWallet'],
        async () => {
            try {
                const {
                    data: { body: multWallet },
                } = await instance.get('/getMultWallet');
                console.log('Wallets Added', multWallet);
                return multWallet as string[];
            } catch (e) {
                console.error('try/catch in FoxToken.tsx: ', e);
                const error = e as Error & { response?: AxiosResponse };

                let msg = '';
                if (error?.response) {
                    msg = String(error.response.data.body);
                } else {
                    msg = 'Unable to connect. Please try again later';
                }

                present({
                    message: msg,
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            }
        }
    );
    // clicked link to add multiple wallets
    const clickedMultWall = (val: boolean) => {
        setAddMultWallModalOpen(val);
        // setPopoverOpened(false);
    };

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    const addMultWallet = useMutation(
        async (multWallet: string) => {
            try {
                await instance.post('/addaMultWallet', {
                    multWallet,
                });
                return multWallet;
            } catch (e) {
                console.error('try/catch in FoxToken.tsx: ', e);
                const error = e as Error & { response?: AxiosResponse };

                let msg = '';
                if (error && error.response) {
                    msg = String(error.response.data.body);
                } else {
                    msg = 'Unable to connect. Please try again later';
                }

                throw new Error(msg);
            }
        },
        {
            onError: (error: Error) => {
                present({
                    message: error.message,
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            },
            onSuccess: (multWallet: string) => {
                queryClient.setQueryData('multWallet', (old) => [
                    ...(old as string[]),
                    multWallet,
                ]);
                present({
                    message: 'Successfully added the wallet',
                    color: 'success',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            },
        }
    );

    const formLoadingMultWallet = addMultWallet.isLoading;
    const dispatch = useDispatch();
    // in the modal for multiple wallets - submit button clicked
    const addMultWalletsSubmit = () => {
        // dispatch(setWallet(formWalletMult));
        if (multWallet?.length == 3) {
            present({
                message: 'Error - you may only track a maximum of 3 wallets',
                color: 'danger',
                duration: 8000,
                buttons: [{ text: 'hide', handler: () => dismiss() }],
            });
            return;
        }

        if (
            !formWalletMult ||
            (formWalletMult.length !== 43 && formWalletMult.length !== 44)
        ) {
            present({
                message:
                    'Error - please enter a single, valid SOL wallet address',
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
            return;
        }

        addMultWallet.mutate(formWalletMult);
        setFormWalletMult(''); // clear the form
    };


    const resetMultWallet = useMutation(
        async () => {
            try {
                await instance.delete('/resetMultWallet');
            } catch (e) {
                console.error('try/catch in FoxToken.tsx: ', e);
                const error = e as Error & { response?: AxiosResponse };

                let msg = '';
                if (error?.response) {
                    msg = String(error.response.data.body);
                } else {
                    msg = 'Unable to connect. Please try again later';
                }

                throw new Error(msg);
            }
        },
        {
            onError: (error: Error) => {
                present({
                    message: error.message,
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            },
            onSuccess: () => {
                queryClient.setQueryData('multWallet', []);
                present({
                    message: 'Successfully reset mult wallet',
                    color: 'success',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
            },
        }
    );

    // user clicked button to delete their multiple wallets
    const resetMultWalletsSubmit = () => {
        present({
            cssClass: '',
            header: 'Delete Wallets?',
            message:
                'Are you sure you want to reset all of your stored wallets?',
            buttons: [
                'Cancel',
                {
                    text: 'Ok',
                    handler: () => {
                        disconnect().then(result=>{
                            console.log("Result",result)
                        }).catch((err) => {console.log("err",err)})
                        resetMultWallet.mutate();
                        dispatch(setWallet(null));
                    },
                },
            ],
        });
    };

    /**
     * States & Variables
     */
    const [tableData, _setTableData] = useState<FoxTokenData[]>([]);
    const [fullTableData, setFullTableData] = useState<FoxTokenData[]>([]);
    const [mySolBalance, setMySolBalance] = useState('');

    const setTableData = (data: FoxTokenData[]) =>
        _setTableData(
            data.map((row) => ({ ...row, row_obj: row, id: row.token }))
        );
    const [mySplTokens, setMySplTokens]: any = useState([]);

    const [viewMyTokensClicked, setViewMyTokensClicked] = useState(false);
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    // ....bugs site...???
    // useEffect(() => {
    //     if(walletAddress){
    //         getSplFromWallet(walletAddress);
    //     }
    // }, [walletAddress])

    /**
     * Use Effects
     */

    /**
     * Functions
     */
    // Pull to refresh function
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            fetchTableData();
            event.detail.complete();
        }, 1000);
    }

    // load table data!
    const fetchTableData = async () => {
        setTableData([]);

        // ....bugs site...
        // getUserSpls();

        const data: any = await getLiveFoxTokenData(mySplTokens);

        // sometimes only gets named ones...
        if (data.length > 50 && data.length < 500) {
            present({
                message:
                    'We had trouble loading all tokens. Refresh to load all tokens',
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
        }

        if (data.length > 0) {
            setTableData(data);
            setFullTableData(data);
        } else {
            present({
                message: 'Unable to load data. Refresh and try again.',
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
        }
    };

    // give a wallet ... return all spl tokens in it
    const getSplFromWallet = async (wallet: string) => {
        try {
            const { data: splTokens } = await instance.get(
                `${environment.backendApi}/getSplFromWallet`,
                { params: { wallet } }
            );
            if (splTokens) {
                setMySolBalance(splTokens.balance);
                return splTokens.data;
            } else return [];
        } catch (err) {
            present({
                message:
                    'Error when getting your Whitelist tokens from your wallet',
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
            return [];
        }
    };

    // https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/create_mint_and_transfer_tokens.ts
    // https://docs.solana.com/es/developing/clients/jsonrpc-api#gettokenaccountsbyowner
    const getUserSpls = async () => {
        let mySplTokensTemporary: any = [];

        // if no wallet is logged in ... OR didn't set multiple wallets in a cookie, then return table and do nothing else
        // if(!walletAddress && !multWalletAryFromCookie){
        //     await fetchTableData();
        //     return;
        // }

        // first try with the wallet address we got logged in
        if (walletAddress) {
            // @ts-ignore
            mySplTokensTemporary = mySplTokensTemporary.concat(
                await getSplFromWallet(walletAddress)
            );
        }

        // now go through the wallets in cookies
        if (multWallet && multWallet?.length > 0) {
            for (let i in multWallet) {
                const tempWall = multWallet[i];
                // make sure it's length of a sol wallet ... and that its not the connected wallet
                if (tempWall.length === 44 && tempWall !== walletAddress) {
                    mySplTokensTemporary = mySplTokensTemporary.concat(
                        await getSplFromWallet(tempWall)
                    );
                }
            }
            // if didn't have any wallets ... then just load table...
        } else {
            fetchTableData();
        }

        // @ts-ignore
        if (mySplTokensTemporary && mySplTokensTemporary.length > 0) {
            setMySplTokens(mySplTokensTemporary);
            return mySplTokensTemporary;
        } else {
            // stupid bug we can't seem to fix where it shows up all the time, even with no wallets selected
            // present({
            //     message:'None of your tokens seem to be listed, sorry!',
            //     color: 'danger',
            //     duration: 5000,
            //     buttons: [{ text: 'X', handler: () => dismiss() }],
            // });
            fetchTableData();
        }

        // console.log(mySplTokensTemporary);
    };

    // useEffect(() => {
    //     console.log(viewmytoken);
    //     if(viewmytoken){
    //         present({
    //             message: 'Click the red button on the top right to check off this step',
    //             color: 'danger',
    //             duration: 10000
    //         });
    //     }
    // }, [viewmytoken])

    // load table data, after we load in user tokens
    // isn't called on local host, see below useEffect
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        // only fetch data when NOT on local host ... after spl tokens is updated
        if (window.location.href.indexOf(local_host_str) === -1) {
            fetchTableData();
        }
    }, [mySplTokens]);

    // call on load, when cookie array set
    useEffect(() => {
        setSearchValue(location.search);

        if (!multWalletLoading) {
            // however DON'T do this in local host (will do this elsewhere ... since get RPC blocked)
            if (window.location.href.indexOf(local_host_str) === -1) {
                getUserSpls();
            } else {
                if (location.search) {
                    fetchTableData();
                } else {
                    if (location.pathname === '/foxtoken') {
                        fetchTableData();
                    }
                }
            }
        }
    }, [multWallet, multWalletLoading, location]);

    // also call when new wallet is connected to
    useEffect(() => {
        if (
            window.location.href.indexOf(local_host_str) === -1 &&
            walletAddress
        ) {
            getUserSpls();
        }
    }, [walletAddress]);

    /**
     * for submitting custom token names
     */
    const [addNameModalOpen, setAddNameModalOpen] = useState(false);
    const [formToken, setFormToken] = useState('');
    const [formName, setFormName] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formErrMsg, setFormErrMsg] = useState('');
    const clickedAddName = (val: boolean) => {
        setAddNameModalOpen(val);
        // setPopoverOpened(false);
    };

    // submit form to add new wallet
    const submittedForm = () => {
        const body = {
            formToken: formToken,
            formName: formName,
        };

        setFormLoading(true);
        setFormErrMsg('');

        instance
            .post(environment.backendApi + '/receiver/foxTokenNameAdd', body)
            .then((resp) => {
                if (resp.data.error) {
                    setFormLoading(false);
                    if (resp.data.message) {
                        setFormErrMsg(resp.data.message);
                    } else {
                        setFormErrMsg(
                            'An error occurred. Please contact us if this continues to happen'
                        );
                    }
                } else {
                    setFormLoading(false);
                    setFormToken('');
                    setFormName('');

                    clickedAddName(false);

                    // show toast
                    present({
                        message:
                            'Successfully added the name. Refresh to see it',
                        color: 'success',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                }
            })
            .catch((err) => {
                console.error(err);

                setFormLoading(false);
                setFormErrMsg(err);
            });
    };

    // Viewing MY tokens - filter the table
    const viewMyTokens = async (wantViewTokens: boolean) => {
        let SplTokens: any;

        // setPopoverOpened(null);

        // user wants to see MY tokens
        if (wantViewTokens) {
            // set the fact they viewed their token
            // instance.get(environment.backendApi + '/receiver/userViewedMyToken');

            // see other local host on here to see why
            if (window.location.href.indexOf(local_host_str) !== -1) {
                SplTokens = await getUserSpls();

            }
            if (!multWallet?.length && !walletAddress) {
                present({
                    message:
                        'Please connect to your wallet, or click "Add Multiple Wallets" to add one (or three!) manually. Then you can filter this table to only the tokens in your wallet.',
                    color: 'danger',
                    duration: 10000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
                return;
            }

            // make sure they have tokens
            if (
                mySplTokens.length === 0 && (!SplTokens || SplTokens.length === 0 ) && !walletAddress
            ) {
                // show toast
                present({
                    message:
                        'No tokens found on your wallet(s) :( Tokens must be in your wallet, and have an active listing on Fox Token Market',
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                });
                return;
            } else {
                setViewMyTokensClicked(true);
                // setTableData([]);

                // new array of data we'll set later
                let newTableData: any = [];

                // loop through table data (all fox tokens)
                for (let i in tableData) {
                    // if match, then push
                    if (mySplTokens.length > 0) {
                        for (let y in mySplTokens) {
                            if (mySplTokens[y].token === tableData[i].token) {
                                if (
                                    window.location.href.indexOf(
                                        local_host_str
                                    ) !== -1
                                ) {
                                    // then ADD data
                                    if (!tableData[i].whichMyWallets) {
                                        tableData[i].whichMyWallets =
                                            shortenedWallet(
                                                mySplTokens[y].wallet
                                            );
                                    } else {
                                        tableData[i].whichMyWallets +=
                                            ', ' +
                                            shortenedWallet(
                                                mySplTokens[y].wallet
                                            );
                                    }
                                }
                                newTableData.push(tableData[i]);
                                break;
                            }
                        }
                    } else {
                        for (let y in SplTokens) {
                            if (SplTokens[y].token === tableData[i].token) {
                                if (
                                    window.location.href.indexOf(
                                        local_host_str
                                    ) !== -1
                                ) {
                                    // then ADD data
                                    if (!tableData[i].whichMyWallets) {
                                        tableData[i].whichMyWallets =
                                            shortenedWallet(
                                                SplTokens[y].wallet
                                            );
                                    } else {
                                        tableData[i].whichMyWallets +=
                                            ', ' +
                                            shortenedWallet(
                                                SplTokens[y].wallet
                                            );
                                    }
                                }
                                newTableData.push(tableData[i]);
                                break;
                            }
                        }
                    }
                }

                if (newTableData.length === 0) {
                    present({
                        message:
                            'None of your tokens are also listed on FF Token Market :(',
                        color: 'danger',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                    return;
                }

                // this should instantly show the table to the user
                setTableData(newTableData);

                // but then we need to go out and get their latest sales data... takes about 1.5 sec per token
                instance
                    .post(
                        `${environment.backendApi}/receiver/foxTokenLatestSale`,
                        { tokens: newTableData.map((x: any) => x.token) }
                    )
                    .then((res) => {
                        try{
                            const sales = res.data.data.salesData;
                            if (sales) {
                                sales.forEach(
                                    (sale: {
                                        token: string;
                                        lastSaleDate: string;
                                    }) => {
                                        const row = newTableData.find(
                                            (d: any) => d.token === sale.token
                                        );
                                        row.lastSaleDate = sale.lastSaleDate;
                                    }
                                );

                                // once we get the data, then we can set it yet again...
                                setTableData(newTableData);
                            }
                        }catch(err){
                            // once we get the data, then we can set it yet again...
                            setTableData(newTableData);
                        }

                    });
            }

            // user wants to see ALL tokens
        } else {
            setViewMyTokensClicked(false);

            setTableData(fullTableData);
        }
    };



    useEffect(() => {
      if(walletAddress){
        return
      }
      if(multWallet && multWallet.length>0){
        dispatch(setWallet(multWallet[0]));
      }
    }, [multWallet])

   /**
     * Renders
     */

    return (
        <>
            <div hidden={!viewmytoken} className="m-3 relative bg-red-100 p-4 rounded-xl" >
                <div className="text-lg text-red-700 font-medium">
                    <ul>
                        <li>
                            - Click the red button{' '} <IonIcon icon={wallet} className="text-red-600 text-2xl" />{' '} on the top right of the table to check off this step
                        </li>
                        <li>
                            - Note you do NOT have to connect your wallet, click the third button{' '} <IonIcon  icon={albums} className="text-2xl text-gray-500" />{' '} to manually add a wallet
                        </li>
                    </ul>
                </div>
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2"> ! </span>
            </div>

            {/*
                modal - adding multiple wallets
            */}
            <IonModal
                isOpen={addMultWallModalOpen}
                onDidDismiss={() => clickedMultWall(false)}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Add Multiple Wallets
                            <a
                                className="float-right text-base underline cursor-pointer"
                                onClick={() => clickedMultWall(false)}
                            >
                                <IonIcon icon={close} className="h-6 w-6" />
                            </a>
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="">
                    <div className="ml-3 mr-3 mb-2 relative mt-2 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                        <div className="font-medium">
                            {' '}
                            {/* text-lg   */}
                            <p>
                                Used with "View My Tokens" (where you can filter
                                the table to show only tokens in your wallet).
                                Use this to filter the table to tokens that are
                                on multiple wallets. Data is saved
                                cross-platform.
                            </p>
                        </div>
                    </div>

                    <div
                        hidden={(!multWallet || multWallet.length == 0) && !walletAddress}
                        className="ml-3 mr-3 mb-5 relative bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl"
                    >
                        <div className="font-medium">
                            {' '}
                            {/* text-lg   */}
                            <span className="font-bold">Wallets Added:</span>
                            <ul>
                                {multWallet &&
                                    multWallet.map(function (wallet: any) {
                                        return <li key={wallet}>- {wallet}</li>;
                                    })}
                                    {walletAddress&& !multWallet?.includes(walletAddress) && <li>- {walletAddress}</li>}
                            </ul>
                        </div>
                    </div>

                    <div className="ml-3 mr-3">
                        <IonItem>
                            <IonLabel position="stacked" className="font-bold">
                                SOL Wallet Address
                            </IonLabel>
                            <IonInput
                                onIonChange={(e) =>
                                    setFormWalletMult(e.detail.value!)
                                }
                                value={formWalletMult}
                                placeholder="ex. 91q2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU"
                            ></IonInput>
                        </IonItem>

                        <IonButton
                            color="success"
                            className="mt-5"
                            hidden={formLoadingMultWallet}
                            onClick={() => addMultWalletsSubmit()}
                        >
                            Submit
                        </IonButton>
                        <IonButton
                            hidden={!multWallet}
                            color="danger"
                            className="mt-5"
                            onClick={() => resetMultWalletsSubmit()}
                        >
                            Reset Stored Wallets
                        </IonButton>

                        <div hidden={!formLoading}>Loading...</div>
                    </div>
                </IonContent>
            </IonModal>

            {/* modal - For adding a new token */}
            <IonModal
                isOpen={addNameModalOpen}
                onDidDismiss={() => setAddNameModalOpen(false)}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Add a Custom Token Name
                            <a
                                className="float-right text-base underline cursor-pointer"
                                onClick={() => clickedAddName(false)}
                            >
                                <IonIcon icon={close} className="h-6 w-6" />
                            </a>
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="">
                    <div className="ml-3 mr-3 mb-5 relative bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                        <div className="font-medium">
                            <p>
                                Use this if a token on the Fox Token Market
                                doesn't have an official name yet, and you know
                                for certain what the name of the token is
                            </p>

                            <span
                                className="underline cursor-pointer"
                                onClick={() => setViewAbuse(!viewAbuse)}
                            >
                                View Abuse Policy
                            </span>
                            <p className="mt-3" hidden={!viewAbuse}>
                                Your discord name will be recorded when
                                submitting the form. Those abusing the service
                                will receive such punishments as having your
                                account banned from entering data, with severe
                                violations being permanently muted in the
                                Discord
                            </p>
                        </div>
                    </div>

                    {/*bg-gradient-to-b from-bg-primary to-bg-secondary"*/}
                    <div className="ml-3 mr-3">
                        <IonItem>
                            <IonLabel position="stacked" className="font-bold">
                                Token
                            </IonLabel>
                            <IonInput
                                onIonChange={(e) =>
                                    setFormToken(e.detail.value!)
                                }
                                placeholder="ex. Hxq2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU"
                            ></IonInput>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked" className="font-bold">
                                Name
                            </IonLabel>
                            <IonInput
                                onIonChange={(e) =>
                                    setFormName(e.detail.value!)
                                }
                                placeholder="ex. Zillas vs Kong WL"
                            ></IonInput>
                        </IonItem>

                        <IonButton
                            color="success"
                            className="mt-5"
                            hidden={formLoading}
                            onClick={() => submittedForm()}
                        >
                            Submit
                        </IonButton>

                        <div hidden={!formLoading}>Loading...</div>

                        <div
                            className="m-12 relative mt-6 bg-red-100 p-6 rounded-xl"
                            hidden={!formErrMsg}
                        >
                            <p className="text-lg text-red-700 font-medium">
                                {typeof formErrMsg === 'string'
                                    ? formErrMsg
                                    : 'An error occurred, please try again later'}
                                {/*<b>An error occurred, please try again later</b>*/}
                            </p>
                            <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                !
                            </span>
                        </div>
                    </div>
                </IonContent>
            </IonModal>

            {/* please don't remove this... we need this to teach the user... */}
            <div className="m-3 relative bg-primary p-4 rounded-xl" hidden={hidHelpTop} >
                <div className="text-medium text-white font-medium">
                    <b>
                        - Want to see which tokens in your wallet are actually worth something? Click this{' '} <IonIcon icon={wallet} className="text-red-600 text-2xl" />{' '} to show ONLY the tokens that are in your wallet and their respective FP
                        {/*Click this on the top right of the table, to filter the table to only the whitelist tokens in your wallet. You may either connect your wallet in the top right of the site, or add 1-3 wallets with the "+" button discussed below*/}
                        <br />
                        - If you want to add a wallet manually, click this{' '} <IonIcon icon={albums} className="text-2xl" /> to add the wallet of your choosing
                        {/*Used with the above "View My Tokens", use this to filter the table to tokens that are on multiple wallets. You may add up to three wallets to watch*/}
                        <br />
                        - Know what the name of a token is? Click{' '} <IonIcon icon={add} className="text-2xl" /> and share the knowledge
                        {/*Use this if a token on the Fox Token Market doesn't have an official name yet, and you know for certain what the name of the token is*/}
                        <br />
                        <div className="pt-1">
                            - Click 📈 to show a Price / Listing chart for that token
                        </div>
                    </b>
                    <br />
                    <IonButton color="secondary" className="text-sm space-x-1" onClick={() => { clickedSetHidHelpTop(); }} > Got it! </IonButton>
                </div>
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2"> ? </span>
            </div>

            <div>
                {!tableData.length ? (
                    <div className="pt-10 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <div>
                        {/*<IonItem style={{"width": "250px"}}>*/}
                        {/*    <IonLabel>Show Verified Only</IonLabel>*/}
                        {/*    <IonCheckbox onIonChange={e => setCheckedVerifiedOnly(e.detail.checked)} />*/}
                        {/*</IonItem>*/}
                        <IonContent className="h-screen" scroll-y="false">
                            {isMobile ? (
                                <IonRefresher
                                    slot="fixed"
                                    onIonRefresh={doRefresh}
                                    pullFactor={0.5}
                                    pullMin={100}
                                    pullMax={200}
                                >
                                    <IonRefresherContent />
                                </IonRefresher>
                            ) : (
                                ''
                            )}

                        <Virtuoso  className='h-20 foxtoken-table' totalCount={1}
                            itemContent ={()=> <>  <Table
                            data={tableData}
                            columns={ isMobile ? columns_mobile :columns }
                            title="Fox Token Market"
                            description="
                            👪 are community added names.
                            'Not Listed' means it is not listed for sale anymore, and shown for historical purposes.
                            The Last Sale column is only updated when viewing the chart or your own tokens (which updates it for others as well).
                            "
                            url="https://famousfoxes.com/tokenmarket"
                            actions={[
                                {
                                    icon: () => <IonIcon icon={wallet} className={!isDemo ? "text-red-600 text-3xl" : ""} />,
                                    tooltip: viewMyTokensClicked ? 'View All Tokens' : 'View My Tokens',
                                    onClick: () => viewMyTokens(!viewMyTokensClicked),
                                    isFreeAction: true,
									disabled: isDemo
                                },
                                // {
                                //     icon: () => (
                                //         <IonIcon
                                //             icon={notifications}
                                //             className=""
                                //         />
                                //     ),
                                //     tooltip:
                                //         'Alert on new Tokens to your Wallet',
                                //     onClick: () => history.push('/alerts#fnt'),
                                //     isFreeAction: true,
                                // },
                                {
                                    icon: () => <IonIcon icon={albums} />,
                                    tooltip: 'Track Multiple wallets',
                                    onClick: () => clickedMultWall(true),
                                    isFreeAction: true,
									disabled: isDemo
                                },
                                {
                                    icon: () => <IonIcon icon={add} />,
                                    tooltip: 'Add Custom Token Name',
                                    onClick: () => clickedAddName(true),
                                    isFreeAction: true,
                                },
                            ]}
                            options={{
                                thirdSortClick: false,
                                detailPanelType: 'single',
                                search: true,
                                // sortModel={sortModel},
                                searchText: searchValue ? searchValue.replace('?', "") : '' ,
                                searchFieldStyle:{
                                    marginLeft:'-20%',
                                    marginTop:'2%',
                                    paddingLeft:"4%",
                                    borderRadius:30,
                                    borderWidth: 1,
                                    border : mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.876) !important' : '1px solid rgba(10,10,10,0.8) !important'
                                },
                                rowStyle:( rowData:any) =>  ({
                                    backgroundColor : mode === 'dark' ? '' : 'rgba(239,239,239,0.8)',
                                    color: mode === 'dark' ? "" : '#202124',
                                    borderTop: mode === 'dark' ? "" : '1px solid rgba(220,220,220,0.8)',
                                }),
                                // hide eye icon on mobile
                                columnsButton: isMobile ? false : true,
                            }}
                            detailPanel={[
                                {
                                    icon: '📈',
                                    tooltip: 'View Chart',
                                    render: (record:any) => ( <FoxTokenCharts {...record.rowData} /> ),
                                },
                            ]}
                        />
                        {/*recent FF tokens*/}
                        <FfNamed />
                        <ReactTooltip />
                        </>}/>
                        </IonContent>
                        {/*-{foxLineData.labels}-*/}
                    </div>
                )}
            </div>
            <br />
        </>
    );
}

export default FoxToken;
