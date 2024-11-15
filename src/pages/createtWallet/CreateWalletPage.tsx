import { Grid } from '@material-ui/core'
import React from 'react'

function CreateWalletPage() {
  return (
    <>
      <div className='px-3 mx-auto'>

        <div className='flex justify-between p-2 w-full items-center px-4'>
          <div className='md:text-4xl text-2xl font-semibold'>
            Stacking
          </div>
          <div>
            <button
              className="w-max mx-auto text-base items-center md:px-10 px-5 md:py-2 py-1 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out bg-grad-green-blue rounded-xl"
            >
              FB4X....TAg8
            </button>

          </div>
        </div>

        <div className="flex justify-center w-full lg:flex-row flex-col">
          {/* 1 */}
          <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
            <div className="text-2xl md:text-4xl c-text-ochre py-1 lg:py-4">
              $1,420,069
            </div>
            <div className="text-sm md:text-base  c-sub-text">
              Minimum Value Locked
            </div>
          </div>

          {/* 2 */}
          <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
            <div className="text-2xl md:text-4xl c-text-pink py-1 lg:py-4">
              6669
            </div>
            <div className="text-sm md:text-base c-sub-text">
              Total SOL Decoders Staked
            </div>
          </div>

          {/* 3 */}
          <div className="basis-1/3 rounded-lg m-3 lg:m-4 p-5 bg-sections-bslgray relative text-center">
            <div className="text-2xl md:text-4xl c-text-sky-blue py-1 lg:py-4">
              95%
            </div>
            <div className="text-sm md:text-base c-sub-text">
              of SOL Decoder Staked
            </div>
          </div>
          {/*  */}
        </div>


        <div className="flex justify-center w-full md:flex-row flex-col">

          {/* 1 */}
          <div className="basis-1/4 lg:basis-1/2 rounded-lg m-3 lg:m-4 p-3 bg-sections-bslgray relative text-center">
            <div className="text-xl lg:text-3xl c-text-green py-2">
              260 $DECODE
            </div>
            <div className="text-sm lg:text-base c-sub-text">
              Accumulated $DECODE
            </div>
          </div>

          {/* 2 */}
          <div className="basis-1/4 lg:basis-1/2 rounded-lg m-3 lg:m-4 p-3 bg-sections-bslgray relative text-center">
            <div className="text-xl lg:text-3xl c-text-green py-2">
              20 $DECODE
            </div>
            <div className="text-sm lg:text-base c-sub-text">
              Daily rewards
            </div>
          </div>

          {/* 3 */}
          <div className="basis-1/4 lg:basis-1/2 rounded-lg m-3 lg:m-4 p-3 bg-sections-bslgray relative text-center">
            <div className="text-xl lg:text-3xl c-text-green py-2">
              5
            </div>
            <div className="text-sm lg:text-base c-sub-text">
              Staked SOL Decoders
            </div>
          </div>

          {/* 4 */}
          <div className="basis-1/4 rounded-lg m-3 lg:m-4 p-3 flex items-center justify-center">
            <button
              className="w-max mx-auto text-base items-center px-5 md:py-2 py-1 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out bg-grad-green-blue rounded-xl"
            >
              Claim $DECODE
            </button>
          </div>

        </div>

        <div className='flex justify-between w-full lg:flex-row flex-col p-4 mt-4 gap-10'>
          <div className='basis-3/6'>
            <div className='left-stake-header flex justify-between items-center mb-5'>
              <div className='md:text-2xl text-lg text-white font-semibold'>Unstaked SOL Decoders</div>
              <div className='grad-border-blue-green whitespace-nowrap cursor-pointer'>
                Stake all
              </div>
            </div>

            <Grid container
              spacing={4}
              className="flex justify-self-center items-center mx-auto">
              <Grid item xs={12} sm={6} md={6} xl={4}>
                <div className='card-wrapper overflow-hidden rounded-xl'>
                  <div className="flex flex-row justify-center w-full">
                    <div className='card-img flex justify-center items-center w-full'>
                      <img src={require('../../images/staking.png')} />
                    </div>
                  </div>

                  <div className='flex justify-between mt-5 mb-2 items-center px-5'>
                    <div>
                      <span className='font-semibold'>ID: </span><span>2256</span>
                    </div>
                    <div>
                      <span className='font-semibold'>RANK: </span><span>3722</span>
                    </div>
                  </div>

                  <div className='mx-auto mb-6 px-3 flex justify-center items-center'>

                    <button
                      className="text-base items-center px-8 py-1 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out bg-grad-green-blue rounded-xl whitespace-nowrap"
                    >
                      Stake
                    </button>
                  </div>
                </div>

              </Grid>
            </Grid>


          </div>
          <div className='basis-3/6'>
            <div className='left-stake-header flex justify-between items-center mb-5'>
              <div className='md:text-2xl text-lg text-white font-semibold'>Staked SOL Decoders</div>
              <div className='grad-border-blue-green whitespace-nowrap cursor-pointer'>
                Unstake all
              </div>
            </div>

            <Grid container
              spacing={4}
              className="flex justify-self-center items-center mx-auto">
              <Grid item xs={12} sm={6} md={6} xl={4}>
                <div className='card-wrapper overflow-hidden rounded-xl'>
                  <div className="flex flex-row justify-center w-full">
                    <div className='card-img flex justify-center items-center w-full'>
                      <img src={require('../../images/me.png')} />
                    </div>
                  </div>

                  <div className='flex justify-between mt-5 mb-2 items-center px-5'>
                    <div>
                      <span className='font-semibold'>ID: </span><span>2256</span>
                    </div>
                    <div>
                      <span className='font-semibold'>RANK: </span><span>3722</span>
                    </div>
                  </div>

                  <div className='mx-auto mb-6 px-3 flex justify-center items-center'>

                    <button
                      className="text-base items-center px-8 py-1 tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out grad-border-blue-green-unstake rounded-xl whitespace-nowrap"
                    >
                      Unstake
                    </button>
                  </div>
                </div>

              </Grid>
            </Grid>

          </div>
        </div>


        {/* <div className='w-full flex xl:flex-row flex-col justify-evenly mt-20 px-5 lg:px-0'>
          <div className='basis-1/2 mt-2'>
            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Your Wallet</div>
              <div className="text-2xl bsl-green-gradient mt-2">FB4X....TAg8</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">SOL Decoders staked</div>
              <div className="text-2xl bsl-blue-gradient mt-2">1</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Estimated Rewards</div>
              <div className="text-2xl bsl-red-gradient mt-2">20 $DECODE</div>
            </div>

            <div className="max-w-sm h-30 rounded-lg mx-auto mb-10 p-4 bg-sections-bslgray relative text-center ">
              <div className="text-lg">Reward Date</div>
              <div className="text-2xl bsl-blue-gradient mt-2">20 $DECODE/day</div>
            </div>
          </div>
          <div className='basis-1/2'>

            <div className="max-w-sm h-30 rounded-lg mx-auto p-4 bg-sections-bslgray relative text-center ">
              <div className="pt-2 text-xl">Your Wallet</div>
              <div className="mt-4 text-md">You have no SOL Decoders in your wallet</div>

              <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn-second">
                STAKE ALL
              </button>

            </div>

            <div className='mx-aut0 my-5 flex justify-center'>
              <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn-second">
                UNSTAKE ALL
              </button>
              <button className="mx-2 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn">
                CLAIM $DECODE
              </button>
            </div>




            <div className='w-full text-center my-3 text-xl'>Staked SOL Decoders</div>

            <div className="w-72 card pb-4 rounded-2xl mx-auto">
              <div className='image-wrapper rounded-tl-2xl rounded-tr-2xl'>
                <img src="./assets/market-place/nft.png" alt="" />
              </div>


              <div className='w-full card-content px-4'>

                <div className='flex justify-evenly my-5 items-center'>
                  <div className='flex flex-col items-center'>
                    <div>ID</div>
                    <div>2256</div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div>RANK</div>
                    <div>3722</div>
                  </div>
                </div>

                <div className='flex w-full rounded-lg border-2 text-center border-rose-600 '>
                  <button className='p-2 text-center w-full'>UNSTAKE</button>
                </div>

              </div>

            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default CreateWalletPage
