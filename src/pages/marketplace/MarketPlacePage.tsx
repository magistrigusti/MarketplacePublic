import { IonLabel } from '@ionic/react';
import { Grid, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router';



function MarketPlacePage() {
    const [showlive, setShowlive] = useState(true);
    return (
        <div className="market-wrapper px-4">
            <div className="flex justify-between mt-6">
                <IonLabel className="md:text-4xl text-2xl font-bold">$DECODE Marketplace</IonLabel>
                <button
                    className="w-max text-base items-center md:px-10 px-5 md:py-2 py-1 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out bg-grad-green-blue rounded-xl"
                >
                    FB4X....TAg8
                </button>
            </div>
            <div className="flex justify-start mt-6 flex-row gap-3 mb-6">
                <div className='flex rounded-lg overflow-hidden action-button text-base font-normal tracking-wide shadow-lg text-white capitalize focus:outline-none transition duration-300 transform active:scale-95 ease-in-out justify-center items-center cursor-pointer' onClick={() => setShowlive(true)}>
                    <div className="text-sm md:text-base p-2 md:px-4 w-full">
                        Live Auctions
                    </div>
                    <div className=" bg-black/[.4] py-2 px-4 ">
                        2
                    </div>
                </div>

                <div className='flex rounded-lg overflow-hidden action-button text-base font-normal tracking-wide shadow-lg text-white capitalize focus:outline-none transition duration-300 transform active:scale-95 ease-in-out justify-center items-center cursor-pointer' onClick={() => setShowlive(false)}>
                    <div className="text-sm md:text-base p-2 md:px-4 w-full">
                        Expired
                    </div>
                    <div className=" bg-black/[.4] py-2 px-4 ">
                        3
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="justify-center w-full flex flex-col">
                    <div className="flex  sm:flex-row justify-center flex-wrap">
                        <Grid
                            container
                            spacing={4}
                            className="flex justify-self-center"
                        >
                            {showlive ? <> <Card />
                                <Card /></> : <><Card1 /><Card1 /><Card1 /></>}
                            {/* <Card />
                            <Card /> */}
                            {/*<Card1 />*/}
                            {/*<Card1 />*/}
                            {/*<Card />*/}
                            {/*<Card />*/}
                            {/*<Card1 />*/}
                            {/*<Card1 />*/}
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketPlacePage;

const Card = () => {
    const history = useHistory();

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className="mx-auto rounded-xl overflow-hidden bg-sections-bslgray text-center mb-10">
                <div className="c-card-body">
                    {/* text content */}
                    {/* <h2 className='mt-2'>Stoned Ape Crew - Whitelist</h2>
                    <p className="pt-2 text-slate-400 text-xs">
                        Second generation SACs!
                    </p> */}
                    {/* <div className="seperator my-4"></div> */}
                    {/* image */}
                    <div className="image-box relative">
                        <img
                            onClick={() => {
                                history.push('/marketplace-details');
                            }}
                            src="./assets/market-place/image1.webp"
                            className="bg-img"
                        />


                        <div className="flex items-center justify-between py-1 px-3 text-xs absolute bottom-0 bg-slate-800/70 w-full">
                            <div className="flex flex-col">
                                <div className='text-lg'>Project Z</div>
                                <div className='italic text-base'>Whitelist</div>
                            </div>
                            <div className=" flex flex-col gap-3 py-2">
                                <img
                                    onClick={() => window.open('https://discord.com', "_blank")}
                                    src="./assets/icons/discord.png"
                                    className="w-4 cursor-pointer"
                                    alt=""
                                />
                                <img
                                    onClick={() => window.open('https://twitter.com/SOL_Decoder', "_blank")}
                                    src="./assets/icons/twitter.png"
                                    className="w-4 cursor-pointer"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="seperator my-4"></div> */}
                    <div className='card-body pb-3 px-4'>
                        <div className="c-table">
                            <div className="flex items-center justify-between py-1">
                                <div className="">Ticket price</div>
                                <div className='c-text-green-light'>8.50</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">
                                    $DECODE Spent
                                </div>
                                <div className='c-text-dark-blue'>750</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Winners</div>
                                <div className='c-text-green-light'>50</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Tickets Sold</div>
                                <div className='c-text-dark-blue'>94</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Your Tickets</div>
                                <div className='c-text-green-light'>3</div>
                            </div>
                        </div>



                        <div className='flex m-5 rounded-md overflow-hidden'>
                            <input type="number" id="quantity-input" name="quantity" min="1" max="10" className="bg-black/50 text-sm py-2 pl-4 " placeholder='1' />
                            {/* <div className="bg-slate-700/50 text-sm p-2 px-4 ">
                                1
                            </div> */}
                            <div className="bg-grad-green-blue text-base p-2 px-4 w-full">
                                Buy tickets
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Grid>
    );
};
const Card1 = () => {
    const history = useHistory();

    return (
        // <Grid item xs={12} sm={6} md={4} lg={3}>
        //     <div className="mx-auto rounded-lg bg-sections-bslgray text-center mb-10">
        //         <div className="c-card-body px-2">
        //             {/* text content */}
        //             <h2 className='mt-2'>Stoned Ape Crew</h2>
        //             <p className="pt-2 text-slate-400 text-xs">
        //                 Lorem ipsum, dolor sit amet consectetur
        //             </p>
        //             {/* <div className="seperator my-4"></div> */}
        //             {/* image */}
        //             <div className="flex mx-auto my-9">
        //                 <div className="image-box rounded-lg relative">
        //                     <img onClick={() => {
        //                         history.push('/marketplace-details');
        //                     }}
        //                         src="./assets/market-place/image1.webp"
        //                         className="bg-img"
        //                     />
        //                     <div className="absolute top-0 right-0 flex">
        //                         <div className="w-7 h-7 flex items-center justify-center mr-2 bg-slate-50/25 rounded-full">
        //                             <img
        //                                 onClick={() => window.open('https://twitter.com/SOL_Decoder', "_blank")}
        //                                 src="./assets/icons/twitter.png"
        //                                 className="w-5 cursor-pointer"
        //                                 alt=""
        //                             />
        //                         </div>

        //                         <div className="w-7 h-7 flex items-center justify-center bg-slate-50/25 rounded-full">
        //                             <img
        //                                 onClick={() => window.open('https://discord.com', "_blank")}
        //                                 src="./assets/icons/discord.png"
        //                                 className="w-5 cursor-pointer"
        //                                 alt=""
        //                             />
        //                         </div>
        //                     </div>

        //                     <div className="flex items-center justify-between py-1 px-2 text-xs absolute bottom-0 bg-slate-800/50 w-full">
        //                         <div className="flex items-center">
        //                             <div className="c-badge mr-2 bg-red-400"></div>
        //                             Closed
        //                         </div>
        //                         <div>Ended at 2022-05-20</div>
        //                     </div>
        //                 </div>
        //             </div>
        //             {/* <div className="seperator my-4"></div> */}

        //             <div className="c-table">
        //                 <div className="flex items-center justify-between py-1">
        //                     <div className="text-gray-400">Ticket price</div>
        //                     <div>$4.75</div>
        //                 </div>
        //                 <div className="flex items-center justify-between py-1">
        //                     <div className="text-gray-400">
        //                         WinnersTicket price
        //                     </div>
        //                     <div>16</div>
        //                 </div>
        //                 <div className="flex items-center justify-between py-1">
        //                     <div className="text-gray-400">Price</div>
        //                     <div>0</div>
        //                 </div>
        //                 <div className="flex items-center justify-between py-1">
        //                     <div className="text-gray-400">Your Tickets</div>
        //                     <div>3</div>
        //                 </div>
        //             </div>

        //             <div
        //                 onClick={() => {
        //                     history.push('/marketplace-details');
        //                 }}
        //                 className="my-5 p-2 px-5 winner-btn w-fit rounded-md mx-auto"
        //             >
        //                 View Winners
        //             </div>



        //         </div>
        //     </div>
        // </Grid>


        <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className="mx-auto rounded-xl overflow-hidden bg-sections-bslgray text-center mb-10">
                <div className="c-card-body">
                    {/* text content */}
                    {/* <h2 className='mt-2'>Stoned Ape Crew - Whitelist</h2>
                    <p className="pt-2 text-slate-400 text-xs">
                        Second generation SACs!
                    </p> */}
                    {/* <div className="seperator my-4"></div> */}
                    {/* image */}
                    <div className="image-box relative">
                        <img
                            onClick={() => {
                                history.push('/marketplace-details');
                            }}
                            src="./assets/market-place/image1.webp"
                            className="bg-img"
                        />


                        <div className="flex items-center justify-between py-1 px-3 text-xs absolute bottom-0 bg-slate-800/70 w-full">
                            <div className="flex flex-col">
                                <div className='text-lg'>Project Z</div>
                                <div className='italic text-base'>Whitelist</div>
                            </div>
                            <div className=" flex flex-col gap-3 py-2">
                                <img
                                    onClick={() => window.open('https://discord.com', "_blank")}
                                    src="./assets/icons/discord.png"
                                    className="w-4 cursor-pointer"
                                    alt=""
                                />
                                <img
                                    onClick={() => window.open('https://twitter.com/SOL_Decoder', "_blank")}
                                    src="./assets/icons/twitter.png"
                                    className="w-4 cursor-pointer"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="seperator my-4"></div> */}
                    <div className='card-body pb-3 px-4'>
                        <div className="c-table">
                            <div className="flex items-center justify-between py-1">
                                <div className="">Ticket price</div>
                                <div className='c-text-green-light'>8.50</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">
                                    $DECODE Spent
                                </div>
                                <div className='c-text-dark-blue'>750</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Winners</div>
                                <div className='c-text-green-light'>50</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Tickets Sold</div>
                                <div className='c-text-dark-blue'>94</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="">Your Tickets</div>
                                <div className='c-text-green-light'>3</div>
                            </div>
                        </div>



                        <div
                            onClick={() => {
                                history.push('/marketplace-details');
                            }}
                            className="my-5 p-2 px-5 winner-btn w-fit rounded-md mx-auto cursor-pointer"
                        >
                            View Winners
                        </div>
                    </div>


                </div>
            </div>
        </Grid>
    );
};
