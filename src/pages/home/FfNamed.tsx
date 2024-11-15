import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonButton, IonCard, IonIcon, IonItem, useIonToast} from "@ionic/react";
import {alertOutline, helpOutline, notifications, notificationsOutline, wallet} from "ionicons/icons";
import {Tooltip} from "react-tippy";
import {useHistory} from "react-router";
import './Home.css'

const FfNamed = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getFfNamed = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getFfNames', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return data;
        } catch (e) {
            console.error('try/catch in FfNamed.tsx: ', e);
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

            // if(msg.includes('logging in again')){
            //     history.push("/login");
            // }

            // throw new Error(msg);
        }
    }

    const ffNamedQuery = useQuery(['ffNamed'], getFfNamed, {
        select: (data: any) => {
            // Error handling
            if (data.error && data.message) {
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

    /**
     *
     */
    return (
        <>

            {ffNamedQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    <Loader/>
                    {/*Loading. . .*/}
                </div>
                :
                <>
                    <div className='secondary-bg-forced m-1 p-4 rounded-xl'>
                        <div className={`font-bold pb-1`}>
                            New Fox Token Market Names
                            <Tooltip
                                    trigger="mouseenter" position="bottom"
                                     html={<IonItem lines="none" className='max-w-[320px] rounded help-tooltip whitespace-pre-line'>
                                         Alerts on new names
                                     </IonItem>}>
                                    <IonIcon
                                        onClick={() => history.push('/alerts#fnn')}
                                        className="rounded-full help-tooltip p-1 text-lg cursor-pointer" icon={notifications} />
                            </Tooltip>

                        </div>
                        <div>
                            <ul style={{listStyle: 'disc'}}>
                                {ffNamedQuery?.data?.data?.map((obj: any) => (
                                        <li key={obj.createdAt} className="ml-3  ">
                                            {/*<Link to={'search/' + obj.msg} className="underline">*/}
                                            <div className="ml-1 flex justify-between p-1">
                                            <div className='w-full text-left'>
                                                {obj.msg.replaceAll("**", "")}
                                            </div>
                                              <div className='w-3/5 text-right text-gray-400'>
                                              ({moment(obj.createdAt).fromNow()})
                                              </div>
                                              </div>
                                              <div className='h-px bg-slate-700 w-full mt-2'/>
                                            {/*</Link>*/}
                                        </li>
                                    ))
                                }
                                    <div className="ml-3 underline text-blue-300 dark:text-blue-500 text-lg font-semibold ">
                                        <a href="https://discord.com/channels/925207817923743794/951513272132182066" target="_blank">View More in Discord</a>
                                    </div>
                            </ul>
                        </div>
                    </div>
                </>}
        </>
    )
}

export default FfNamed;
