import {ChartData} from "chart.js";
import React, {useEffect, useMemo, useState} from "react";
import {instance} from "../axios";
import {dispLabelsDailyCount, getDailyCountData} from "../util/charts";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import {Chart} from "react-chartjs-2";
import Help from "../components/Help";
import {useIonToast} from "@ionic/react";
import {useHistory} from "react-router";

function StackedSearch({ foo, onSubmit }: any) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const history = useHistory();

    const [width, setWidth] = useState(window.innerWidth);

    /**
     * Use Effects
     */
    // for setting height of chart, depending on what width browser is
    const chartHeight = useMemo(() => {
            if(width > 1536) return 75;
            if(width > 1280) return 90;
            if(width > 1024) return 110;
            if(width > 768) return 155;
            if(width > 640) return 200;
            return 230;
        }, [width]);

    // resize window
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    /**
     * Functions
     */

    /**
     * Renders
     */

    /**
     * (Putting stacked graph stuff below...)
     */
    const defaultGraph : ChartData<any, string> = {
        labels: ["1"],
        datasets: [ { data: ["3"] } ],
    };

    // search vars
    const [searchValueStacked, setSearchValueStacked] = useState('');
    const [errorSearchStacked, setErrorSearchStacked] = useState('');

    const [graphStackedLoading, setGraphStackedLoading] = useState(false);
    const [stackedLineData, setStackedLineData] = useState(defaultGraph);

    // load search data from backend, for stacked line graph
    const doSearch = async (query : string) => {
        query = query.trim();

        try {
            setErrorSearchStacked("");
            setSearchValueStacked(query);

            if(query.length === 0) {

                setStackedLineData(defaultGraph);
                return;
            }

            if(query.length < 3){ return setErrorSearchStacked('Please search on 3 or more characters'); }
            if(query.split(' ').length > 8){ return setErrorSearchStacked('Please search on 8 words max'); }

            setGraphStackedLoading(true);
            setStackedLineData(defaultGraph);

            const { data: rawFetchedData } = await instance.post<
                {
                    name: string;
                    ten_day_count: {
                        count: number;
                        date: string;
                    }[];
                }[]
                >( '/getWordCount/', { array: query.split(' '), },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );


            const colorAry = ['rgb(255, 0, 0)',
                'rgb(153, 255, 51)',
                'rgb(0, 128, 255)',
                'rgb(127, 0, 255)',
                'rgb(255, 255, 255)',
                'rgb(255, 204, 204)',
                'rgb(102, 51, 0)',
                'rgb(255, 102, 102)'];

            let datasetsAry = [];
            for(let i in rawFetchedData){
                datasetsAry.push({
                    type: 'line' as const,
                    label:  rawFetchedData[i].name,
                    borderColor: colorAry[i],
                    borderWidth: 2,
                    fill: false,
                    data: getDailyCountData(rawFetchedData[i]),
                });
            }

            const labels = dispLabelsDailyCount( rawFetchedData[0]?.ten_day_count, true);

            // console.log(labels);
            // console.log(datasetsAry);

            setStackedLineData({
                labels: labels,
                datasets: datasetsAry,
            });

            // set various variables
            setGraphStackedLoading(false);

        } catch (error: any) {
            setGraphStackedLoading(false);

            console.error("try/catch in Home.tsx.doSearch: ", error);

            // if (e && e.response) {
            //     setErrorSearchStacked(String(e.response.data.body));
            // } else {
            //     setErrorSearchStacked('Unable to connect. Please try again later');
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

    return (
        <>


            {/* Stacked line Search stuff - The bit darker Gray Container */}
            <div
                className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4 mb-2`}
            >
                <div
                    className={`font-bold pb-1 ${
                        width <= 640 ? 'w-full' : 'w-96 '
                    }`}
                >
                    Compare multiple words on a line graph
                </div>

                <div className={`max-w-2xl my-2 flex space-x-2 items-center`}>
                    <SearchBar
                        initialValue=""
                        onSubmit={doSearch}
                        placeholder="Type to search"
						disableReset={false}
                    />
					<Help description={`Compares multiple single words against each other (ex. "portals enviro suites"). Each word will be graphed and you can compare the popularity of each word (useful to search on multiple mints in the morning and see which his more popular)`}/>
                </div>

                {/*--{width}--{chartHeight}--*/}

                {/*loading*/}
                {graphStackedLoading ? (
                        <div className="pt-10 flex justify-center items-center">
                            <Loader />
                        </div>
                    ) : // error
                    errorSearchStacked ? (
                        <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                            <p className="text-lg text-red-700 font-medium">
                                <b>
                                {(errorSearchStacked as string) ||
                                    'Unable to connect'}
                                </b>
                            </p>
                            <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                            !
                            </span>
                        </div>
                    ) : (
                        // graph itself
                        <>
                            { stackedLineData?.labels?.length === 0 ? (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium">
                                        <b> No data available </b>
                                    </p>
                                    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2"> ! </span>
                                </div>
                                ) : (
                                <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg default-chart-theme" hidden={ graphStackedLoading ||  stackedLineData.labels && stackedLineData.labels.length === 1 } >
                                    <Chart
                                        type="line"
                                        data={stackedLineData}
                                        height={chartHeight}
                                        key={chartHeight}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    reverse: true,
                                                },
                                                title: {
                                                    display: true,
                                                    text: '# of messages per day (from several Discords)',
                                                },
                                            },
                                            y: {
                                                suggestedMin: 0,
                                            },
                                        }}
                                    />
                                </div>
                            )}
                    </>
                       
                    )}

            </div>

        </>
    );
}
export default StackedSearch;

