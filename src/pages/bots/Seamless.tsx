import React, {useEffect, useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonButton, IonGrid, IonRow, IonCol, IonCard,  IonText, IonCheckbox, useIonToast, IonInput,} from '@ionic/react';
import './ManageServer.scss';
import { useHistory, useParams } from 'react-router';
import Loader from '../../components/Loader';
import './SeamlessDetail.scss';
import { useQuery } from 'react-query';
import { setMultipleList } from '../../redux/slices/whitelistSlice';
import { useDispatch } from 'react-redux';
import BotServerCard from './components/BotServerCard';
import InfiniteScroll from "react-infinite-scroll-component";

/**
 * The page they see when they click "Initiate Seamless"
 *
 * This lists all of the discords we have. User has to click into one to proceed
 */

export interface selcetServer{
    id: string
    name: string
     discordGuildId:string
    }

const SeamlessDetail: React.FC<AppComponentProps> = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    const [present] = useIonToast();
    const { serverId } = useParams<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverList, setServerList] = useState<any>([]);
    const [multipleflag, setmultipleflag] = useState<boolean>(false)
    const [selectMultipleWhiteList, setSelectMultipleWhiteList] = useState<selcetServer[]>([])
    const [searchValue, setSearchValue] = useState<any>('');
    const [twitterSort, setTwitterSort] = useState<String>('');
    const [discordSort, setDiscordSort] = useState<String>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [sourceServerDetail, setSourceServerDetail] = useState<any>(null)
    const [rowsPerPage, setRowsPerPage] = useState(6)
    const [hasMore, setHasMore] = useState(true)



    // this loads up all the discords etc
    const { data: servers = [] } = useQuery<any>(  ['allServers'],
        async () => {
            setIsLoading(true)
            const { data: { guilds,sourceServer },  } = await instance.get(`/getAllGuildsData?guildId=${serverId}`);
            setSourceServerDetail(sourceServer)
            let tmpServerArr = []
            setIsLoading(false)
            for(let i=0; i<guilds.length;i++){
                if(guilds[i].id !== serverId ){
                    tmpServerArr.push(guilds[i])
                }
            }
            // setServerList(tmpServerArr);
            return tmpServerArr;
            // return guilds;
        }
    );

        // searching
    useEffect(() => {
        if(searchValue && servers){
            const filtered = servers.filter((server:any) => Object.values(server).some(val => typeof val === "string" && val.toLowerCase().includes(searchValue.toLowerCase())));
            setServerList(filtered)
        }else{
                setServerList(servers)
        }
    }, [searchValue,servers.length])

    // sorting by twitter
    useEffect(() => {
      if(twitterSort){
        const twitterSorting = [...servers].sort((a, b) =>twitterSort === 'twitter Up'? b.twitter_followers - a.twitter_followers:a.twitter_followers - b.twitter_followers);
        setServerList(twitterSorting)
      }
    }, [twitterSort,servers.length])
    // sorting by discord
    useEffect(() => {
      if(discordSort){
        const discordSorting = [...servers].sort((a, b) =>discordSort === 'discord Up'? b.discord_members - a.discord_members:a.discord_members - b.discord_members);
        setServerList(discordSorting)
      }
    }, [discordSort,servers.length])
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }
    }, [window.innerWidth])

    let fetchMoreData=()=>{
        if(serverList.slice(0,rowsPerPage).length>=serverList.length){
             setHasMore(false)
             return
         }
         setTimeout(() => {
             setRowsPerPage(old=>old+12)
         }, 100);
    }


    return (
        <div id="scrollableDiv" style={{ height: 'calc(100vh - 150px)', overflow: "auto" }}>
            <IonGrid>
                <IonRow>

                    {sourceServerDetail&&
                        <IonCol size="12">
                        <div className='server-module-bg p-4 px-6 w-full mb-5'>
                            {sourceServerDetail?.name}
                        </div>
                        </IonCol>
                    }

                    <IonCol size="12">
                        <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap items-center' } justify-between `}>
                            <div className={`${isMobile ? 'w-full' : 'w-3/4'} pb-3`}>
                                <h2 className="ion-no-margin font-bold text-xl"> Seamless - select a DAO to give whitelists to</h2>
                                <p className='ion-no-margin'>
                                    Select the server you wish to collaborate with in list below, and fill out the collaboration form on the next page.
                                    <br/><br/>
                                    Please make sure that you invited the correct SOL Decoder Bot to your server! You must use the SECOND link when on the <a href="https://soldecoder.app/dao" className="underline cursor-pointer">Select a Server</a> page.   After inviting this bot, make sure to drag the "SOL Decoder" role higher than your whitelist role.
                                </p>
                            </div>
                            <div className={`${isMobile ? 'mt-2' : ''}`}>
                                {!multipleflag &&

                                    <></>
                                    // TO.DO: ruchita !!! MULTI SELECT BROKE : messed up with no bot
                                // <div className={`seamless-tab-btn-active-colored w-40 h-10`} onClick={()=> {
                                //     setmultipleflag((n)=>!n);
                                //
                                //     present({
                                //         message: 'Click multiple checkboxes on the top left of each Discord. After you’ve chose them all, click Next on the very top right',
                                //         color: 'primary',
                                //         duration: 10000,
                                //     });
                                //
                                //     }}>
                                // Select Multiple
                                // </div>

                                }
                                {/*  */}
                                {multipleflag &&
                                <div className={`flex  ${isMobile ? 'justify-start' :' justify-between ml-2'}`}>
                                    <div className={`seamless-tab-btn-active w-32 h-10 mr-2`} onClick={()=> {
                                        setSelectMultipleWhiteList([])
                                        setmultipleflag((n)=>!n)
                                    }}> cancel </div>
                                    <div className={`seamless-tab-btn-active-colored w-32 h-10`} onClick={()=> {
                                        if(selectMultipleWhiteList.length===0){
                                            present({
                                                message: 'Please Select Atleast 1 server',
                                                color: 'danger',
                                                duration: 10000,
                                            });
                                            return
                                        }

                                        dispatch(setMultipleList(selectMultipleWhiteList))
                                        history.push({pathname:`/add_multiple_white_list`,state:serverId})
                                        setSelectMultipleWhiteList([])
                                        setmultipleflag((n)=>!n)

                                    }}> Next </div>
                                </div>
                                }
                            </div>
                        </div>

                    </IonCol>

                    <IonCol size="12" className='mt-4'>
                        <div className='flex flex-col'>
                            {/*<div className='text-xl'>Select a DAO to give whitelists to</div>*/}
                            <div className='flex  w-full items-center' style={{ justifyContent: isMobile ? 'flex-start'  : 'flex-end'}}>
                                <div className={`flex  ${isMobile ? 'flex-col  ' : 'flex-wrap'} `}>
                                    <IonInput
                                        value={searchValue}
                                        className=' border-2 mt-2 pl-2 w-full'
                                        onIonChange={(e) => { setSearchValue( e.detail.value) }}
                                        type="text"
                                        placeholder='Filter by DAO Name'>
                                    </IonInput>
                                    <div className={`flex flex-row ${isMobile ? 'mt-2 w-full justify-between' : 'mr-2'}`}>
                                        <div className='flex-row flex items-center cursor-pointer' onClick={()=>{
                                            setDiscordSort('')
                                            if(twitterSort === ''){
                                                setTwitterSort('twitter Up')
                                            }else if(twitterSort === 'twitter Up'){
                                                setTwitterSort('twitter Down')
                                            }else{
                                                setTwitterSort('twitter Up')
                                            }
                                        }}>
                                            <div className={`flex flex-col mr-2 ${isMobile ? '' :'ml-4'} `} >
                                                <button className={`${twitterSort === 'twitter Up' ? 'opacity-100':'opacity-30'}`}>▲</button>
                                                <button className={`${twitterSort === 'twitter Down' ? 'opacity-100':'opacity-30'}`}>▼</button>
                                            </div>
                                            <p>Twitter Followers</p>
                                        </div>
                                        <div className={`flex-row flex items-center cursor-pointer ${isMobile ? 'mr-2' : ''}`} onClick={()=>{
                                            setTwitterSort('')
                                            if(discordSort === ''){
                                                setDiscordSort('discord Up')
                                            }else if(discordSort === 'discord Up'){
                                                setDiscordSort('discord Down')
                                            }else{
                                                setDiscordSort('discord Up')
                                            }
                                        }}>
                                            <div className='flex flex-col mr-2 ml-4'>
                                                <button className={`${discordSort === 'discord Up' ? 'opacity-100':'opacity-30'}`}>▲</button>
                                                <button className={`${discordSort === 'discord Down' ? 'opacity-100':'opacity-30'}`}>▼</button>
                                            </div>
                                            <p>Discord Members</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </IonCol>



                <IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12"></IonCol>
                </IonRow>
                    {/*<IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12">*/}
                    {/*    <div className='font-bold text-xl'>Select a DAO to give whitelists to</div>*/}
                    {/*</IonCol>*/}


                            {isLoading ? <Loader/> :
                            <>
                            <InfiniteScroll
                                dataLength={serverList.slice(0,rowsPerPage).length}
                                next={()=>fetchMoreData()}
                                hasMore={hasMore}
                                loader={ serverList ?
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
                                <IonRow>
                                {serverList && serverList.slice(0 ,rowsPerPage).map((server: any,index:number)=>{
                                    let selectFlag = selectMultipleWhiteList.find(data=>data.id===server.id)
                                    server.selectFlag = selectFlag?true:false;
                                    return(
                                        <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" key={server.id} >
                                            <BotServerCard serverData={server} multipleflag={multipleflag} setSelectMultipleWhiteList={setSelectMultipleWhiteList} selectMultipleWhiteList={selectMultipleWhiteList} classes={`h-full ${server.selectFlag&&'activeCardWrapper'} semless-light-card` } />
                                        </IonCol>
                                    )
                                })}
                                </IonRow>
                            </InfiniteScroll>
                            </>}


            </IonGrid>
        </div>
    );
};
{/* // @ts-ignore */}
export default SeamlessDetail;
