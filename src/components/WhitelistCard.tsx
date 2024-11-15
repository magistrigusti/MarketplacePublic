import { css } from '@emotion/react';
import {IonButton, IonIcon, IonSpinner, useIonToast} from '@ionic/react';
import {useEffect, useState} from 'react';
import { useQueryClient } from 'react-query';
import { instance } from '../axios';
import { IWhitelist } from '../types/IWhitelist';
import isAxiosError from '../util/isAxiosError';
import TimeAgo from './TimeAgo';
import "./WhitelistCard.scss"
import ConfettiExplosion from 'react-confetti-explosion';
import {logoDiscord, logoTwitter} from 'ionicons/icons';
import MagicEden from '../../src/images/me-white.png'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useHistory } from 'react-router';
import { createOutline,trashOutline } from "ionicons/icons";
import { whiteListState } from '../redux/slices/whitelistSlice';
/**
 * The page they see when they are on /seamless, and browsing for whitelists etc..
 *
 * These are individual cards
 *
 * Parent is "WhitelistMarketplace.tsx"
 */

function WhitelistCard({
    image,
    max_users,
    twitter,
    discordInvite,
    sourceServer,
    targetServer,
    type,
    description,
    required_role_name,
    expiration_date,
    id,
    active,
    showLive,
    isExpired,
    claimed,
    claimCounts,
    claims,
    magicEdenUpvoteUrl,
    iMod,
    isExploding,
    setIsExploding,
    setSourceServerData,
    tabButton,
    deleteWhiteList,
    won,
    myLiveDAO,
    numOfElements,
    category
}: IWhitelist) {
    const history = useHistory()
	const isDemo:any = useSelector<RootState>(state => state.demo.demo);
	const [expired, setExpired] = useState<boolean | undefined>(undefined);
	const [claiming, setClaiming] = useState<boolean>(false);
    const [approving, setApproving] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const [present] = useIonToast();
    const isFcfs = type === 'fcfs';
    const isRaffle = type === 'raffle';
	const full = isFcfs ? claimCounts >= max_users : false;
    const uid  = localStorage.getItem('uid');

    const isEditWhitelist = useSelector( (state:RootState) => state.whiteList.isEditWhitelist );

    // what to show in each button
    const getClaimButtonText = (
        expired : boolean,
        claiming : boolean,
        claimed : boolean, // undefined...
        full : boolean,
        claims:any,
        showLive: any) => {

        if(claimed){
            return isFcfs ? 'Claimed' : 'Entered'
        }else if(expired){
            return "Already expired"
        }else if(full){
            return "Full"
        }else  if(claiming){
            return <IonSpinner />
        // }else if(claims[0] && claims[0].user && uid){
            // these should always match, so just returning it here. Query is on whitelistRouter.js.getQueryOptions()
            // if(claims[0].user.discordId === JSON.parse(uid)){
            //     return isFcfs ? 'Claimed' : 'Entered'
            // }else{
            //     return isFcfs ? 'Claimed' : 'Entered'
            // }
        }else {
            return isFcfs ? 'Obtain whitelist' : 'Enter raffle'
        }
    }

    const getApproveButtonText = (
        iMod : boolean,
        approving : boolean) => {

        if(approving){
            return <IonSpinner />;
        } else if(iMod){
            return 'Approve';
        } else {
            return 'Approved';
        }
    }

    // check whether current user won the whitelist in the raffle right after the event is expired
    useEffect(() => {
        const updateCardState = async () => {
            try {
                const {data: { won }} = await instance.post("/getRaffledState", {
                    whitelist_id : id,
                    type
                });

                if(won) {
                    setIsExploding && setIsExploding(true);
                    present({
                        message: `You've won a whitelist raffle. You are now whitelisted in ${sourceServer.name}`,
                        color: 'success',
                        duration: 10_000,
                    });
                }
            } catch {
            }
        }

        if(!expired && myLiveDAO && isRaffle) {
            updateCardState().catch(console.error);
        }
    }, [expired]);

    // for confetti
    // useEffect(() => {
    //     if(claimed && isFcfs) {
    //         setIsExploding && setIsExploding(true);
    //     } else if(won && isRaffle) {
    //         setIsExploding && setIsExploding(true);
    //         present({
    //             message: `You've won whitelist raffle. You are now whitelisted in ${sourceServer.name}`,
    //             color: 'success',
    //             duration: 10_000,
    //         });
    //     }
    // },[]);



    return (
		<div className="border-gray-500 border-[0.5px] rounded-2xl  overflow-clip">

            {/* for confetti */}
            {isExploding && claimed && isFcfs &&  <ConfettiExplosion />}

            <div className="relative overflow-y-hidden h-60 ">
                <img src={image} className="h-full w-full object-cover object-left" alt={`${sourceServer?.name} X ${targetServer?.name}`}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.style.opacity='0'
                 }} />
                 <div className='flex items-center justify-center mt-2 absolute top-1 right-2'>
                    {numOfElements && 
                    (<div className='inviteIconWrapper cursor-pointer' onClick={()=> setSourceServerData && setSourceServerData({id: sourceServer.id, category})}> 
                        <span className="hover:opacity-70"> {numOfElements} </span> 
                    </div>)}
                    {discordInvite && (<div className='inviteIconWrapper'> <a href={discordInvite} className="hover:opacity-70" target="_blank" > <IonIcon icon={logoDiscord} className=" " /> </a> </div>)}
                    {twitter && (<div className='inviteIconWrapper'> <a href={twitter} className="hover:opacity-70" target="_blank" > <IonIcon icon={logoTwitter} className="" /> </a> </div>)}
                    {magicEdenUpvoteUrl && (<div className='inviteIconWrapper'> <a href={magicEdenUpvoteUrl} className="hover:opacity-70" target="_blank" > <img src={MagicEden} className=" " /> </a> </div>)}
                </div>
                <div className="absolute flex bottom-0 right-0 justify-between bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 py-2 px-5 left-0">

                    <div className="w-full">
                        <p className="text-lg font-bold">{sourceServer?.name}</p>
                        <p className="text-xs italic">must be in "{targetServer?.name}" DAO</p>
                        <p className="text-xs italic"> Type: Whitelist </p>
                    </div>

                </div>
            </div>

            <div className="py-4 px-6 flex-col flex" >
                {(showMore ?
                    <span className='mb-3'>
                        {description}
                        {description?.length > 100 ? <span className="ml-2 text-sky-500 cursor-pointer" onClick={()=> setShowMore((n)=>!n)}>{showMore ? '(Less)'  : '(More)'}</span> : ''}
                    </span> :
                    <span className='mb-3'>
                        {description?.substring(0, 100)}
                        {description?.length > 100 ? <span className="ml-2 text-sky-500 cursor-pointer" onClick={()=> setShowMore((n)=>!n)}>{showMore ? '(Show Less)'  : '(Show More)'}</span> : ''}
                    </span>)
                }

                {numOfElements
                ? <div className="whitelistInfo grid grid-cols-2">
                    <p>Claimed </p>
                    <p>{claimed ? 'Yes' : 'No'}</p>
                </div>
                : <div className="whitelistInfo grid grid-cols-2">
                    <p>Type </p>
                    <p>{type.toUpperCase()}</p>

                    {  myLiveDAO ?
                        isFcfs ?
                        (<>
                            <p>Slots left </p>
                            <p>{(max_users - claimCounts) < 0 ? 0 : (max_users - claimCounts)}/{max_users}</p>
                        </>) :
                        expired ?
                        (<>
                            <p>Winners </p>
                            <p>{claimCounts<max_users ? claimCounts : max_users}</p>
                        </>) :
                        (<>
                            <p>Winning spots </p>
                            <p>{max_users}</p>
                            <p>Users entered </p>
                            <p>{claimCounts}</p>
                        </>) : ''
                    }

                    <p>Required Role (in "{targetServer?.name}" DAO)</p>
                    <p>{required_role_name}</p>
                    <p className="timeLeft" hidden={expired || expired === undefined}>Time left</p>
                    <div hidden={expired || expired === undefined}>
                        <TimeAgo setExpired={setExpired} date={expiration_date}/> 
                    </div>
                </div>}

                {!numOfElements && (tabButton === 'myDoa' || tabButton === 'live')  && isEditWhitelist  &&
                    <div className=' text-xl flex justify-center mt-5'>
                        <div className={`seamless-tab-btn-active-colored edit-btn w-50 h-10 `}  onClick={()=>{
                            history.replace({pathname:`seamlessdetail/${sourceServer?.discordGuildId}`,state:{id:id,editForm:true,discordGuildId:targetServer?.discordGuildId,sourceServer:sourceServer}})
                        }}>
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">EDIT</div>
                            <div className=" bg-black/[.4] py-2 px-4 c-res-bg-white"><IonIcon icon={createOutline}></IonIcon></div>
                        </div>
                        <div className={`seamless-tab-btn-active-colored danger-btn w-50 h-10 ml-3 `} onClick={()=>{
                            deleteWhiteList(id)
                        }}>
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">DELETE</div>
                            <div className=" bg-black/[.4] py-2 px-4 c-res-bg-white"><IonIcon icon={trashOutline}></IonIcon></div>
                        </div>
                    </div>
                }

                {/* button! */}
                {numOfElements
                ? <IonButton css={css`
                    --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
                    ${claimed ? 'opacity: 0.5;' : ''}
                `} className="my-2 self-center"
                    onClick={()=> setSourceServerData && setSourceServerData({id: sourceServer.id, category})}
                    // when you click the 
                    >
                        Expand
                </IonButton>
                : <>
                    {/* iMod reflects whether current user is Moderator. It is only set if current Seamless is very first created by the mint server */}
                    {/* When the Seamless is approved by the Mod, it is reset to false */}
                    {expired !== undefined && !iMod && myLiveDAO && <IonButton css={css`
                        --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
                        `} className="my-2 self-center"

                        // when you click the button!
                        onClick={async () => {
                            setClaiming(true);

                            try {

                                // submit form!
                                // await instance.post("/whitelistClaims", {
                                await instance.post("/createWhitelistClaims", {
                                    whitelist_id : id,
                                    type
                                });
                                setIsExploding&&setIsExploding(true)
                                queryClient.setQueryData(
                                    ['whitelistPartnerships'],
                                    (queryData) => (queryData as IWhitelist[]).map(
                                        (whitelist) => {
                                            if (whitelist.id === id) {
                                                whitelist.claimed = true;
                                                whitelist.claimCounts += 1
                                            }
                                            return whitelist;
                                        }
                                    )
                                );

                                // success!
                                if(isFcfs) {
                                    setIsExploding && setIsExploding(true);
                                }

                                const message = isFcfs ?
                                    `Whitelist claimed successfully! You are now whitelisted in ${sourceServer.name}` :
                                    `Entered whitelist raffle successfully! You are now waiting for the results in ${sourceServer.name}`;
                                present({
                                    message,
                                    color: 'success',
                                    duration: 10_000,
                                });

                            // if error!
                            } catch (error) {
                                console.error(error);

                                if(isAxiosError(error) && error.response?.data){
                                    present({
                                        message: error.response?.data.body,
                                        color: 'danger',
                                        duration: 5000,
                                    });
                                }
                                else {
                                    present({
                                        message: "Something went wrong",
                                        color: 'danger',
                                        duration: 5000,
                                    });
                                }
                            } finally {
                                setClaiming(false);
                            }
                        }}
                        disabled={ expired || claiming || claimed || full || showLive || isDemo||tabButton == 'live'}
                        >
                            {getClaimButtonText(expired,claiming,claimed, full, claims, showLive)}
                    </IonButton>
                    }
                    {(!expired && iMod || approving) && <IonButton css={css`
                        --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
                    `} className="my-2 self-center"
                        onClick={async () => {
                            setApproving(true);

                            try {
                                await instance.post(`/guilds/${sourceServer?.discordGuildId}/setInitiateApproved`, {});

                                // success!
                                present({
                                    message: 'Whitelist approved. This will be automatically approved later on',
                                    color: 'success',
                                    duration: 10000,
                                });

                                queryClient.setQueryData(
                                    ['whitelistPartnerships'],
                                    (queryData:any) => {
                                        return (queryData as IWhitelist[]).map(
                                            (whitelist) => {
                                                if (whitelist.sourceServer?.discordGuildId === sourceServer?.discordGuildId) {
                                                    whitelist.iMod = false;
                                                }
                                                return whitelist;
                                            }
                                        );
                                    }
                                );

                            // if error!
                            } catch (error) {
                                console.error(error);

                                if(isAxiosError(error) && error.response?.data){
                                    present({
                                        message: error.response?.data.body,
                                        color: 'danger',
                                        duration: 5000,
                                    });
                                }
                                else {
                                    present({
                                        message: "Something went wrong",
                                        color: 'danger',
                                        duration: 5000,
                                    });
                                }
                            } finally {
                                setApproving(false);
                            }
                        }}
                        >
                            {getApproveButtonText(iMod, approving)}
                    </IonButton>
                    }
                </>}
                
                {/* end button! */}

                {/* <IonButton css={css`
                --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
                `} className="my-2 self-center"
                onClick={()=>{
                    history.replace({pathname:`seamlessdetail/${sourceServer?.discordGuildId}`,state:{id:id,editForm:true,discordGuildId:targetServer?.discordGuildId}})
                }}
                >
                Edit WhiteList
                </IonButton>


                <IonButton css={css`
                --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%);
                `} className="my-2 self-center"
                onClick={()=>{
                    deleteWhiteList(id)
                }}
                >
                Delete WhiteList
                </IonButton> */}


            </div>

        </div>
    );
}

export default WhitelistCard;
