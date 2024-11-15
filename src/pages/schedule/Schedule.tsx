import React, { useEffect, useState } from 'react'
import moment from 'moment';
import 'moment-timezone';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import Loader from '../../components/Loader';
import { IonContent, IonIcon, IonRippleEffect, useIonToast, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption } from '@ionic/react';
import './Schedule.css'
import { Column, MTableToolbar } from '@material-table/core';
import Table from '../../components/Table';
import { logoDiscord, logoTwitter, link, navigate,calendarOutline } from 'ionicons/icons';
import { useHistory } from "react-router";
import usePersistentState from '../../hooks/usePersistentState';
import { RefresherEventDetail } from '@ionic/core';
import { Virtuoso } from 'react-virtuoso';
import { Grid, MenuItem, Select } from '@material-ui/core';
import TimezoneData from '../../util/Book1.json'
import Help from '../../components/Help';
import CommonMintsData from './CommonMintsData';

interface Mint {
    image: string;
    project: string;
    twitterLink: string;
    discordLink: string;
    projectLink: string;
    time: string;
    tillTheMint: string;
    count: string;
    price: string;
    wlPrice: string;
    wlTokenAddress: string;
    extras: string;
    tenDaySearchResults: string[];
    mintExpiresAt: string;
    numbersOfDiscordMembers: string;
    DiscordOnlineMembers: string;
    numbersOfTwitterFollowers: number;
    tweetInteraction: {
        total: number;
        likes: number;
        comments: number;
        reactions: number;
    }
    updateTime?:string
}


const Schedule = () => {

    /**
     * States & Variables.
     */
    const [present, dismiss] = useIonToast();
    const history = useHistory();
    const [date, setDate] = useState('')
    const [mints, setMints] = useState<Mint[]>([])
    const [splitCollectionName, setSplitCollectionName] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isPaging, setIsPaging] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState<any>({})
    const [mode] = usePersistentState("mode", "dark");
    const [searchFocus, setSearchFocus] = useState<boolean>(false)

    let titleDiscription = `Projects must have > 2,000 Discord members (with > 300 being online), and  > 1,000 Twitter followers before showing up on the list.
    \n"# Tweet Interactions" gets an average of the Comments / Likes / Retweets (over the last 5 tweets), and adds them.
    The Fox logo in the price is the official Token price that comes from the Fox Token Market.
    Rows in bold mean the mint comes out in two hours or less.
    `



    let dataSource = mints
    let userTimezone:string

    /**
     * This will call the every minute to update the mints array and assign mintExpiresAt field
     * which is calculated with moment.fromNow()
     * So as we are scrapping the data every hour and since we would have an hour old data
     * this will keep updating the time of when the mint will expire
     */
    const addMintExpiresAt = () => {
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].time !== "")
                //  dataSource[i].mintExpiresAt = " (" + moment(moment.utc(dataSource[i].time, 'HH:mm:ss a').format('HH:mm:ss a'), 'HH:mm:ss a').fromNow() + ")";
                dataSource[i].mintExpiresAt = " (" + moment.utc(dataSource[i].time, 'hh:mm:ss').fromNow() + ")";        }
        setMints([...dataSource]);
    }

    const formatNumber = (n: any) => {
        if (n < 1e3) return n;
        if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
    };

    // set user time zone in user data
    const SetUserTimeZone = async () =>{
        let param = {timezone:selectedTimezone.value}
        await instance.post(environment.backendApi + '/setUserTimeZone',param)
            .then((res) => {
                GetUserTimeZone()
            });
    }

    // get user time zone from user data
    const GetUserTimeZone = async() => {
        await instance.get(`${environment.backendApi}/currentUser`)
        .then((res: any) => {
            userTimezone = res?.data.user.timezone
        })
    }

    // console.log('no time zone', moment.tz.names())

    useEffect(() => {
        if(userTimezone !== selectedTimezone.value){
            SetUserTimeZone();
        }

        if(dataSource && Object.keys(selectedTimezone).length !== 0){
            for (let i = 0; i < dataSource.length; i++) {
                if (dataSource[i].time.includes('UTC')){
                    let utcZoneTime =  moment.utc(dataSource[i].time,'HH:mm').tz(selectedTimezone.value).format('HH:mm')
                    dataSource[i].updateTime=utcZoneTime
                }
            }
                setMints([...dataSource]);
        }
      }, [selectedTimezone])

    useEffect(() => {
        if (mints.length <= 10) {
            setIsPaging(false)
        } else {
            setIsPaging(true)
        }
    }, [mints])

    useEffect(() => {
        dataSource.length && addMintExpiresAt();

        const interval = setInterval(() => {
        let selectTime:any
        setSelectedTimezone((old:any)=>{
            selectTime=old
            return old
        })
            for (let i = 0; i < dataSource.length; i++) {
                if (dataSource[i].time !== ""){
                    // dataSource[i].mintExpiresAt = " (" + moment.utc(dataSource[i].time, 'hh:mm:ss').fromNow() + ")";
                    let utcZoneTime =  moment.utc(dataSource[i].time,'HH:mm').tz(selectTime.value).format('HH:mm')
                    dataSource[i].updateTime=utcZoneTime
                }
               }
            setMints([...dataSource])
        }, 60000)

        return () => clearInterval(interval);
    }, [dataSource.length]);

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }
    }, [window.innerWidth])
    // Get today's mints
    const fetchMintsData = () => {
        setIsLoading(true);

        instance
            .get(environment.backendApi + '/getTodaysMints')
            .then(async (res) => {
                setMints(res.data.data.mints);
                setDate(res.data.data.date);
                setIsLoading(false);
               await GetUserTimeZone()
                SetDefaultTimeZone()
            })
            .catch((error) => {
                setIsLoading(false);
                SetDefaultTimeZone()
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

            })
    }
    // Pull to refresh function
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            fetchMintsData()
            event.detail.complete();
        }, 1000);
    }

    useEffect(() => {
        fetchMintsData();
    }, []);

    // set default time zone UTC 00:00
    const SetDefaultTimeZone = () => {
        setSelectedTimezone({value:userTimezone ? userTimezone : 'Africa/Casablanca'})
    }

    const timeCount = (time: any) => {
        const hours: number = -1 * moment.duration(moment(new Date()).diff(+ moment(time, 'h:mm:ss'))).asHours();
        return hours >= 0 && hours <= 2;
    }

    // This will call the mintExpiresAt function every minute to update tillTheMint's time
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       mintExpiresAt(mints)
    //     }, 60000)
    //
    //     return () => clearInterval(interval);
    // }, [mints]);


    /**
     * this function is used to update the time of tillTheMint every minute
     * @param {[]} mints array
     * @return {} update the mints array objects values => tillTheMint to new values
     */
        // const mintExpiresAt = (arr: any) => {
        //   for(let i = 0; i < arr.length; i++) {
        //     if(arr[i].mintExpiresAt || arr[i].mintExpiresAt.length !== 0) {
        //       const timeNow = moment()
        //       const timeExpiresAt = moment(arr[i].mintExpiresAt)
        //
        //       const diff = (timeExpiresAt.diff(timeNow))
        //
        //       let minutes = Math.floor((diff / (1000 * 60)) % 60)
        //       let hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        //
        //       let splitArr = arr[i].tillTheMint.split(" ") // ['6', 'hours', '23', 'minutes']
        //
        //       splitArr[0] = hours
        //       splitArr[2] = minutes
        //
        //       arr[i].tillTheMint = splitArr.join(" ")
        //     }
        //   }
        // }

    const handleProjectClick = (project: any) => {
            setIsOpen(!isOpen);
            setIsLoading(true);

            // Temporarily set this condition below since old collection has 10DaySearchResults field
            // which is conflicting with new renamed field tenDaySearchResults
            setSplitCollectionName(!project.tenDaySearchResults ? project['10DaySearchResults'] : project.tenDaySearchResults);
            setIsLoading(false);
        }

    // @ts-ignore
    const columns_mobile: Column<Mint>[] = [
        {
            title: 'Details',
            render: (record) => (
               <CommonMintsData record={record} />
            ),
            customSort: (a, b) => a.project.localeCompare(b.project),
            customFilterAndSearch: (term, rowData) => rowData?.project.toLowerCase().includes(term.toLowerCase()), },
    ];

    const columns: Column<Mint>[] = [
        {
            title: 'Powered by SOL Decoder',
            cellStyle: {
                width: 145,
                minWidth: 145,
                maxWidth: 145,
            },
            headerStyle: {
                width: 145,
                minWidth: 145,
                maxWidth: 145,
            },
            render: (record) => (
                <div className="flex space-x-3">

                    {/*discord*/}
                    <a
                        href={record.discordLink}
                        target="_blank"
                        style={{
                            pointerEvents: (record.discordLink && record.numbersOfDiscordMembers) ? "initial" : "none"
                        }}
                        className={(record.discordLink && record.numbersOfDiscordMembers) ? "schedule-link" : "schedule-link-disabled"}
                    >
                        <IonIcon icon={logoDiscord} className="big-emoji" />
                        <IonRippleEffect />
                    </a>

                    {/*twitter*/}
                    <a
                        href={record.twitterLink}
                        className="schedule-link"
                        target="_blank"

                    >
                        <IonIcon icon={logoTwitter} className="big-emoji" />
                        <IonRippleEffect />

                    </a>
                    <a
                        href={record.projectLink}
                        className={(record?.projectLink) ? "schedule-link" : "schedule-link-disabled"}
                        target="_blank"

                    >
                        <IonIcon icon={link} className="big-emoji" />
                        <IonRippleEffect />

                    </a>
                </div>
            ),
            hiddenByColumnsButton: true,

        },
        {
            title: 'Name',
            render: (record) => (
                <>
                    <img className={`avatarImg ${!record.image ? 'hiddenImg' : ''}`} key={record.image} src={record.image} />
                    <span className="" onClick={() => handleProjectClick(record)} > {record?.project} </span>
                </>
            ),
            customSort: (a, b) => a.project.localeCompare(b.project),
            customFilterAndSearch: (term, rowData) =>rowData?.project?.toLowerCase().includes(term.toLowerCase()),
        },
        {
            title: 'Time',
            // customSort: (a, b) => +new Date(a.time) - +new Date(b.time),
            customSort: (a, b) => a.time.localeCompare(b.time), // sorting with time
            render: (record) => (
                <span>
                    {record?.updateTime || record?.time.replace('UTC', '')}
                    <span hidden={record.mintExpiresAt.indexOf('Invalid') !== -1} >
                        {record?.mintExpiresAt}
                    </span>
                    {/* {record.time !== "" && " (" + moment.utc(record.time, 'hh:mm:ss').fromNow() + ")"} */}
                    {
                        // setInterval(() => {
                        //     <p>ok</p>
                        //     // updateTime(record.time)
                        // }, 6000)
                    }
                </span>
            ),
        },
        {
            title: 'Price',
            customSort: (a, b) => +a.price.split(' ')[0] - +b.price.split(' ')[0],
            // send price in parmas and redirect to fox token page
            render: (record) => <div onClick={(e) => record?.wlPrice ? history.push( { pathname: '/foxtoken',search: record?.wlTokenAddress }) : '' } className={'break-normal whitespace-normal w-48 flex flex-row ' + (record.wlPrice ? ' cursor-pointer underline' : '') } dangerouslySetInnerHTML=
                {{
                    __html: record.wlPrice ? `
                    ${record?.price.replace(/public/gi, "<br>public").replace('SOL', '')} (<img src="/assets/icons/FoxTokenLogo.svg" class="h-5 pr-1 foxImg" /> ${record?.wlPrice}) ◎` : `${record?.price.replace(/public/gi, "<br>public").replace('SOL', '')} ◎`
                }}></div>,
        },
        {
            title: 'Supply',
            customSort: (a, b) => + a.count.replace(',', '') - + b.count.replace(',', ''),
            render: (record) => <span>{record?.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
        },
        {
            title: 'Discord (all)',
            render: (record) => (
                <>
                    {/*{record?.numbersOfDiscordMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {formatNumber(record?.numbersOfDiscordMembers)}
                </>
            ),
            // @ts-ignore
            customSort: (a, b) => a.numbersOfDiscordMembers - b.numbersOfDiscordMembers,
        },
        {
            title: 'Discord (online)',
            render: (record) => (
                <>
                    {/*{record?.DiscordOnlineMembers?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {formatNumber(record?.DiscordOnlineMembers)}
                </>
            ),
            // @ts-ignore
            customSort: (a, b) => a.DiscordOnlineMembers - b.DiscordOnlineMembers,
        },
        {
            title: 'Twitter',
            render: (record) => (
                <>
                    {/*{record?.numbersOfTwitterFollowers?.toString() .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {formatNumber(record?.numbersOfTwitterFollowers)}
                </>
            ),
            customSort: (a, b) => a.numbersOfTwitterFollowers - b.numbersOfTwitterFollowers,
        },
        {
            title: 'Tweet Interactions',
            customSort: (a, b) => a.tweetInteraction.total - b.tweetInteraction.total,
            render: (record) => (
                <>
                    <span>
                        {/*{record?.tweetInteraction?.total}*/}
                        {formatNumber(record?.tweetInteraction?.total)}
                    </span>
                </>
            ),
        },
    ];

    // Renders
    return (
        <>
            {/*w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4 max-w-fit mx-auto mb-10*/}

            {isLoading ? (
                <div className="pt-10 flex justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <>
                    <IonContent className='h-screen scheduleTable' scroll-y='false'>
                        {isMobile ? <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullFactor={0.5} pullMin={100} pullMax={200} >
                            <IonRefresherContent />
                        </IonRefresher> : ''}

                        <Virtuoso className='h-full'
                                  totalCount={1}
                                  itemContent={() =>
                                      <Table data={dataSource}
                                            columns={isMobile ? columns_mobile : columns}
                                            title={`Mint Schedule - ${date}`}
                                            description={`Projects must have > 2,000 Discord members (with > 300 being online), and  > 1,000 Twitter followers before showing up on the list.
                                            \n"# Tweet Interactions" gets an average of the Comments / Likes / Retweets (over the last 5 tweets), and adds them.
                                            The Fox logo in the price is the official Token price that comes from the Fox Token Market.
                                            Rows in bold mean the mint comes out in two hours or less.
                                            `}
                                            style={{ overflow: 'auto', overflowWrap: 'break-word' }}
                                            options={{
                                                pageSize: 20,
                                                searchFieldStyle:{
                                                    // marginLeft:'0%',
                                                    marginTop:'2%',
                                                    paddingLeft:"4%",
                                                    borderRadius:30,
                                                    border : mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.876) !important' : '1px solid rgba(10,10,10,0.8) !important'
                                                },
                                                rowStyle: (rowData: any) => ({
                                                    fontWeight: timeCount(rowData.time) ? '' : "",
                                                    backgroundColor: mode === 'dark' ? '' : 'rgba(239,239,239,0.8)',
                                                    color: mode === 'dark' ? "" : '#202124',
                                                    borderTop: mode === 'dark' ? "" : '1px solid rgba(260,260,260,0.8)',
                                                }),
                                                paging: isPaging,
                                                columnsButton: false // isMobile ? false : true,
                                            }}
                                            // calendar icon for show calendar do not remove
                                            actions={[
                                                {
                                                    icon: () => <IonIcon icon={calendarOutline} className="text-3xl " />,
                                                    onClick: () => history.push( { pathname: '/calendar',state:mints}),
                                                    isFreeAction: true,
                                                },
                                            ]}

                                            components={{
                                                Toolbar: (Toolbarprops) => {
                                                    const propsCopy = { ...Toolbarprops };
                                                        if (isMobile) {
                                                            propsCopy.showTitle = true;
                                                        } else {
                                                            propsCopy.showTitle = false;
                                                        }

                                                    return (
                                                        <>

                                                        <Grid container direction="row">
                                                            <Grid
                                                                container
                                                                item
                                                                sm={8}
                                                                style={{ alignItems: 'center' }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', }} >
                                                                        <div className="hidden sm:block" style={{ width:'100%'}}>
                                                                            <div className='text-xl font-medium text-ellipsis flex flex-row items-center'>{`Mint Schedule - ${date}`}  <div className='mt-1 ml-2'><Help description={titleDiscription} /></div></div>
                                                                        </div>
                                                                    <IonSelect id="demo-simple-select" value={selectedTimezone.value} interface="popover" onIonChange={(selected: any) => { setSelectedTimezone({ ...selected.detail }) }} className="c-ion-select">

                                                       {TimezoneData && TimezoneData.map((item: any, index: number) => {
                                                              return<IonSelectOption   key={index}  value={item.value} >{item.label}</IonSelectOption>
                                                        })}
                                                     </IonSelect>
                                                                </div>
                                                            </Grid>
                                                            <Grid item sm={4}>
                                                                <MTableToolbar {...propsCopy}
                                                                    searchAutoFocus={searchFocus}
                                                                    onSearchChanged={(text:string)=>{
                                                                        propsCopy.onSearchChanged(text);
                                                                        setSearchFocus(true)
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                    )
                                                },
                                             }}
                                  />} >
                        </Virtuoso>
                    </IonContent>

                    {/* <Table
                        data={dataSource}
                        columns={ isMobile ? columns_mobile : columns}
                        title={`Mint Schedule - ${date}`}
                        options={{
                            rowStyle:( rowData:any) =>  ({
                                fontWeight: timeCount (rowData.time) ? '900' : "",
                                backgroundColor : mode === 'dark' ? '' : '#F5F7F7',
                                color: mode === 'dark' ? "" : '#4B5563',
                                borderTop: mode === 'dark' ? "" : '1px solid #E3E8EA',
                            }),
                            paging: isPaging,
							columnsButton: true
                       }}
                        description={`Projects must have > 2,000 Discord members (with > 300 being online), and  > 1,000 Twitter followers before showing up on the list.
							\n"# Tweet Interactions" gets an average of the Comments / Likes / Retweets (over the last 5 tweets), and adds them.
							The Fox logo in the price is the official Token price that comes from the Fox Token Market.
							Rows in bold mean the mint comes out in two hours or less.
							`}
                    /> */}

                    {/* <IonModal isOpen={isOpen}  onDidDismiss={onClose as any} >
                          <IonContent>
                            {
                              splitCollectionName.length
                              && splitCollectionName.map(name => (
                                  <div key={name} className='text-center'>
                                    <span style={{color: 'white'}}>{name}</span> <br />
                                  </div>
                              ))
                            }
                          </IonContent>
                        </IonModal> */}

                </>
            )}
        </>
    );
}

// @ts-ignore
export default Schedule;
