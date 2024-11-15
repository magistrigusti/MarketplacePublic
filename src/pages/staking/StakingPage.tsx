import React, { useState } from 'react';
import { useHistory } from 'react-router';

function StakingPage() {
    const history = useHistory();
    const [model, setModel] = useState(false);
    return (
        <>
            {/*  */}
            <div className="mb-auto staking-wrapper">
                <div className="p-2 sm:px-8 flex flex-col items-center">
                    {/*  */}

                    <div className='flex justify-between p-2 w-full items-center'>
                        <div className='md:text-4xl text-2xl font-semibold'>
                            Stacking
                        </div>
                        <div>
                            <div>
                                <button
                                    className="w-max mx-auto text-base items-center px-5 py-2 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out connect-wallet"
                                    onClick={() => {
                                        history.push('/connect-wallet');
                                    }}
                                >
                                    Connect Wallet
                                </button>
                                {/* open Model */}
                                {model && (
                                    <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-600 bg-opacity-40 z-50 staking-model">
                                        <div className="rounded-lg w-auto wallet-bg">
                                            <div className="flex flex-col items-start p-4">
                                                {/* Model header */}
                                                <div className="flex items-center w-full mb-6">
                                                    {/* model title */}
                                                    <div className="text-white font-medium text-md mr-5">
                                                        Select preferred
                                                        wallet
                                                    </div>
                                                    {/* model close button */}
                                                    <a
                                                        type="button"
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setModel(false);
                                                        }}
                                                    >
                                                        <svg
                                                            className="ml-auto fill-current text-gray-700 w-6 h-6"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 18 18"
                                                        >
                                                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                                                        </svg>
                                                    </a>
                                                </div>
                                                <hr />
                                                {/* 1 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div className="flex">
                                                        Phantom
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/phantom.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 2 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div className="flex">
                                                        Solflare
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/solflare.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 3 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div className="flex">
                                                        Sollet
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/sollet.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 4 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div className="flex">
                                                        Solflare Extension
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/solflare_extension.svg"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/* 5 */}
                                                <div
                                                    role="button"
                                                    className="py-3 px-5 mb-2 text-white rounded-md text-sm border border-gray-800 w-full relative cursor-pointer wallet-bg"
                                                >
                                                    <div className="flex">
                                                        Sollet Extension
                                                    </div>
                                                    <img
                                                        className="absolute right-3 top-2 w-7 h-7"
                                                        src="./assets/stack-image/sollet_extension.png"
                                                        alt="phantom"
                                                    ></img>
                                                </div>
                                                {/*  */}
                                            </div>
                                        </div>
                                        {/*  */}
                                    </div>
                                )}

                                {/*  */}
                            </div>

                        </div>
                    </div>


                    {/*  */}
                    <div className="flex justify-center w-full lg:flex-row flex-col">
                        {/* 1 */}
                        <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
                            <div className="text-4xl c-text-ochre py-4">
                                $1,420,069
                            </div>
                            <div className="text-md text-white">
                                Minimum Value Locked
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
                            <div className="text-4xl c-text-pink py-4">
                                6669
                            </div>
                            <div className="text-md text-white">
                                Total SOL Decoders Staked
                            </div>
                        </div>
                        {/* 3 */}
                        <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
                            <div className="text-4xl c-text-sky-blue py-4">
                                95%
                            </div>
                            <div className="text-md text-white">
                                of SOL Decoder Staked
                            </div>
                        </div>
                        {/*  */}
                    </div>

                    <div className="c-card text-center p-5 bg-sections-bslgray w-full md:w-2/3 mt-5 rounded-xl max-w-3xl mx-4 md:mx-0">
                        <div className="py-2 ">
                            <span className="mt-2 font-semibold text-2xl">
                                Stake your SOL Decoder NFT(s) for
                            </span>
                            <div className="c-text-green text-4xl my-3">
                                {' '}
                                $DECODE
                            </div>

                            <div className="text-md text-white text-md lg:px-12 leading-9 ">
                                Use your $DECODE to enter our win whitelists, buy SOL Decoder DAO passes, and buy external DAO passes. You can stake your SOL Decoder NFT to earn $DECODE.
                            </div>

                            <button
                                className="w-max mx-auto text-base items-center my-3 px-5 py-2 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out connect-wallet"
                                onClick={() => {
                                    history.push('/connect-wallet');
                                }}
                            >
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StakingPage;
