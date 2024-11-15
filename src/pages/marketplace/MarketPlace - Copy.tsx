import { IonLabel } from '@ionic/react';
import { Grid, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import './MarketPlace.scss';

function MarketPlace() {
    
    return (
        <div className="market-wrapper">
            <div className="flex justify-center mt-6">
                <IonLabel className="text-4xl font-bold">Market Place</IonLabel>
            </div>
            <div className="flex justify-center mt-6 flex-row ">
                <button
                    className="w-32 mr-2 mt-2 sm:mt-5 text-base  px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize focus:outline-none transition duration-300 transform active:scale-95 ease-in-out tab-btn flex justify-center items-center"
                >
                    Live
                    <div className='c-badge px-2 pt-0.5 rounded-full ml-2 text-sm'>3</div>
                </button>
                <button
                    className="w-32 ml-2 mt-2 sm:mt-5 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize focus:outline-none transition duration-300 transform active:scale-95 ease-in-out tab-btn flex justify-center items-center"
                >
                    Close
                    <div className='c-badge px-2 pt-0.5 rounded-full ml-2 text-sm'>100</div>

                </button>
            </div>
            <div className="flex justify-center m-10">
                <div className="justify-center w-full flex flex-col">
                    <div className="flex  sm:flex-row justify-center flex-wrap">
                        <Grid
                            container
                            spacing={4}
                            className="flex justify-self-center"
                        >
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketPlace;
const Card = () => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <div className="mx-auto rounded-lg bg-sections-bslgray text-center mb-10">
                
                <div className="c-card-body px-2">
                    {/* text content */}
                    <h2>Stoned Ape Crew</h2>
                    <p className="pt-2 sub-text">
                        Lorem ipsum, dolor sit amet consectetur
                    </p>
                    <div className="seperator my-4"></div>
                    {/* image */}
                <div className="flex mx-auto mb-4">
                    <div className="image-box rounded-lg relative">
                        <img src="./assets/market-place/image1.webp" className='bg-img' />
                        <div className='absolute top-1 right-0'>
                            <div className='w-7 h-7 flex items-center justify-center mb-2 bg-slate-50/25 rounded-full'>
                                <img src="./assets/icons/twitter.png" className='w-5' alt="" />
                            </div>

                            <div className='w-7 h-7 flex items-center justify-center mb-2 bg-slate-50/25 rounded-full'>
                                <img src="./assets/icons/discord.png" className='w-5' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="c-table">
                        <div className="flex items-center justify-between py-1">
                            <div className='flex items-center'>
                                <div className="c-badge mr-2"></div>
                                Live
                            </div>
                            <div>Ends in 2h</div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="text-gray-400">
                                Ticket price
                            </div>
                            <div>$4.75</div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="text-gray-400">
                                WinnersTicket price
                            </div>
                            <div>16</div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="text-gray-400">Price</div>
                            <div>0</div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <div className="text-gray-400">
                                Your Tickets
                            </div>
                            <div>3</div>
                        </div>
                    </div>

                    <div className="mb-3 mt-5 p-2 px-5 winner-btn w-fit rounded-md mx-auto">
                        View Winners
                    </div>
                </div>
            </div>
        </Grid>
    );
};


