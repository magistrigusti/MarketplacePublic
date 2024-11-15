import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import './Schedule.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPopover,  IonRippleEffect,  IonSearchbar,  IonToolbar, useIonToast } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
import { logoDiscord, logoTwitter, link, close } from 'ionicons/icons';

const CommonMintsData = (record1: any) => {
    const history = useHistory();

    let record:any = record1.record;

    const formatNumber = (n: any) => {
        if (n < 1e3) return n;
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
    };

    return (
            <>
            <div>
                 <div className="flex space-x-3">
                     {/*discord*/}
                     <a href={record?.discordLink} target="_blank" style={{ pointerEvents: (record?.discordLink && record?.numbersOfDiscordMembers) ? "initial" : "none" }} className={(record?.discordLink && record?.numbersOfDiscordMembers) ? "schedule-link" : "schedule-link-disabled"}>
                         <IonIcon icon={logoDiscord} className="big-emoji" />
                         <IonRippleEffect />
                     </a>
                     {/*twitter*/}
                     <a href={record?.twitterLink} className="schedule-link" target="_blank">
                         <IonIcon icon={logoTwitter} className="big-emoji" />
                         <IonRippleEffect />
                     </a>
                     {/* Link */}
                     <a href={record?.projectLink} className={(record?.projectLink && record?.projectLink) ? "schedule-link" : "schedule-link-disabled"} target="_blank">
                         <IonIcon icon={link} className="big-emoji" />
                         <IonRippleEffect />
                     </a>
                 </div>

                 {/*DATA REPEATED ON SCHEDULE.TSX AND CALENDAR.TSX*/}
                 <div>
                     { <><b>Name : </b> <img className={`avatarImg ${!record?.image ? 'hiddenImg' : ''}`} key={record?.image} src={record?.image} />{record?.project || record?.mintName }</> }

                     {record?.time && <span><br /><b>Time : </b> <span>{record?.updateTime || record?.time.replace('UTC', '')}<span hidden={record?.mintExpiresAt.indexOf('Invalid') !== -1}>{record?.mintExpiresAt}</span></span></span>}

                     {<div className='flex flex-row'><b>Price : </b> {record?.price ? record?.price :<div onClick={(e) => record?.wlPrice ? history.push( { pathname: '/foxtoken',search: record?.wlTokenAddress }) : '' } className={'flex flex-row ml-1 ' + (record?.wlPrice ? ' cursor-pointer underline' : '') } dangerouslySetInnerHTML={{__html: record?.wlPrice ? `${record?.price.replace(/public/gi, "<br>public").replace('SOL', '')} (<img src="/assets/icons/FoxTokenLogo.svg" class="h-5 pr-1 foxImg" /> ${record?.wlPrice}) ◎` : record?.price &&  `${record?.price?.replace(/public/gi, "<br>public").replace('SOL', '')} ◎`}}></div>}</div>}

                     {<span><b>Supply : </b>{record?.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>}

                     {<span><br /><b>Discord (all) : </b>{record?.numbersOfDiscordMembers ? formatNumber(record?.numbersOfDiscordMembers): '-'}</span>}

                     {<span><br /><b>Discord (online) : </b>{ record?.DiscordOnlineMembers ? formatNumber(record?.DiscordOnlineMembers) : '-'}</span>}

                     {<span><br /><b>Twitter : </b>{ record?.numbersOfTwitterFollowers ? formatNumber(record?.numbersOfTwitterFollowers) : '-'}</span>}

                     {<span><br /><b>Twitter Interaction : </b>{ record?.tweetInteraction?.total ? formatNumber(record?.tweetInteraction?.total) : '-'}</span>}
                 </div>
             </div>
            </>
    );
};

export default CommonMintsData;
