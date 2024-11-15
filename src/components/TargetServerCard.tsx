import { css } from '@emotion/react';
import { IonButton, IonIcon, IonSpinner, useIonToast } from '@ionic/react';
import {logoDiscord, logoTwitter} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import { useQueryClient } from 'react-query';
import { instance } from '../axios';
import { IWhitelist } from '../types/IWhitelist';
import isAxiosError from '../util/isAxiosError';
import TimeAgo from './TimeAgo';
import "./WhitelistCard.scss"
import {getUrlExtension, mediaTypes, urlRegExp} from '../util/getURLs';
import ReactMarkdown from "react-markdown";
// import parse from 'html-react-parser';
import reactStringReplace from 'react-string-replace';
import ConfettiExplosion from 'react-confetti-explosion';

/**
 * Sigh don't think this is used at all. . .
 */

const getButtonText = (expired : boolean, claiming : boolean, claimed : boolean, full : boolean) => {
	if(claimed){
		return "Claimed"
	}

	if(expired){
		return "Already expired"
	}
	if(full){
		return "Full"
	}
	if(claiming){
		return <IonSpinner />
	}
	return "Obtain whitelist"

}

function TargetServerCard({
    image,
    max_users,
    twitter,
    sourceServer,
    targetServer,
    type,
    description,
	required_role_name,
	expiration_date,
	id,
	claimed,
	claimCounts
}: IWhitelist) {

	// const [expired, setExpired] = useState<boolean | undefined>(undefined);
	// const [claiming, setClaiming] = useState<boolean>(false);
    //
	// const queryClient = useQueryClient();
    //
	// const [present] = useIonToast();
    //
	// const full = claimCounts >= max_users;
    //
    // const [isExploding, setIsExploding] = React.useState(false);
    //
    // // useEffect(() => {
    // //     setIsExploding(true);
    // // }, []);
    //
    // const whiteListClaiming = async() =>{
    //     try {
    //         await instance.post("/whitelistClaims", { whitelist_id : id });
    //         queryClient.setQueryData( ['whitelistPartnerships'], (queryData) => {
    //                 return (queryData as IWhitelist[]).map(
    //                     (whitelist) => {
    //                         if (whitelist.id === id) {
    //                             whitelist.claimed = true;
    //                             whitelist.claimCounts += 1
    //                         }
    //                         return whitelist;
    //                     }
    //                 );
    //             }
    //         );
    //
    //         setIsExploding(true);
    //
    //         present({
    //             message: 'Whitelist claimed successfully! You are now whitelisted in the other Discord',
    //             color: 'success',
    //             duration: 10000,
    //         });
    //
    //     } catch (error) {
    //         console.error(error);
    //
    //         if(isAxiosError(error) && error.response?.data){
    //             present({
    //                 message: error.response?.data.body,
    //                 color: 'danger',
    //                 duration: 5000,
    //             });
    //         }
    //         else {
    //             present({
    //                 message: "Something went wrong",
    //                 color: 'danger',
    //                 duration: 5000,
    //             });
    //         }
    //     }
    //     finally {
    //         setClaiming(false)
    //     }
    //
    // }
    //
    return (
    //

        <div className="border-gray-500 border-[0.5px] rounded-2xl  overflow-clip">

    {/*//*/}
    {/*//         {isExploding && <ConfettiExplosion />}*/}
    {/*//*/}
    {/*//         <div className="relative overflow-y-hidden h-60 w-80">*/}
    {/*//             <img*/}
    {/*//                 src={image}*/}
    {/*//                 className="h-full w-full object-cover object-left"*/}
    {/*//                 alt={`${sourceServer?.name} X ${targetServer?.name}`}*/}
    {/*//             />*/}
    {/*//             <div className="absolute flex bottom-0 right-0 justify-between bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50 py-2 px-5 left-0">*/}
    {/*//                 <div className="w-full">*/}
    {/*//                     <p className="font-bold text-lg">{sourceServer?.name}</p>*/}
    {/*//                     <p className="text-sm italic">*/}
    {/*//                         Whitelist*/}
    {/*//                     </p>*/}
    {/*//                 </div>*/}
    {/*//*/}
    {/*//                 /!*{discord && (*!/*/}
    {/*//                 /!*    <a*!/*/}
    {/*//                 /!*        href={discord}*!/*/}
    {/*//                 /!*        className="self-center hover:opacity-70"*!/*/}
    {/*//                 /!*        target="_blank"*!/*/}
    {/*//                 /!*    >*!/*/}
    {/*//                 /!*        <IonIcon icon={logoDiscord} className="h-5 w-5" />*!/*/}
    {/*//                 /!*    </a>*!/*/}
    {/*//                 /!*)}*!/*/}
    {/*//*/}
    {/*//                 {twitter && (*/}
    {/*//                     <a*/}
    {/*//                         href={twitter}*/}
    {/*//                         className="self-center hover:opacity-70"*/}
    {/*//                         target="_blank"*/}
    {/*//                     >*/}
    {/*//                         <IonIcon icon={logoTwitter} className="h-5 w-5" />*/}
    {/*//                     </a>*/}
    {/*//                 )}*/}
    {/*//             </div>*/}
    {/*//         </div>*/}
    {/*//*/}
    {/*//         <div*/}
    {/*//             className="py-4 px-6 flex-col flex"*/}
    {/*//         >*/}
    {/*//*/}
    {/*//             {description}*/}
    {/*//             /!*{*!/*/}
    {/*//             /!*    reactStringReplace(description, urlRegExp, (match: any, url: any) => (*!/*/}
    {/*//             /!*        <a href="${url}" class="underline cursor-pointer text-blue-300" target="_blank">${url.trim()}</a>;*!/*/}
    {/*//             /!*    ))*!/*/}
    {/*//             /!*}*!/*/}
    {/*//*/}
    {/*//             <br/>*/}
    {/*//*/}
    {/*//             <div className="whitelistInfo grid grid-cols-2">*/}
    {/*//                 <p>Type </p>*/}
    {/*//                 <p>{type.toUpperCase()}</p>*/}
    {/*//                 <p>Slots left </p>*/}
    {/*//                 <p>{max_users - claimCounts}/{max_users}</p>*/}
	{/*// 				<p>Required Role</p>*/}
	{/*// 				<p>{required_role_name}</p>*/}
	{/*// 				<p className="timeLeft">Time left</p>*/}
	{/*// 				<TimeAgo setExpired={setExpired} date={expiration_date}/>*/}
    {/*//             </div>*/}
    {/*//*/}
	{/*// 			{expired !== undefined && <IonButton css={css` --background: linear-gradient(93.86deg, #6FDDA9 0%, #6276DF 100%); `} className="my-2 self-center"*/}
    {/*//             onClick={() => {*/}
	{/*// 				setClaiming(true);*/}
    {/*//                 whiteListClaiming();*/}
	{/*// 			}} disabled={expired || claiming || claimed || full}>*/}
    {/*//                 {getButtonText(expired,claiming,claimed, full)}*/}
    {/*//                 </IonButton>}*/}
    {/*//         </div>*/}
        </div>
    );
}

export default TargetServerCard;
