
import { IonContent, IonModal } from '@ionic/react';
import React, { useRef , useState} from 'react';
import { Message } from '../../types/Message';
import MessageListItem from './MessageListItem';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { instance } from '../../axios';
import { AxiosResponse } from 'axios';
import ReactTooltip from "react-tooltip";
import SearchSkeleton from "./SearchSkeleton"
import { css } from '@emotion/react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Loader from '../Loader';

interface MessageThreadProps {
    message: Message;
    onClose: Function;
}

type MessageThreadQueryKey = readonly ['messageThread', string];
type PageParam = | { priorLimit: number; postLimit: number; messageId: string; message: any } | undefined;

interface MessageThreadData {
    priorMsg: Message[];
    subsequentMsg: Message[];
}

const MessageThread: React.FC<MessageThreadProps> = ({  message, message: { id }, onClose, }) => {
    const defaultPageParam: PageParam = {
        messageId: message.id,
        message: message,
        priorLimit: 5,
        postLimit: 100,
        // #s REPEATED on MessageThread.tsx & priorAndSubsequent.js
    };
    const [isLoading,setIsLoading] = useState<boolean>(false);
    async function fetchContext({ pageParam = defaultPageParam, }: QueryFunctionContext<MessageThreadQueryKey, PageParam>) {
        try {
            setIsLoading(true)
            const { data } = await instance.post<MessageThreadData>(  '/getPriorAndSubMessagesRDS',  pageParam );

            // data.priorMsg = data.priorMsg.map(message => ({
            //     ...message,
            //     // @ts-expect-error
            //     time : message.createdAt ? message.createdAt : message.time_stamp
            // }))
            data.subsequentMsg = data?.subsequentMsg?.map(message => ({
                ...message,
                // @ts-expect-error
                time : message.time_stamp ?  message.time_stamp : message.createdAt
            }))
            setIsLoading(false)

            if (pageParam === defaultPageParam)
                // return [...data.priorMsg, message, ...data.subsequentMsg];
                return [message, ...data.subsequentMsg];
            // return [...data.priorMsg, ...data.subsequentMsg];
            return [...data.subsequentMsg];

        } catch (e) {
            setIsLoading(false)
            console.error('try/catch in MessageThread.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            // if (error && error.response) {
            //     throw new Error(String(error.response.data.body));
            // } else {
            //     throw new Error('Unable to connect. Please try again later');
            // }

            return [];
        }
    }


    const {
        data = { pages: [] },
        hasNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery(['messageThread', message.id], fetchContext, {
        getNextPageParam: (lastPage): PageParam => {
            const lastMessageId =  lastPage?.slice(-1)[0]?.id;
            return lastMessageId
                ? {
                    messageId: lastMessageId,
                    message: null,
                    postLimit: 10,
                    priorLimit: 0,
                }
                : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            let firstMessageId
            if(firstPage[0]){
                firstMessageId = firstPage[0].id;
            }
            return firstMessageId
                ? {
                    messageId: firstMessageId,
                    postLimit: 0,
                    priorLimit: 10,
                }
                : undefined;
        },
        initialData: {
            // @ts-expect-error
            pageParams: defaultPageParam,
            pages: [
                [
                    ...[...Array(10).keys()].map(() => undefined),
                    message,
                    ...[...Array(10).keys()].map(() => undefined),
                ],
            ],
        },
    });

    const mainMessageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(true)
    return (
        <>
            <IonModal isOpen = {isModalOpen} onDidDismiss={onClose as any} >
                <div ref={containerRef} className="p-5 c-res-messages messages h-full w-full mx-auto">
                    <div onClick={()=> setIsModalOpen(false)}  className=' justify-end text-red-500 flex m-3 cursor-pointer'  >
                        <HighlightOffIcon className='text-2xl'/>
                    </div>
                    {isLoading ? <div className='flex justify-center'><Loader/></div> :
                        <div className='overflow-y-scroll h-full w-full mx-auto p-5'>
                            
                        {data.pages.map((page) =>{
                        return(

                                page.map((message:any, i:number) =>{
                                        return (<div className="my-1.5" key={i}>
                                            <MessageListItem  message={message} isFromMsgThread={true}  key={i} ref={ message?.id === id ? mainMessageRef : null } />
                                        </div>)
                                } ))}
                            )
                            .flat(1)
                        }
                        </div>
                    }
                </div>

                <ReactTooltip />
            </IonModal>
        </>
    );
};

export default MessageThread;




// (confirm live discord view is working ... and clicking into a few messages updates the modal fine .. and dates show up fine when click into message ... and messages 'a few seconds ago' work fine (still commented out messagelistitem.tsx)

// (on messagethread & display.tsx): https://discord.com/channels/925207817923743794/955986068937769050/989448949205180516
    // reverted back to https://gitlab.com/nft-relay-group/frontend-app/-/blob/24ea7c9cb6ffb2761c6eecd6e459f71ca2771ab3/src/components/search/MessageThread.tsx
// need loading bar when click into a message


// import { IonButton, IonContent, IonModal, useIonToast } from '@ionic/react';
// import React, { useEffect, useRef , useState} from 'react';
// import { Message } from '../../types/Message';
// import MessageListItem from './MessageListItem';
// import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
// import { instance } from '../../axios';
// import { AxiosResponse } from 'axios';
// import ReactTooltip from "react-tooltip";
// import SearchSkeleton from "./SearchSkeleton"
// import HighlightOffIcon from '@material-ui/icons/HighlightOff';
// import { io, Socket } from "socket.io-client";
// import { DefaultEventsMap } from '@socket.io/component-emitter';
// import Loader from '../Loader';


// interface MessageThreadProps {
//     message: Message;
//     onClose: Function;
//     isModalOpen:boolean;
//     setIsModalOpen:Function;
// }

// type MessageThreadQueryKey = readonly ['messageThread', string];
// type PageParam =
//     | { priorLimit: number; postLimit: number; messageId: string; message: any }
//     | undefined;

// interface MessageThreadData {
//     priorMsg: Message[];
//     subsequentMsg: Message[];
// }

// const MessageThread: React.FC<MessageThreadProps> = ({
//     message,
//     message: { id },
//     onClose,
//     isModalOpen,
//     setIsModalOpen,
// }) => {
//     const defaultPageParam: PageParam = {
//         messageId: message.id,
//         message: message,
//         priorLimit: 5,
//         postLimit: 100,
//         // #s REPEATED on MessageThread.tsx & priorAndSubsequent.js
//     };

//     const mainMessageRef = useRef<HTMLDivElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     // const [isModalOpen, setIsModalOpen] = useState(true)
//     const [isMobile, setIsMobile] = useState(false);
//     const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [present, dismiss] = useIonToast();
//     const [socketVar,setSocketVar] = useState<any>()
//     const [dataPages,setDataPages] = useState<any>([])
//     const [isNewData,setIsNewData] = useState<number>(0)
//     const [hideMessageBtn, setHideMessageBtn] = useState<boolean>(true)
//     const role = localStorage.getItem('role')
//     let socket: Socket<DefaultEventsMap, DefaultEventsMap>;


//     async function fetchContext({ pageParam = defaultPageParam}: QueryFunctionContext<MessageThreadQueryKey, PageParam>) {
//         try {
//             console.log(pageParam);
//             const { data } = await instance.post<MessageThreadData>('/getPriorAndSubMessages', pageParam );
//                 setIsNewData( data?.subsequentMsg.length)
//                 data.subsequentMsg = data?.subsequentMsg?.map(message => ({
//                     ...message,
//                     // @ts-expect-error
//                     time : message.time ? message.time : message.time_stamp
//                 }))

//             if (pageParam === defaultPageParam)
//                 // return [...data.priorMsg, message, ...data.subsequentMsg];
//                 return [message, ...data.subsequentMsg];
//             // return [...data.priorMsg, ...data.subsequentMsg];
//             return [...data.subsequentMsg];

//         } catch (e) {
//             console.error('try/catch in MessageThread.tsx: ', e);
//             const error = e as Error & { response?: AxiosResponse };

//             // if (error && error.response) {
//             //     throw new Error(String(error.response.data.body));
//             // } else {
//             //     throw new Error('Unable to connect. Please try again later');
//             // }

//             return [];
//         }
//     }


//     const {
//         data = { pages: [] },
//         hasNextPage,
//         fetchNextPage,
//         fetchPreviousPage,
//     } = useInfiniteQuery(['messageThread', message.id], fetchContext, {
//         getNextPageParam: (lastPage): PageParam => {
//             const lastMessageId =  lastPage?.slice(-1)[0]?.id;
//             return lastMessageId
//                 ? {
//                       messageId: lastMessageId,
//                       message: null,
//                       postLimit: 10,
//                       priorLimit: 0,
//                   }
//                 : undefined;
//         },
//         getPreviousPageParam: (firstPage) => {
//             let firstMessageId
//             if(firstPage[0]){
//                 firstMessageId = firstPage[0].id;
//             }
//             return firstMessageId
//                 ? {
//                       messageId: firstMessageId,
//                       postLimit: 0,
//                       priorLimit: 10,
//                   }
//                 : undefined;
//         },
//         initialData: {
//             // @ts-expect-error
//             pageParams: defaultPageParam,
//             pages: [
//                 [
//                     ...[...Array(10).keys()].map(() => undefined),
//                     message,
//                     ...[...Array(10).keys()].map(() => undefined),
//                 ],
//             ],
//         },
//     });

//     useEffect(() => {
//         if (window.innerWidth < 525) {
//             setIsMobile(true)
//         }else{
//             setIsMobile(false)
//         }
//     }, [window.innerWidth])

//     // get Live messages

//     const viewLiveMessages = () => {
//         initiateSocket()
//         if(role === '3NFT'){
//             initiateSocket()
//             // console.log('Connect Socket------')
//         }else{
//             present({
//                 message: `You are not able to view live messages because you don't have 3 NFTs`,
//                 color: 'danger',
//                 duration: 5000,
//                 buttons: [{ text: 'X', handler: () => dismiss() }],
//             })
//         }
//     }

//     // Socket initial
//     const initiateSocket = () => {
//         setIsLoading(true)
//         socket = io('http://192.168.1.102:5027');

//         socket.on('connect', () => {
//             console.log('socket connect-------')
//             setIsSocketConnected(true);
//             setHideMessageBtn(false)
//         })

//         socket.emit('getData', defaultPageParam);
//         // socket.emit('getData', {
//         //     "messageId": "d718001b-f2ab-4eda-958f-59647c5e87b9",
//         //     "message": {
//         //         "time": "2022-04-06T13:59:41.000Z",
//         //         "message": "Is anyone's sol wallet transfer slow af rn",
//         //         "source": "Lima",
//         //         "id": "d718001b-f2ab-4eda-958f-59647c5e87b9",
//         //         "author": "Adam Trusela"
//         //     },
//         //     "priorLimit": 5,
//         //     "postLimit": 100
//         // }
//         // );



//         socket.on('Data', (data) => {
//             console.log('socket data',data)
//             setIsLoading(false)
//             if(data.subsequentMsg.length > 0){
//                 if(isNewData < data.subsequentMsg.length){
//                     setIsNewData(data.subsequentMsg.length)
//                     data.subsequentMsg = data?.subsequentMsg?.map((message: { time: any; updatedAt: any; }) => ({
//                         ...message,
//                         time : message.time ? message.time : message.updatedAt
//                     }))
//                     setDataPages([data.subsequentMsg])
//                 }
//             }

//         })
//         setSocketVar(socket)
//     }

//     // Disconnect socket on close button
//     const disconnectSocket = () => {
//         socketVar.disconnect();
//         console.log('disconnect------')
//         setIsSocketConnected(false)
//         setHideMessageBtn(true)
//     }

//     useEffect(() => {
//         setDataPages(data.pages)
//     }, [data])


//     return (
//         <>
//             <IonModal isOpen = {isModalOpen} onDidDismiss={()=> {
//                         if(isSocketConnected) {
//                             disconnectSocket()
//                         }
//                         setIsModalOpen(false)
//                         }}>
//                 <div ref={containerRef} className={`${isMobile ? 'p-2' : 'p-4'} c-res-messages messages h-full w-full mx-auto`} >

//                     <div className={` ${hideMessageBtn ? 'justify-between' : 'justify-end' } ${isMobile ? 'm-3' :'mb-3'} text-red-500 flex cursor-pointer items-center`}>
//                        {hideMessageBtn ? <IonButton onClick={()=>viewLiveMessages()}>View Live Messages</IonButton> : ''}
//                        <div onClick={()=> {
//                                if(isSocketConnected){
//                                    disconnectSocket()
//                                }
//                                  setIsModalOpen(false)
//                                }
//                             }>
//                            <HighlightOffIcon className='text-2xl'/>
//                        </div>
//                     </div>
//                     {isLoading ? <div className='flex justify-center'><Loader/></div> : ''}

//                     <div className={`overflow-y-scroll h-full w-full mx-auto ${isMobile ? 'p1' :'p-5'}`}>
//                         { dataPages && dataPages?.length > 0 ? dataPages.map((page:any,index:number) =>{
//                                 return <div key={index}>
//                                             {page.map((message:any, i:number) => {
//                                                 return <div key={i}>
//                                                             {message ? (
//                                                                 <div className="my-1.5" key={i}>
//                                                                     <MessageListItem message={message} isFromMsgThread={true} key={message.id} ref={ message.id === id ? mainMessageRef : null } />
//                                                                 </div>
//                                                             ) : (
//                                                                 <SearchSkeleton key={i}/>
//                                                             )}
//                                                         </div>
//                                                 })
//                                             }
//                                         </div>
//                                 })
//                             .flat(1)
//                         :
//                         <div className='flex justify-center text-xl opacity-60'>No data available</div>
//                         }
//                     </div>
//                 </div>
//                 <ReactTooltip />
//             </IonModal>
//         </>
//     );
// };

// export default MessageThread;
