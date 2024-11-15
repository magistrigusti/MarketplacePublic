import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import {IonCard, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";

const TopDiscordGainers = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getTopFiveDiscordData = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getTopFiveDiscordData', { headers: { 'Content-Type': 'application/json', },})
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';
            if (error?.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }
            present({
                message: msg,
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });

        }
    }

    const topSearchWordsQuery = useQuery(['searchWords'], getTopFiveDiscordData, {
        select: (data: any) => {
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        retry: false
    })

    const formatNumber = (n: any) => {
        if (n < 1e3) return n;
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
    };


    /**
     * Use Effects
     */

    return (
            <>
                { topSearchWordsQuery?.data?.data?.length > 0 ?
                    <div className="secondary-bg-forced m-1 p-4 rounded-xl mt-6">
                        {topSearchWordsQuery?.isFetching ?
                        <div className="flex justify-center items-center">
                            Loading . . .
                        </div>
                    : <>
                            <div className={`font-bold pb-1 tracking-wider text-xl`}>Top Discord Gainers - 24h</div>
                            { topSearchWordsQuery?.data?.data?.map((item:any,index:number)=>{
                                return (
                                    <div className='flex flex-row justify-between' key={index}>
                                        <div>{item.mint_detail?.name}</div>
                                    <div>+{formatNumber(item?.discord_all)}</div>
                            </div>
                                )
                            })}
                      </>}
                </div>:''
                }
            </>
    )
}
export default TopDiscordGainers
