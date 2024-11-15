import React from 'react'
import { IonLabel } from '@ionic/react'

function MarketPlaceDetailPage() {
  return (
    <div className=" mx-auto container mt-10">
      <div className="w-full flex xl:flex-row flex-col justify-evenly mt-5 px-5 lg:px-0">
        <div className="basis-2/5">
          <div className="left-content-wrapper px-3 mb-8">
            <img
              src="./assets/market-place/monkey.webp"
              className="bg-img rounded-xl mx-auto sm:max-w-sm max-w-xs"
            />

            <div className="text-wrapper xl:p-2 sm:px-8 px-3 ">
              <div className="py-3">
                <div className="text-xl my-2">Description</div>
                <p className="text-sm">
                  This statue is a 1/1 NFT made by Pompeizz to show some love to
                  the most inspiring project of the Solana blockchain, DeGods.
                </p>
              </div>

              {/* <div className='py-3'>
                <div className='text-xl my-2'>
                  How to cancel my bid?
                </div>
                <p className='text-sm'>
                  Every non-winning bid will be refunded after the auction has ended. However, you can cancel your bid at any time but you will be charged 0.033 SOL (PHBT).
                </p>
              </div> */}
            </div>
          </div>
        </div>
        <div className="basis-3/5">
          <div className="right-content-wrapper  px-3">
            <div className="flex w-full justify-between items-center p-2">
              <div className="text-2xl">Pompeizz 1/1</div>
              <div className="flex gap-3 mr-auto ml-5">
                <img
                  src="./assets/icons/discord.png"
                  className="w-5 h-4"
                  alt=""
                />
                <img
                  src="./assets/icons/discord.png"
                  className="w-5 h-4"
                  alt=""
                />
                <img
                  src="./assets/icons/discord.png"
                  className="w-5 h-4"
                  alt=""
                />
              </div>

              <a href="#" className="text-xl underline underline-offset-4">
                View tokens
              </a>
            </div>

            <div className="flex gap-2 text-center my-3">
              <div className="basis-1/2 p-3 py-4 c-block-bg rounded-md">
                Project
                <br />
                Pompeizz 1/1
              </div>
              <div className="basis-1/2 p-3 py-4 c-block-bg  rounded-md">
                Collection
                <br />
                <span className="text-xl">1500</span>
              </div>
            </div>
            <div className="flex gap-2 text-center my-3">
              <div className="basis-1/2 p-3 py-4 c-block-bg  rounded-md">
                Winners
                <br />
                <span className="text-xl">1</span>
              </div>
              <div className="basis-1/2  p-3 py-4 c-block-bg  rounded-md">
                NFTs
                <br />
                <span className="text-xl">1</span>
              </div>
            </div>
          

            <div className="p-7 c-block-bg rounded-md my-4">
              <div className="text-xl">Bid History</div>
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 relative">
                  <div className="flex col-span-2 sm:col-span-1">
                    TG41....UwQr
                  </div>
                  <div className="text-left sm:text-center">12 days ago</div>
                  <div className="text-right">450 $DUST</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 relative">
                  <div className="flex col-span-2 sm:col-span-1">
                    TG41....UwQr
                  </div>
                  <div className="text-left sm:text-center">10 days ago</div>
                  <div className="text-right">350 $DUST</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 relative">
                  <div className="flex col-span-2 sm:col-span-1">
                    TG41....UwQr
                  </div>
                  <div className="text-left sm:text-center">7 days ago</div>
                  <div className="text-right">250 $DUST</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 relative">
                  <div className="flex col-span-2 sm:col-span-1">
                    TG41....UwQr
                  </div>
                  <div className="text-left sm:text-center">1 days ago</div>
                  <div className="text-right">200 $DUST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <div className="p-3 py-7 c-block-bg text-center rounded-md my-4 text-red-600">
              <div className="text-lg">Closed!   Congrats to the winner</div>
          
              <div className="text-xl">TG41....UwQr won for 450 $DUST</div>
            </div>
    </div>
  )
}

export default MarketPlaceDetailPage
