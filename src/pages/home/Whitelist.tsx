import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import { IonIcon, useIonToast } from "@ionic/react";
import {checkmarkCircleOutline, closeCircleOutline, helpOutline} from 'ionicons/icons';
import {Link, useLocation} from 'react-router-dom';
import Help from '../../components/Help';
import {useState} from 'react';

const Whitelist = () => {

//     const [present,dismiss] = useIonToast();
//
//     const [didAllSteps, setDidAllSteps] = useState(false);
//
//     // Convert camelCase string to Title Case (e.g performedSearch -> Performed Search)
//     const convertWordCase = (word: string): string => {
//         const replaced = word.replace(/([A-Z])/g, " $1");
//         return replaced.charAt(0).toUpperCase() + replaced.slice(1);
//     }
//
//     /**
//      * Functions
//      */
//     const getUserClickedData = async () => {
//         try {
//             const { data } = await instance.get(`${environment.backendApi}/getUserClickedData`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if(data.data.didStackedSearch && data.data.performedSearch && data.data.viewedFoxTokenPage && data.data.viewedMintStats && data.data.viewedMyToken && data.data.viewedTodaysMints){
//                 setDidAllSteps(true);
//             }
//
//             return data;
//         } catch (e) {
//             console.error('try/catch in Whitelist.tsx: ', e);
//             const error = e as Error & { response?: AxiosResponse };
//             const msg = error?.response ? String(error.response.data.body) : 'Unable to connect. Please try again later';
//             present({
//                 message: msg,
//                 color: 'danger',
//                 duration: 5000,
//                 buttons: [{ text: 'X', handler: () => dismiss() }],
//             });
//         }
//     }
//
//     const userWhitelistDataQuery = useQuery(['whitelistData'], getUserClickedData, {
//         select: (data: any) => {
//             // Error handling
//             if (data?.error && data.message) {
//                 throw new Error(String(data.message));
//             }
//
//             // types REPEATED on user_whitelist.js and Whitelist.tsx and discord.js
//             const steps = [
//                 ['performedSearch', '/'],
//                 ['viewedTodaysMints', 'schedule'],
//                 ['viewedFoxTokenPage', 'foxtoken'],
//                 ['viewedMyToken', 'foxtoken?viewmytoken=true'],
//                 ['viewedMintStats', 'mintstats'],
//                 ['didStackedSearch', 'stackedsearch'],
//             ];
//
//             const results = steps.map(step => ({
//                 step: step[0],
//                 link: step[1],
//                 label: convertWordCase(step[0]),
//                 value: data.data[step[0]]
//             }));
//
//             return [
//                 ...results,
//             ]
//         },
//         // hnghh save $
//         // refetchOnWindowFocus: true,
//         retry: false
//     }) as any;
//
//     const getStepHelp = (type: any): string => {
//         switch (type) {
//             case 'performedSearch':
//                 return 'Do a search from the header of the site (which returns results from all the discords/twitters we monitor)';
//             case 'viewedTodaysMints':
//                 return 'View the "Today\'s Mints page" (which returns a schedule of the day\'s mints)';
//             case 'viewedFoxTokenPage':
//                 return 'View the "Fox Token" page (which shows a table of whitelist tokens you can buy/sell)';
//             case 'viewedMyToken':
//                 return 'On the "Fox Token" page, click the "View My Tokens" button (which is A BIG BUTTON IN RED on the top right of the table - CLICK IT) to filter the table. Note your wallet must be connected, or you can click the "Add Multiple Wallets" button to manually add 1-3 wallets';
//             case 'viewedMintStats':
//                 return 'View the "Mint Stats" page (which shows statistics on the mints we automatically parsed from discord)';
//             case 'didStackedSearch':
//                 return 'Perform a search on the "Stacked Line Search" page (which compares multiple words against each other)';
//         }
//         return '';
//     }
//
//     /**
//      * Use Effects
//      */
//
//     // @ts-ignore
//     return (
//         <div >
//             {userWhitelistDataQuery?.isFetching ?
//                 <div className="flex justify-center items-center">
//                     {/*<Loader/>*/}
//                     {/*Loading . . .*/}
//                 </div>
//                 :
//                 <>
//
//                     <div className="secondary-bg-forced m-1 p-4 rounded-xl" hidden={!didAllSteps}>
//                         Thanks for completing all the steps to use our site
//                     </div>
//
//                     {/*-{userWhitelistDataQuery.data}-*/}
//                     {/*hidden={userWhitelistDataQuery.data.didAllSiteFunctions}*/}
//                     <div className="secondary-bg-forced m-1 p-4 rounded-xl" hidden={didAllSteps} >
//                         <div className={`font-bold pb-1`}>Want to be able to submit your wallet, or help get whitelisted?</div>
//                         {/*"used-the-site" role progress*/}
//                         <div>
//                             Use the below features to be granted the <b>"used-the-site"</b> role in Discord. See <b>#whitelist-faq</b> in Discord for more details. <b className='text-red-500'>Manually refresh the page to see updates.</b>
//                             {/*After everything is checked, it may take a few minutes to show up in Discord.*/}
//                             <br/>
//
//                             {/*<span>*/}
//                             {/*    It is <b>NOT enough</b> that you just log in and click around.*/}
//                             {/*    You <b>MUST</b> follow the below steps - turn everything into <IonIcon className="text-green-500" icon={checkmarkCircleOutline} />*/}
//                             {/*    and hover over the*/}
//                             {/*        <Help description='' />*/}
//                             {/*    if you get stuck! This takes less than 5 minutes to complete.*/}
//                             {/*</span>*/}
//
//                             {/*<span>If you joined in February or before - you might see that everything is red. </span>*/}
//                         </div>
//                         <div>
//                             <div style={{ listStyle: '' }}>
//                                 {
//                                     userWhitelistDataQuery?.data?.map((step: any) => (
//                                         <div key={step.step} className="ml-0 mt-2">
//                                             <IonIcon className="text-green-500" hidden={step.value === false} icon={checkmarkCircleOutline} />
//                                             <IonIcon className="text-red-500" hidden={step.value === true} icon={closeCircleOutline} />
//
//                                             <Link hidden={step.link === '/'} className='underline ml-1' to={step.link}>{step.label}</Link>
//                                             <span hidden={step.link !== '/'} className='ml-1'>{step.label}</span>
//                                             <span className="ml-1">
//                                                 <Help description={getStepHelp(step.step)} />
//                                             </span>
//                                         </div>
//                                     ))
//                                 }
//                             </div>
//
//                             {/*<br/>*/}
//                             {/*<b>Troubleshooting:</b>*/}
//                             {/*<ul>*/}
//                             {/*    <li>- If you are clicking around and nothing turns green, AND you joined the server in February or before, <a href="https://discord.com/channels/925207817923743794/955986068937769050/958113662923591691" target="_blank" className="underline">then click this and follow it</a></li>*/}
//                             {/*    <li>- If everything is green but you haven't gotten your role after 3 minutes, then please open a ticket and we'll get back to you</li>*/}
//                             {/*</ul>*/}
//                         </div>
//                     </div>
//                 </>}
//         </div>
//     )
}

export default Whitelist;
