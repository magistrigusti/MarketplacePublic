import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import {Link, useLocation} from "react-router-dom";
import {IonCard, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";

const TopSearchWords = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getSearchedWords = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getSearchedWords', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log('data---------',data)
            return data;
        } catch (e) {
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

    const topSearchWordsQuery = useQuery(['searchWords'], getSearchedWords, {
        select: (data: any) => {

            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        // refetchOnWindowFocus: true,
        retry: false
    })

    /**
     * Use Effects
     */

    return (
        // bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4
        <div className="secondary-bg-forced m-1 p-4 rounded-xl mt-7">
            {topSearchWordsQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    {/*<Loader/>*/}
                    Loading . . .
                </div>
                :
                <>
                    <div className={`font-bold pb-1 tracking-wider text-xl`}>Top searches of past day</div>
                    <div>
                    <ul style={{listStyle: 'disc'}}>
                    {topSearchWordsQuery?.data?.data?.map((word: any, index:number) => {
                        return(
                            <li  key={index} className="ml-8">{word.searchterm}</li>
                        )
                    })}
                        
                    </ul>

                    </div>
                </>}
        </div>
    )
}




export default TopSearchWords
