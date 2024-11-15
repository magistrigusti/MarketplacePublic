import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import { constants } from "../../util/constants";
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist, sourceServerData } from '../../types/IWhitelist';
import usePersistentState from '../../hooks/usePersistentState';
import Loader from '../../components/Loader';
import {IonTitle, IonButtons, IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonModal, IonRow, IonSkeletonText, useIonToast, IonIcon, IonHeader, IonToolbar} from '@ionic/react';
import { logoTwitter, close } from "ionicons/icons";
import './SeamlessDetail.scss';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

/**
 * The page they see when they are on /seamless, and browsing for whitelists etc..
 */

interface modelType{
    show:boolean,
    id:string | null
}

function WhitelistMarketplace() {

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || '';
    // const discordId = params.get('state');
    let searchParam = window.location.search.slice(10,28);

    const [twitterId, setTwitterId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isTabButton, setIsTabButton] = useState<String>('myDoa');
    const [liveWhiteList,setLiveWhiteList] = useState<IWhitelist[][]>([]);
    const [expireWhiteList,setExpireWhiteList] = useState<IWhitelist[][]>([]);
    const [myDoaWhiteList,setMyDaoWhiteList] = useState<IWhitelist[][]>([]);
    const [myClaimWhiteList,setMyClaimWhiteList] = useState<IWhitelist[][]>([]);
    const [isExploding, setIsExploding] = useState<boolean>(false);
    const [modelConfirmation,setModelConfirmation ] = useState<modelType>({
        show:false,
        id:null
    });
    const [sourceServerData, setSourceServerData ] = useState<sourceServerData>({
        id: '',
        category: ''
    });
    const [modalWhitelist, setModalWhitelist] = useState<IWhitelist[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [hasMore, setHasMore] = useState(true)
    const [present] = useIonToast();
    const [mode] = usePersistentState("mode", "dark");

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    useEffect(() => {
        switch(sourceServerData.category) {
            case constants().whitelistGroupCategory.mydao:
                setModalWhitelist(myDoaWhiteList.find((arr) => arr[0].sourceServer.id === sourceServerData.id) || []);
                break;
            case constants().whitelistGroupCategory.live:
                setModalWhitelist(liveWhiteList.find((arr) => arr[0].sourceServer.id === sourceServerData.id) || []);
                break;
            case constants().whitelistGroupCategory.expired:
                setModalWhitelist(expireWhiteList.find((arr) => arr[0].sourceServer.id === sourceServerData.id) || []);
                break;
            case constants().whitelistGroupCategory.myclaim:
                setModalWhitelist(myClaimWhiteList.find((arr) => arr[0].sourceServer.id === sourceServerData.id) || []);
                break;
            default:
                setModalWhitelist([]);
        }        
    }, [sourceServerData]);

    const uid = localStorage.getItem('uid');
    let userId: string;
    useEffect(() => {
        if(uid) userId = uid;

        // if opened as a twitter login callback, store twitterId
        if(code?.length > 0) {
            instance
                .post(
                    '/twitter-auth-callback',
                    {code},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                .then(({ data }) => {
                    present({
                        message: data.message,
                        color: 'success',
                        duration: 10000,
                    });
                })
                .catch((e) => {
                    console.error(e);
                    present({
                        message: 'Twitter login failed',
                        color: 'error',
                        duration: 10000,
                    });
                })
        }

        // if already logged in twitter
        instance.get('/currentUser')
            .then(({data}) => {
                if(data.user.twitterId) {
                    setTwitterId(data.user.twitterId);
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    const server = localStorage.getItem('servers');
    const serverArray = server &&  JSON.parse(server);

    // get all your WL crap

    const { data: whitelists = [], refetch: getAllWhiteList   } = useQuery( ['whitelistPartnerships'],
        async () => {
                try {
                    setIsLoading(true);

                    const { data: whitelists } = await instance.post( `${searchParam ? `/getWhitelistPartnerships/me?isAdmin=true&sourceServer=${searchParam}` :'/getWhitelistPartnerships/me'}`,{servers: serverArray});

                    const whiteListExpire :any[] = [];
                    const whiteListLive: any[] = [];
                    const whiteListMyDao: any[] = [];
                    const whiteListMyClaim: any[] = [];

                    for (const whitelist of whitelists) {
                        if (whitelist.isExpired || !whitelist.active) { whiteListExpire.push(whitelist) }
                        else if (whitelist.myLiveDAO) { whiteListMyDao.push(whitelist) }
                        else whiteListLive.push(whitelist);

                        if (whitelist.claims?.some((cl: any) => cl.user?.discordId === userId)) whiteListMyClaim.push(whitelist);
                    }

                    setLiveWhiteList(getGroupFromList(whiteListLive));
                    setExpireWhiteList(getGroupFromList(whiteListExpire));
                    setMyDaoWhiteList(getGroupFromList(whiteListMyDao));
                    setMyClaimWhiteList(getGroupFromList(whiteListMyClaim));

                    return whitelists;
                } catch (error) {

                }
                finally {
                    setIsLoading(false)
                }
        }

    );


    let deleteWhiteList=async(id:string)=>{
        setModelConfirmation({...modelConfirmation,id:id,show:true})
    }

    let DeleteWhiteListHandler = async() =>{
        setIsLoading(true)
        try{
          let response =   await instance.delete( `/deleteWhitelistPartnership/${modelConfirmation.id}`)
          present({
            message: 'Whitelist details deleted sucessfully.',
            color: 'success',
            duration: 10000,
        });
          getAllWhiteList()
        }catch(error){


        }finally{
            setModelConfirmation({...modelConfirmation,show:false,id:null})
            setIsLoading(false)
        }
    }

    //  exploding hide on tab change
    useEffect(() => {
        isExploding&&setIsExploding(false)
        setRowsPerPage(8)
        setHasMore(true)

    }, [isTabButton])

    // 5 second after hide exploding
    useEffect(() => {
        isExploding&&setTimeout(() => {
            setIsExploding(false)
        }, 5000);
    }, [isExploding]);

    let fetchMoreData=(state:any)=>{
       if(state.slice(0,rowsPerPage).length>=state.length){
            setHasMore(false)
            return
        }
        setTimeout(() => {
            setRowsPerPage(old=>old+12)
        }, 100);
   	}

    const getGroupFromList = (lists: Array<IWhitelist>) => {
        const newList: any = {};
        for (const whitelist of lists) {
            if(whitelist.source_server in newList) {
                newList[whitelist.source_server].push(whitelist);
            } else {
                newList[whitelist.source_server] = [whitelist];
            }
        }
        const whitelistArray: Array<IWhitelist>[] = Object.values(newList);
        for (const arr of whitelistArray) {
            arr.sort((a, b) => a.expiration_date < b.expiration_date ? -1 : 1);
        }
        return whitelistArray;
    }

    return (

        <div id="scrollableDiv" style={{ height: 'calc(100vh - 150px)', overflow: "auto" }}>

            {/* introduction */}
            <div className="flex flex-row justify-center w-full mt-9">
                <div className="server-module-bg p-4 px-6 w-full">
                    <div className='w-full  items-center  mb-0'>
                        <div className='text-xl font-semibold mb-1'>Welcome to Seamless! SOL Decoder's next joint venture with Communi3</div>

                        <ul>
                            <li>- <b>New mint giving spots?</b> Pay only a portion of your whitelist to Communi3, SOL Decoder, and partnered top DAOs.&nbsp;
                                <a href="https://discord.gg/s4ne34TrUC" target="_blank" className="underline cursor-pointer font-bold">Join our Discord</a>&nbsp;
                                and we'll walk you through the process. And read more&nbsp;
                                <a className='cursor-pointer underline font-bold' href=' https://docs.soldecoder.app/books/intro/page/seamless'>instructions about it here</a>.
                            </li>

                            <li>- <b>Existing DAO wanting to get spots?</b> It's free, and no bots need to be added to your server -&nbsp;
                                <a className='cursor-pointer underline font-bold' href='/dao'>click here to set it up</a>,
                                and read more&nbsp;
                                <a className='cursor-pointer underline font-bold' href=' https://docs.soldecoder.app/books/intro/page/seamless#bkmrk-existing-dao'>instructions about it here</a>.
                                Afterwards, any mint using Seamless already can give you spots in {'<'} a minute. Mints not using Seamless can get onboarded with Seamless very quickly, then give you spots</li>

                            {/*<li>- Want to learn more? <a className="underline cursor-pointer font-bold" href="https://medium.com/@sol-decoder/sol-decoder-presents-seamless-32251a4deb43" target="_blank">*/}
                            {/*    Read our Medium article here</a>*/}
                            {/*</li>*/}
                        </ul>

                        {/* show twitter login button only when never logged in yet */}
                        <div hidden={code?.length > 0 || twitterId?.length > 0}>
                            <br/>
                            <IonButton className='mb-0 h-11' color={ mode === 'dark' ? '' : "dark"}
                                onClick={() => {
                                    instance
                                        .post(
                                            '/twitter-auth-url',
                                            {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            }
                                        )
                                        .then(({ data }) => {
                                            window.location.href = data.authUrl;
                                        })
                                        .catch((e) => {
                                            console.error(e);
                                            present({
                                                message: 'Twitter login failed',
                                                color: 'error',
                                                duration: 10000,
                                            });
                                        })
                                }} >
                                <IonIcon icon={logoTwitter} className="big-emoji mr-3"/> Login with Twitter
                            </IonButton>
                        </div>

                    </div>
                </div>
            </div>

            {/* if whitelists avail. */}
            {whitelists && whitelists.length > 0 ?
                <div>
                    {/* tabs on the top (Live vs Expired) */}
                    <div className=' text-xl flex justify-center mt-5'>
                        <div className={`${isTabButton === 'myDoa' ? 'seamless-tab-btn-active-colored' : 'seamless-tab-btn-deactive ' } w-50 h-10 `} onClick={()=>setIsTabButton('myDoa')}>
                            {/* <p>Live - My DAOs ({myDoaWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">{isMobile ? 'Mine' : 'Live - My DAOs'}</div>
                            <div className=" bg-black/[.4] py-2 px-4 c-res-bg-white">{myDoaWhiteList?.length}</div>

                        </div>
                        <div className={`${isTabButton === 'live' ? 'seamless-tab-btn-active-colored' : 'seamless-tab-btn-deactive' } ml-2 w-46 h-10 `} onClick={()=>setIsTabButton('live')}>
                            {/* <p>Live ({liveWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">{isMobile ? 'Others' : 'Live - Other DAOs'}</div>
                            <div className=" bg-black/[.4] py-2 px-4 c-res-bg-white">{liveWhiteList?.length}</div>
                        </div>
                        <div className={`${isTabButton === 'expire' ? 'seamless-tab-btn-active-colored' : 'seamless-tab-btn-deactive'} ml-2 w-32 h-10`}onClick={()=>setIsTabButton('expire')}>
                            {/* <p>Expired ({expireWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">{isMobile ? 'Expired' : 'Expired'}</div>
                            <div className=" bg-black/[.4] py-2 px-4 c-res-bg-white">{expireWhiteList?.length}</div>
                        </div>
                    </div>

                    {/* expire */}
                    {/*{isTabButton === 'expire' ||  isTabButton === 'myClaim' ?*/}
                    {/*    <div className='flex justify-center mt-4'>*/}
                    {/*        <div className={`${isTabButton === 'myClaim' ? 'seamless-tab-btn-active-colored' : 'seamless-tab-btn-deactive'} ml-2 w-60 h-10 text-xl `} onClick={()=>setIsTabButton('myClaim')}>*/}
                    {/*            /!*  <p>View my claim mints ({myClaimWhiteList?.length})</p>  *!/*/}
                    {/*            /!* <div className="text-sm md:text-base p-2 md:px-4 w-full">View My Claimed Mints</div> *!/*/}
                    {/*            <div className="text-sm md:text-base p-2 w-full">View My Claimed Mints</div>*/}
                    {/*        <div className=" bg-black/[.4] py-2 px-4 ">{myClaimWhiteList?.length}</div>*/}
                    {/*        </div>*/}
                    {/*    </div> :  ''*/}
                    {/*}*/}

                    <div >
                    {/* my DAO live */}
                        {isTabButton === 'myDoa' &&
                                <InfiniteScroll
                                    dataLength={myDoaWhiteList.slice(0,rowsPerPage).length}
                                    next={()=>fetchMoreData(myDoaWhiteList)}
                                    hasMore={hasMore}
                                    loader={ myDoaWhiteList.length > 0 ?
                                        <div className='mb-5 flex justify-center'>
                                            <Loader/>
                                        </div> : ''
                                        }
                                    scrollableTarget="scrollableDiv"
                                    endMessage={
                                        <p style={{ textAlign: "center" }}>
                                        <b>You've reached the end of the whitelists</b>
                                        </p>
                                    }
                                >
                                    <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6 p-8">
                                    {
                                        myDoaWhiteList.length > 0 ? myDoaWhiteList.slice(0 ,rowsPerPage).map((whitelistArray:any) => {
                                            return whitelistArray.length>1
                                                ? (<WhitelistCard {...whitelistArray[0]} numOfElements={whitelistArray.length} claimed={whitelistArray.some((wl:IWhitelist) => wl.claimed)} setSourceServerData={setSourceServerData} category={constants().whitelistGroupCategory.mydao} tabButton={isTabButton} key={whitelistArray[0].sourceServer.id} deleteWhiteList={deleteWhiteList} />)
                                                : (<WhitelistCard {...whitelistArray[0]} isExploding={isExploding} setIsExploding={setIsExploding} tabButton={isTabButton} key={whitelistArray[0].id} deleteWhiteList={deleteWhiteList} />)
                                        }) : <div className='text-xl'> There are no whitelists available</div>
                                    }
                                   </div>
                                </InfiniteScroll>
                        }

                        {/* live */}
                        {isTabButton === 'live' &&
                                <InfiniteScroll
                                    dataLength={liveWhiteList.slice(0,rowsPerPage).length}
                                    next={()=>fetchMoreData(liveWhiteList)}
                                    hasMore={hasMore}
                                    loader={  liveWhiteList.length > 0 ?
                                        <div className='mb-5 flex justify-center'>
                                           <Loader/>
                                        </div>  : ''
                                        }
                                    scrollableTarget="scrollableDiv"
                                    endMessage={
                                        <p style={{ textAlign: "center" }}>
                                        <b>You've reached the end of the whitelists</b>
                                        </p>
                                    }
                                >
                                    <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                                        {
                                            // liveWhiteList.length > 0 ? liveWhiteList.slice(0 ,rowsPerPage).map((whitelist:any) =>{
                                            //     return (<WhitelistCard {...whitelist} isExploding={isExploding} setIsExploding={setIsExploding}  tabButton={isTabButton} key={whitelist.id} deleteWhiteList={deleteWhiteList} />)
                                            // }): <div className='text-xl'> There are no whitelists available</div>
                                            liveWhiteList.length > 0 ? liveWhiteList.slice(0 ,rowsPerPage).map((whitelistArray:any) => {
                                                return whitelistArray.length>1
                                                    ? (<WhitelistCard {...whitelistArray[0]} numOfElements={whitelistArray.length} setSourceServerData={setSourceServerData} category={constants().whitelistGroupCategory.live} tabButton={isTabButton} key={whitelistArray[0].sourceServer.id} deleteWhiteList={deleteWhiteList} />)
                                                    : (<WhitelistCard {...whitelistArray[0]} isExploding={isExploding} setIsExploding={setIsExploding} tabButton={isTabButton} key={whitelistArray[0].id} deleteWhiteList={deleteWhiteList} />)
                                            }) : <div className='text-xl'> There are no whitelists available</div>
                                        }
                                    </div>
                            </InfiniteScroll>
                        }

                        {/* expire */}
                        {isTabButton === 'expire' &&
                        <InfiniteScroll
                            dataLength={expireWhiteList.slice(0,rowsPerPage).length}
                            next={()=>fetchMoreData(expireWhiteList)}
                            hasMore={hasMore}
                            loader={ expireWhiteList.length > 0 ?
                                <div className='mb-5 flex justify-center'>
                                    <Loader/>
                                </div> :''
                                }
                            scrollableTarget="scrollableDiv"
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                <b>You've reached the end of the whitelists</b>
                                </p>
                            }
                        >
                            <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                                {
                                    expireWhiteList.length > 0 ? expireWhiteList.slice(0 ,rowsPerPage).map((whitelistArray:any) => {
                                        return whitelistArray.length>1
                                            ? (<WhitelistCard {...whitelistArray[0]} numOfElements={whitelistArray.length} setSourceServerData={setSourceServerData} category={constants().whitelistGroupCategory.expired} tabButton={isTabButton} key={whitelistArray[0].sourceServer.id} deleteWhiteList={deleteWhiteList} />)
                                            : (<WhitelistCard {...whitelistArray[0]} isExploding={isExploding} setIsExploding={setIsExploding} tabButton={isTabButton} key={whitelistArray[0].id} deleteWhiteList={deleteWhiteList} />)
                                    }) : <div className='text-xl'> There are no whitelists available</div>
                                }
                            </div>
                        </InfiniteScroll>
                        }

                        {/* myClaim */}
                        {isTabButton === 'myClaim' &&
                        <InfiniteScroll
                            dataLength={myClaimWhiteList.slice(0,rowsPerPage).length}
                            next={()=>fetchMoreData(myClaimWhiteList)}
                            hasMore={hasMore}
                            loader={ myClaimWhiteList.length > 0 ?
                                <div className='mb-5 flex justify-center'>
                                    <Loader/>
                                </div> :''
                                }
                            scrollableTarget="scrollableDiv"
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                <b>You've reached the end of the whitelists</b>
                                </p>
                            }
                        >
                            <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                                {
                                    myClaimWhiteList.length > 0 ? myClaimWhiteList.slice(0 ,rowsPerPage).map((whitelistArray:any) => {
                                        return whitelistArray.length>1
                                            ? (<WhitelistCard {...whitelistArray[0]} numOfElements={whitelistArray.length} setSourceServerData={setSourceServerData} category={constants().whitelistGroupCategory.myclaim} tabButton={isTabButton} key={whitelistArray[0].sourceServer.id} deleteWhiteList={deleteWhiteList} />)
                                            : (<WhitelistCard {...whitelistArray[0]} isExploding={isExploding} setIsExploding={setIsExploding} tabButton={isTabButton} key={whitelistArray[0].id} deleteWhiteList={deleteWhiteList} />)
                                    }) : <div className='text-xl'> There are no whitelists available</div>
                                }
                            </div>
                        </InfiniteScroll>
                        }
                        {/*  */}
                    </div>


                    {/* no whitelists */}
                    <div className={(whitelists?.length < 1 && !isLoading) ? "flex items-center justify-between w-full" : 'flex items-center justify-end w-full'}>
                        {whitelists?.length < 1 && !isLoading && <div className='flex  w-full justify-center align-text-bottom ml-2 mr-2'>
                            <IonLabel className='text-red-500 text-2xl w-full text-center'>No active whitelists are open. Please check back later!</IonLabel>
                        </div>}
                    </div>
                </div>

                // if loading
            :   <>{ isLoading ? <div className='flex justify-center'> <Loader /> </div>
                    // no whitelists
                     : <div className='text-center text-xl mt-6'>There are no whitelists available</div> }
                </> }

            <IonModal isOpen={modelConfirmation.show} onDidDismiss={() => setModelConfirmation({...modelConfirmation,show:false,id:null})} cssClass={isMobile ? 'logout-modal-mobile' :'logout-modal-web'} >
                <IonContent className="flex items-center" scroll-y="false">
                    <div className='text-xl font-bold text-center w-full mt-5'>
                        Confirm !
                    </div>
                    <div className=' text-center w-full mt-8'>
                        Are you sure want to delete this whitelist ?
                    </div>
                    <div className="flex flex-row mt-10">
                        <IonButton onClick={() => DeleteWhiteListHandler()} color="primary" className="px-2 mx-0 w-full"> Delete </IonButton>
                        <IonButton onClick={() => setModelConfirmation({...modelConfirmation,show:false,id:null})} color="medium" className="px-2 mx-0 w-full"> Cancel </IonButton>
                    </div>
                </IonContent>
            </IonModal>

            <IonModal isOpen={modalWhitelist.length>0} onDidDismiss={() => setSourceServerData({id: '', category:''})} >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            {modalWhitelist[0] && <span className='text-xl font-semibold mb-1'>Whitelists for "{modalWhitelist[0].sourceServer?.name}"</span>}
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => setSourceServerData({id: '', category:''})}>
                                <IonIcon icon={close} className="h-6 w-6"/>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="flex items-center">
                    <div id="scrollableDiv" style={{ height: '100%', overflow: "auto" }}>                            
                        <InfiniteScroll
                            dataLength={modalWhitelist.slice(0,rowsPerPage).length}
                            next={()=>fetchMoreData(modalWhitelist)}
                            hasMore={hasMore}
                            loader={ modalWhitelist.length > 0 ?
                                <div className='mb-5 flex justify-center'>
                                    <Loader/>
                                </div> : ''
                                }
                            scrollableTarget="scrollableDiv"
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                <b>You've reached the end of the whitelists</b>
                                </p>
                            }
                        >
                            <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-6 p-8">
                            {
                                modalWhitelist.length > 0 ? modalWhitelist.slice(0 ,rowsPerPage).map((whitelist:any) => {
                                    return (<WhitelistCard {...whitelist} isExploding={isExploding} setIsExploding={setIsExploding} tabButton={isTabButton} key={whitelist.id} />)
                                }) : <div className='text-xl'> There are no whitelists available</div>
                            }
                            </div>
                        </InfiniteScroll>
                    </div>
                </IonContent>
            </IonModal>
        </div>
    );

}

export default WhitelistMarketplace;
