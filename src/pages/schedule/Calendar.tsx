import React, { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar'
import './Schedule.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonRippleEffect, IonSearchbar,  IonSpinner,  IonToolbar, useIonToast } from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router';
import MintChart from './MintChart';
import Loader from '../../components/Loader';
import Help from '../../components/Help';
import { logoDiscord, logoTwitter, link, close } from 'ionicons/icons';


const ScheduleCalendar: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const history = useHistory();
    const localizer = momentLocalizer(moment)
    const [present, dismiss] = useIonToast();
    const [isMobile, setIsMobile] = useState(false);
    const [selectDate, setSelectDate] = useState<any>(moment().toDate())
    const [myEvents, setEvents] = useState<any>()
    const [openEventModal, setOpenEventModal] = useState<any>(false)
    const [mints, setMints] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isSpinner, setIsSpinner] = useState(false);
    const [selectedEvent,setSelectedEvent] = useState<any>()
    const [showMorePopup, setShowMorePopup] = useState<boolean>(true)
    const [eventGraphData, setEventGraphData] = useState<any>()
    const [showGraph, setShowGraph] = useState<boolean>(false)
    const [searchEvent, setSearchEvent] = useState<any>()
    const [searchValue, setSearchValue] = useState<any>()
    const [monthLimit, setMonthLimit] = useState<boolean>(true)
    const [isSearch, setIsSearch] = useState<boolean>(false)

    let titleDiscription = `Projects must have > 2,000 Discord members (with > 300 being online), and  > 1,000 Twitter followers before showing up on the list. \n"# Tweet Interactions" gets an average of the Comments / Likes / Retweets (over the last 5 tweets), and adds them. The Fox logo in the price is the official Token price that comes from the Fox Token Market`

    moment.locale('ko', {
        week: {
            dow: 1,
            doy: 1,
        },
    });

    /**
     * Use Effects
     */
    useEffect(() => {
        fetchMintsData();
    }, []);

    useEffect(() => {
        let tempArray = []
        if(mints?.length>0){
            for (let index = 0; index < mints.length; index++) {
                if(mints[index].mints.length>0){
                    for (let i = 0; i < mints[index].mints.length; i++) {
                        tempArray.push({
                            id: mints[index].mints[i].id,
                            title: mints[index].mints[i].name,
                            start: moment (mints[index].date,'MM DD YYYY').toDate(),
                            end: moment(mints[index].date,'MM DD YYYY' ).toDate()
                        })
                    }
                }
            }
        }
        setEvents(tempArray)
    }, [mints])


    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

   /**
     * Functions
     */
    const fetchMintsData = () => {
        setIsLoading(true);

        instance
            .get(environment.backendApi + '/getAllMints')
            .then(async (res) => {
                setMints(res.data.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
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
            })
    }

    // viewing the chart for a calendar
    const viewChart = async(id: any) => {
        setIsSpinner(true)
        await instance
            .get( environment.backendApi + '/mintInfo?mintId=' + id )
            .then((res) => {
                setEventGraphData(res)
                setIsSpinner(false)
                if(res.data.data){
                    if(res.data.data.length > 1){
                        setShowGraph(true)
                    }else if (res.data.data.length === 0){
                        setShowGraph(false)
                    }else{
                        setShowGraph(false)
                    }
                }
            })
            .catch((err) => {
                setIsSpinner(false)
                console.error( 'error when getting event history data: ' + err );
                present({
                    message: 'Error - unable to load chart data. Please refresh and try again',
                    color: 'danger',
                    duration: 8000,
                    buttons: [{ text: 'hide', handler: () => dismiss() }],
                });
            });
    };

     // does the search functionality
     function handleSearch(val: any) {
        setIsSearch(true)
        val = val.detail.value.trim();
        setSearchValue(val)

        if(val){
            let tmpArray:any = myEvents?.filter((item:any)=>item.title.toLowerCase().includes(val.toLowerCase()))
            setSearchEvent(tmpArray)
        }else{
            setSearchEvent(myEvents)
        }
    }

    // const handleSlotSelect = (slotInfo: SlotInfo) => {
    //     onNavigate(moment(slotInfo.slots[0]).toDate());
    //  };

     // select event handler
    const handleSelectEvent = useCallback((event) => {
         setSelectedEvent(event)
         viewChart(event.id);
         setOpenEventModal(true)
         setShowMorePopup(false)
    },[])

    // next previous day and month

   const NextPrevMonth = (type:string) => {
       if(type === "prevMonth"){
           onNavigate(moment(selectDate).add(-1,'months').toDate())
           setMonthLimit(true)
       } else if(type === "currentMonth"){
        //    onNavigate(moment().toDate())
       } else if (type === "nextMonth"){
        setMonthLimit(false)
           onNavigate(moment(selectDate).add(1,'months').toDate())
       }
   }
// next prev data function
//    const NextPrevDate = (type:string) => {
//        if(type === "prevDay"){
//            onNavigate(moment(selectDate).add(-1,'days').toDate())
//        } else if(type === "today"){
//            onNavigate(moment().toDate())
//        } else if (type === "nextDay"){
//            onNavigate(moment(selectDate).add(1,'days').toDate())
//        }
//    }

   const onNavigate = (action: Date) =>{
       setSelectDate(action)
   }

  // calendar custom toolbar button
   const CustomCalenderToolbar  = () => {
       return (
           <div className='rbc-toolbar flex justify-between mt-4'>
               <div >
                  {!monthLimit ? <button type="button" onClick={()=> NextPrevMonth('prevMonth')} >{"<"}</button>: ''}
                   <button type="button"  onClick={()=> NextPrevMonth('currentMonth')}>{moment(selectDate).format('MMM YYYY')}</button>
                  {monthLimit ? <button type="button" onClick={()=> NextPrevMonth('nextMonth')} >{">"}</button> : ''}
               </div>
               {/*<div >*/}
               {/*    <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}}  onClick={()=> NextPrevDate('prevDay')}>{"<"}</button>*/}
               {/*    <button type="button" style={{fontSize:isMobile ? '12px' : ''}}  onClick={()=> NextPrevDate('today')} >{moment(selectDate).format('LL')}</button>*/}
               {/*    <button type="button" style={{fontSize:isMobile ? '12px' : '', width:isMobile? '20px' : ''}}  onClick={()=> NextPrevDate('nextDay')} >{">"}</button>*/}
               {/*</div>*/}
           </div>
         );
   }

   // do not remove
    const formatNumber = (n: any) => {
        if (n < 1e3) return n;
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
    };

    return (
            <>
            {isLoading ?
                <div className='flex justify-center items-center mt-4'><Loader/></div>
                 :
                 <>
                     {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
                     {/*    <div className="text-lg text-red-700 font-medium">*/}
                     {/*        Sorry small bug with the calendar - click "next month" then "previous month" to get all data*/}
                     {/*    </div>*/}
                     {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
                     {/*        !*/}
                     {/*    </span>*/}
                     {/*</div>*/}

                    <div className= {`${isMobile ? "text-center flex-col" : 'text-left flex-row' } text-2xl flex justify-between ml-1 mr-2 items-center`} >
                        <div className='flex flex-row' >Mint Calendar <div className='mt-1 ml-2'><Help description={titleDiscription} /></div></div>
                        <div className="text-base cursor-pointer flex flex-row items-center">
                            <IonSearchbar  className={`text-base !p-0 ${isMobile && 'w-60 h-10 items-left '} flex-grow  outline-none overflow-hidden flex rounded-full border`}
                            type="text" value={searchValue} onIonChange={(e:any) => {handleSearch(e)}} animated placeholder={'search'}   />
                            <div onClick= {() => history.push( { pathname: '/schedule'})}> <IonIcon icon={close} className="text-3xl ml-6" /></div>
                        </div>
                    </div>
                    <div className={ isMobile ? 'ml-1 mr-1' :"ml-3 mr-3"}>
                        <Calendar
                                className={isMobile ? 'show-more-btn custome-event' : ''}
                                views={['month']}
                                events={isSearch ? searchEvent : myEvents }
                                components = {{ toolbar : CustomCalenderToolbar, }}
                                localizer={localizer}
                                onSelectEvent={handleSelectEvent}
                                selectable
                                onNavigate = {(action: Date)=> onNavigate(action)}
                                style={{ height: isMobile ? '80vh' : 700, width:isMobile ? '90vw' : '' }}
                                startAccessor='start'
                                endAccessor='end'
                                date={selectDate}
                                popup={showMorePopup}
                                popupOffset={{x: 0, y: 0}}
                        />
                    </div>
                    <IonModal mode='ios' isOpen={openEventModal} onDidDismiss={() => {setOpenEventModal(false); setShowMorePopup(true)}} cssClass={isMobile ? `${showGraph ? 'calender-modal-mobile' : 'calender-modal-mobile-nochart'}` : `${showGraph ? 'calender-modal-web' : 'calender-modal-web-nochart'}`} >
                        <div className="schedule-popup">
                        <IonContent className="schedule-popup-wrapper">
                            <div className="schedule-popup-outer">
                                <div className="schedule-popup-inner">
                                <div className='flex popup-half-bg'>
                                    <div className='absolute top-2 cursor-pointer cancel-icon' onClick={() => {setOpenEventModal(false); setShowMorePopup(true)}}>
                                        <IonIcon icon={close} className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        {isSpinner ? <div className={`${isMobile ? 'h-24 w-24' : 'h-52 w-52'} flex items-center justify-center`}><IonSpinner /></div> : <img src={eventGraphData?.data?.data[0]?.image} className={`${isMobile ? 'h-24 w-24' : 'h-52 w-52'}`} alt=''/> }
                                    </div>
                                    <div className={`flex ${isMobile  ? 'items-start ml-3 mt-2 mb-3' : ' ml-6 mt-6 mb-3' } flex-col`}>
                                        <div className={`items-center flex`}>
                                            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl' }`}>{eventGraphData?.data?.data[0]?.mintName}</div>
                                            <div className={`items-center flex justify-center pt-2 pl-2 ${isMobile ? 'ml-1' : 'ml-4'}  flex-row`}>

                                                {/*Link*/}
                                                <a href={eventGraphData?.data?.data[0]?.website} className={`${eventGraphData?.data?.data[0]?.website && eventGraphData?.data?.data[0]?.website ? "schedule-link" : "schedule-link-disabled"}`} target="_blank">
                                                    <IonIcon icon={link} className="big-emoji"/>
                                                    <IonRippleEffect />
                                                </a>

                                                {/*discord*/}
                                                <a href={eventGraphData?.data?.data[0]?.discord_link} target="_blank" style={{ pointerEvents: eventGraphData?.data?.data[0]?.discord_link  ? "initial" : "none" }} className={`${eventGraphData?.data?.data[0]?.discord_link ? "schedule-link" : "schedule-link-disabled"} ml-2`}>
                                                    <IonIcon icon={logoDiscord} className="big-emoji"/>
                                                    <IonRippleEffect />
                                                </a>

                                                {/*twitter*/}
                                                <a href={eventGraphData?.data?.data[0]?.twitter_link} target="_blank" className="schedule-link ml-2" >
                                                    <IonIcon icon={logoTwitter} className="big-emoji"/>
                                                    <IonRippleEffect />
                                                </a>
                                            </div>
                                        </div>
                                        <div className='text-base'>{moment(eventGraphData?.data?.data[0]?.date).format('LLL')}</div>
                                        <div className={`${isMobile ? 'mt-2' : 'mt-4'}`}><b>Price : </b>{eventGraphData?.data?.data[0]?.price}</div>
                                        <div><b>Supply : </b>{eventGraphData?.data?.data[0]?.supply}</div>
                                        <div className={`flex ${isMobile ? '' : ' mt-4'} flex-row`}>
                                            <div className={`flex flex-col`}>
                                                <div><b>Discord : </b>{formatNumber(eventGraphData?.data?.data[0]?.numbersOfDiscordMembers) || 0}</div>
                                                <div><b>Twitter : </b>{formatNumber(eventGraphData?.data?.data[0]?.numbersOfTwitterFollowers) || 0}</div>
                                            </div>
                                            <div className={`flex flex-col ${isMobile ? 'ml-3' : 'ml-4'}`}>
                                                <div><b>Online : </b>{formatNumber(eventGraphData?.data?.data[0]?.DiscordOnlineMembers)}</div>
                                                <div><b>Interactions : </b>{formatNumber(eventGraphData?.data?.data[0]?.tweetInteraction?.total)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className='pm-4'>
                                {showGraph ? <MintChart eventGraphData = {eventGraphData}/> : <div className='text-center popup-half-bg h-10  items-center flex justify-center '><div>No chart history available</div> </div>}
                            </div>
                            </div>
                            </div>
                        </IonContent>
                        </div>
                    </IonModal>
                </>
            }
            </>
    );
};

export default ScheduleCalendar;
