import React, {useCallback, useMemo, useRef} from 'react';
import Display from '../components/search/Display';
import {useState, useEffect} from 'react';
import { IonButton, IonContent, IonIcon, IonPage, IonRefresher, IonRefresherContent, useIonToast, } from '@ionic/react';
import './Search.css';
import {useHistory, useParams} from 'react-router';
import {instance} from '../axios';
import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {SearchResponse} from '../types/SearchResponse';
import {dispLabelsDailyCount, getDailyCountData} from '../util/charts';
import DisplayGraph from '../components/search/DisplayGraph';
import Loader from '../components/Loader';
import SearchSkeleton from '../components/search/SearchSkeleton';
import {AppComponentProps} from '../components/Route';
import { RefresherEventDetail } from '@ionic/core';
import { filterCircleOutline } from 'ionicons/icons';
import Filters from '../components/search/Filters';


const Search: React.FC<AppComponentProps> = ({contentRef}) => {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const history = useHistory();

    const [width, setWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(0);
    const [showFoxTokenLink, setShowFoxTokenLink] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState(false);
    const [showGraph, setShowGraph] = useState<boolean>(false)

    // const [searchText, setSearchText] = useState(useParams<{id: string}>());

	// For open and close filters
    const [toggleFilters, setToggleFilters] = useState(false);
    // Sources from the response
    const [sources, setSources] = useState<string[]>([]);
    // Selected sources from filters
    const [selectedSources, setSelectedSources] = useState<any[]>([]);
    // Change when Apply button from filter clicked
    const [sourceChange, setSourceChange] = useState(false);
    // Filters start date
    const [startDate, setStartDate] = useState('');
    // filters end date
    const [endDate, setEndDate] = useState('');


    const {id: searchText} = useParams<{
        id: string;
    }>();
    /**
     * Use Effects
     */
        // for setting height of chart, depending on what width browser is
    const chartHeight = useMemo(() => {
            if (width > 1536) return 100;
            if (width > 1280) return 115;
            if (width > 1024) return 135;
            if (width > 768) return 180;
            if (width > 640) return 225;
            return 140;
        }, [width]);

    const reset =() => {
        setSources([]);
        setSelectedSources([]);
        setStartDate('');
        setEndDate('');
        setSourceChange(false);
    }


    // resize window
    useEffect(() => {

        function resizeWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }
    }, [window.innerWidth])

    // Whenever new word searched current page will set to its default value i.e. 0
    useEffect(() => {
        setCurrentPage(0);
    }, [searchText])

    useEffect(() => {
      if(searchText?.length >= 43 && searchText?.length <= 44){
        setShowFoxTokenLink(true)
      }else{
        setShowFoxTokenLink(false)
      }
    }, [searchText])


    /**
     * Functions
     */

    // Pull to refresh function
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            fetchSearchMessages();
            fetchGraph();
            event.detail.complete();
        }, 1000);
    }

    const useMountEffect = (fun: any) => useEffect(fun, []);

    useMountEffect(() => contentRef?.scrollToTop());

    const handlePage = (type: string) => {
        contentRef?.scrollToTop(800)
        if (type === 'next' && (!messageQuery.isPreviousData && messageQuery.data.hasMore)) setCurrentPage(currentPage + 1)
        else setCurrentPage(currentPage - 1)
    }

    const fetchGraph = async () => {
        try {
            const {data} = await instance.post<SearchResponse>(
                '/search/',
                {
                    word: searchText,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (e) {
            return {
                messages: [...Array(20).keys()].map(() => undefined),
                totalCount: 20,
                word: searchText,
                ten_day_count: [],
                source: []
            };

            // console.error('try/catch in Search.tsx: ', e);
            // const error = e as Error & { response?: AxiosResponse };
            //
            // if (error?.response) {
            //     throw new Error(String(error.response.data.body));
            // } else {
            //     throw new Error('Unable to connect. Please try again later');
            // }
        }
    }

    const fetchSearchMessages = async () => {
        try {
            const {data} = await instance.post<SearchResponse>(
                '/searchMessages/',
                {
                    word: searchText,
                    pageNumber: currentPage,
                    // not sure why you would want to pss their username...commenting this out
                    // discordUsername: '... ...';    // <- Took from the API response "/users/@me" from the postman. Need to change,
                    pageSize: 100, // doing 10 from backend (discord) - search.js ... 100 from frontend (website) - search.tsx
					source: selectedSources,
                    fromDate: startDate
                        ? new Date(startDate).toISOString()
                        : undefined,
                    toDate: endDate
                        ? new Date(endDate).toISOString()
                        : undefined,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
			if (data?.messages?.length > 0) {
                const arr: string[] = [];
                data.messages.forEach((msg) => {
                    if (msg && !arr.includes(msg.source)) {
                        arr.push(msg.source);
                    }
                });
                //To sort it for showing in the dropdown alphabetically
                arr.sort();
                setSources(arr);
            }
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            // if (error && error.response) {
            //     throw new Error(String(error.response.data.body));
            // } else {
            //     throw new Error('Unable to connect. Please try again later');
            // }

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
        }
    }

    const graphQuery = useQuery(['messages', searchText], fetchGraph,
        {
            initialData: {
                messages: [...Array(20).keys()].map(() => undefined),
                totalCount: 20,
                word: searchText,
                ten_day_count: [],
                source: []
            },
            select: (data: any) => {

                // in case couldn't search on this
                if (data?.error && data?.body) {
                    throw new Error(String(data.body));
                }
                let datasetForChartDailyCount

                if(data){
                    datasetForChartDailyCount = getDailyCountData(data);
                }

                const chartDataDailyCount = {
                    labels: dispLabelsDailyCount(data?.ten_day_count, true),
                    datasets: [
                        {
                            type: 'line' as const,
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 2,
                            fill: false,
                            data: datasetForChartDailyCount,
                        }
                    ],
                }
                const sourceToAry = data.source;
                let labelsPerSource = [];
                let dataPerSource: any = [];
                for (let i in sourceToAry) {
                    labelsPerSource.push(sourceToAry[i][0]);
                    dataPerSource.push(sourceToAry[i][1]);
                }
                const chartDataPerSource = ({
                    labels: labelsPerSource,
                    datasets: [
                        {
                            type: 'bar' as const,
                            backgroundColor: 'rgb(75, 192, 192)',
                            data: dataPerSource,
                            borderColor: 'white',
                            borderWidth: 2,
                        }
                    ],
                });
                return {
                    ...data,
                    chartDataDailyCount,
                    chartDataPerSource
                }
            },
            retry: false
        })
    const messageQuery = useQuery([searchText, currentPage, sourceChange], fetchSearchMessages, {
        keepPreviousData: true,
        select: (data: any) => {
            // in case couldn't search on this
            if (data?.error && data.body) {
                throw new Error(String(data?.body));
            }
            if (data?.totalCount > 100) {
                data.hasMore = true;
            }
            return {
                ...data,
            }
        },
        retry: false
    })

    /**
     * Renders
     */

    return (
        <React.Fragment>

            {/* if need to tell the user of errors */}
            {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
            {/*    <p className="text-lg text-red-700 font-medium">*/}
            {/*        <b>Sorry some old data was inadvertently deleted, causing charts to reset. They'll fill back in as people type about them, from June 11 and on</b>*/}
            {/*    </p>*/}
            {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
            {/*        !*/}
            {/*    </span>*/}
            {/*</div>*/}

            {/* ERROR bar */}
            {graphQuery?.isError || messageQuery?.isError || messageQuery?.data?.error || graphQuery?.data?.error ? (
                <>
                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                    <p className="text-lg text-red-700 font-medium">

                        {/* No results found */}
                        <b>{(messageQuery?.error as Error)?.message || (graphQuery?.error as Error)?.message || 'Unable to connect, please try again later'}</b>
                    </p>
                    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                        !
                    </span>
                </div>
                {
                    showFoxTokenLink ? <div className='text-center text-lg cursor-pointer text-blue-500 mt-4' onClick={() => history.push( { pathname: '/foxtoken',search: searchText })}>Searching for a token? Click here to search on this in the Fox Token page</div> : ''
                }
                </>
                // actual content
            ) : (
                <>
                {isMobile ? <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullFactor={0.5} pullMin={100} pullMax={200} >
                                <IonRefresherContent/>
                            </IonRefresher> : ''}
                    {graphQuery?.isFetching ? <div className=" m-16 flex justify-center items-center"><Loader/></div> :
                        graphQuery?.isError ? <p className="text-lg text-red-700 font-medium">
                                <b>{"Error while loading message"}</b>
                            </p> :

                            <DisplayGraph {...{
                                chartDataDailyCount:  graphQuery?.data.chartDataDailyCount,
                                chartDataPerSource:  graphQuery?.data.chartDataPerSource,
                                chartHeight,
                                isLoadingChart: graphQuery?.isLoading,
                                totalCount:  messageQuery?.data?.totalCount
                            }} />

                            }
                    {/* Displaying the custom skeleton loader while fetching */}
                    {messageQuery?.isFetching ?
                        new Array(10).fill(0).map((_, i) => <SearchSkeleton key={i}/>) :
                         messageQuery?.isError ? <p className="text-lg text-red-700 font-medium">
                                <b>{"Error while loading message"}</b>
                            </p> :
                            (<div className="relative">
                                <div className="absolute right-0 mt-2">
                                    {/*The button used to open the filter menu*/}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setToggleFilters(!toggleFilters);}}
                                        id="filter"
                                        className="my-2 mr-2 h-full z-50 focus:outline-none"
                                    >
                                        <IonIcon icon={filterCircleOutline} className="w-10 h-10 z-40" />
                                    </button>
                                     {/* Filter implemented for filter date and source wise */}
                                    {toggleFilters && (
                                        <div className='absolute right-8 top-10 z-50'>
                                            <Filters
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                                sources={sources}
                                                selectedSources={selectedSources}
                                                onReset={reset}
                                                setSelectedSources={setSelectedSources}
                                                setSourceChange={setSourceChange}
                                                setToggleFilters={setToggleFilters}
                                            />
                                        </div>
                                    )}
                                </div>
                                <Display
                                    {...{
                                        messages: messageQuery?.data?.messages ?? [],
                                        totalCount: messageQuery?.data?.totalCount,
                                        }
                                    }
                                />
                        </div>)
                    }
                    {/*The footer stuff (scroll to top)*/}
                    {(messageQuery?.data?.totalCount ?? 0) > 5 && (
                        <>
                            {(currentPage != 0 && !messageQuery.isFetching) &&
                                <IonButton onClick={() => handlePage('previous')}>Previous</IonButton>}
                            {(!messageQuery.isPreviousData && messageQuery.data.hasMore && !messageQuery.isFetching) &&
                                <IonButton onClick={() => handlePage('next')} className="ml-4">Next</IonButton>}

                            {!messageQuery.isFetching &&
                                <IonButton onClick={() => contentRef && contentRef.scrollToTop(800)} className="float-right mt-1" >
                                    Scroll to Top
                                </IonButton>}
                        </>
                    )}

                    <div className="m-3 relative bg-blue-100 p-4 rounded-xl mt-16">
                        <p className="text-lg text-blue-700 font-medium">
                            {/*worth 740+ SOL*/}
                            <b>
                                Search results are based off 18+ private Discords (blue chips and top alpha Discords). Discord & user names are randomized for privacy.
                                {/*This means that your search results are coming from Blue Chip DAOs, and all of the messages they type in their main alpha chat are being shown above.*/}
                            </b>
                        </p>
                        <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                            !
                        </span>
                    </div>

                </>
            )}
        </React.Fragment>
    );
};

export default Search;
