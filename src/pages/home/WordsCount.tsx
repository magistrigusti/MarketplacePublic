import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonCard, IonLabel, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";
import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';

const WordsCount = () => {

    const history = useHistory();
    const [present, dismiss] = useIonToast();
    const [wordList, setWordList] = useState<any>(null)
    const [wordError, setWordError] = useState<boolean>(false)

    useEffect(() => {
        getWordCountByDuration()
    }, [])

    let getWordCountByDuration = async() =>{
        instance.get( '/getWordCountByDuration' )
                .then((response) => {
                    let data = response.data.data
                    setWordList(data)
                    setWordError(false)
                })
                .catch((error) => {
                    setWordError(true)
                    let msg = '';
                        if (error && error.response) {
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
                })
    }


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

            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';
            if (error && error.response) {
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

    /**
     * Use Effects
     */

    return (
        <div className="flex flex-row justify-center w-full mt-6">
                <Grid container spacing={3}>
                    {/*'top 5 new words created in the last day  */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                { wordList?.yesterday ?

                                    <>
                                        <IonLabel className="ml-3 text-xl">
                                        Top 5 new words created in the last day
                                        </IonLabel>
                                        <div className='flex flex-col'>
                                            {wordList.yesterday && wordList.yesterday.map((text:any,index:number)=>{
                                                return <Link to={'search/' + text.word} className="ml-5 text-sm mt-2 underline underline-offset-2" key={index}> {text.word} </Link>
                                            })}
                                        </div>
                                    </>
                                    :
                                    <>
                                    {
                                        wordError ? <div className='text-center'>Something went wrong</div> : <div className='text-center'>Loading...</div>
                                    }
                                    </>

                                }

                            </div>
                        </div>
                    </Grid>
                    {/* top 5 new words that were created in last 3 days */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                { wordList ?
                                 <>
                                    <IonLabel className="ml-3 text-xl">
                                    Top 5 new words that were created in last 3 days
                                    </IonLabel>
                                    <div className='flex flex-col'>
                                        {wordList && wordList['3days'].map((text:any,index:number)=>{
                                            return <Link to={'search/' + text.word} className="ml-5 text-sm underline underline-offset-2 mt-2" key={index}> {text.word} </Link>
                                        })}
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        wordError ? <div className='text-center'>Something went wrong</div> : <div className='text-center'>Loading...</div>
                                    }
                                </>
                              }
                            </div>
                        </div>
                    </Grid>
                    {/* top 5 new words that were created in the last 5 days */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                {wordList ?
                                    <>
                                        <IonLabel className="ml-3 text-xl">
                                        Top 5 new words that were created in the last 5 days
                                        </IonLabel>
                                        <div className='flex flex-col'>
                                            {wordList && wordList['5days'].map((text:any,index:number)=>{
                                                return <Link to={'search/' + text.word} className="ml-5 text-sm underline underline-offset-2 mt-2" key={index}> {text.word} </Link>
                                            })}
                                        </div>
                                    </>
                                    :
                                    <>
                                    {
                                        wordError ? <div className='text-center'>Something went wrong</div> : <div className='text-center'>Loading...</div>
                                    }
                                    </>
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
    )
}





export default WordsCount
