import { ChartData } from 'chart.js';
import moment from 'moment';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import { FoxTokenData } from '../types/FoxTokenTypes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import useFoxTokenChartCookies from './useFoxTokenChartCookies';
import { css } from '@emotion/react';
import { useIonToast } from "@ionic/react";

import { Chart } from 'react-chartjs-2';
import "./FoxTokenCharts.scss"
import { async } from '@firebase/util';
import Loader from './Loader';
// import { Chart, Interaction } from 'chart.js';
// import {CrosshairPlugin,Interpolate} from 'chartjs-plugin-crosshair';
function FoxTokenCharts({ token, name, floorPrice, totalTokenListings, }: FoxTokenData) {
    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();

    // resize window
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);


    // for setting height of chart, depending on what width browser is
    const tableHeight = useMemo(() => {
        if (width > 1536) return 100;
        if (width > 1280) return 105;
        if (width > 1024) return 120;
        if (width > 768) return 160;
        if (width > 640) return 180;
        return 200;
    }, [width]);

    const [tableData, setTableData] = useState<FoxTokenData[]>([]);
    // const [fullTableData, setFullTableData] = useState<FoxTokenData[]>([]);
    const [tokenClickedOn, setTokenClickedOn] = useState();
    const [isChartHidden, setIsChartHidden] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    // const [mySolBalance, setMySolBalance] = useState("");
    // const [mySplTokens, setMySplTokens]: any = useState([]);
    // const [viewMyTokensClicked, setViewMyTokensClicked] = useState(false);
    // const smallWidthpx = 768;

    const defaultGraph: ChartData <any, string> = {
        labels: [],
        datasets: [],
    };
    const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const [foxSalesData, setFoxSalesData] = useState(defaultGraph);
    // const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);
    const chartsRef = useRef<HTMLDivElement | null>(null);

    const firstUpdate = useRef(true);

    const cookies = useMemo(() => new Cookies(), []);

    const { chartDateSelected, lineColorSelected, shadedAreaColorSelected } = useFoxTokenChartCookies();

    // user clicked change colour

    // BUG-92-commented-out-2
    // when above clicked, will redraw the chart
    // useEffect(() => {
    //     if (firstUpdate.current) {
    //         firstUpdate.current = false;
    //         return;
    //     }
    //
    //     // redraw the chart
    //     viewChart();
    //
    // }, [lineColorSelected, shadedAreaColorSelected]);

    // BUG-92-commented-out-3
    // user clicked the radio for the dates in the chart
    // when above radio clicked, will redraw the chart
    // useEffect(() => {
    //     if (firstUpdate.current) {
    //         firstUpdate.current = false;
    //         return;
    //     }
    //
    //     viewChart();
    // }, [chartDateSelected, lineColorSelected, shadedAreaColorSelected]);


    const refreshChart = () => {
        viewChart()
    }
    // viewing the chart for a token
    const viewChart = () => {
        // token: string, name: string
        // reset the chart
        setIsLoading(true)
        setFoxLineData(defaultGraph);

        // @ts-ignore
        setTokenClickedOn(name ? `${name} (${token})` : token);

        // console.log(token);

        // get the price/listings history for a SINGLE token
      instance
            .get(  environment.backendApi + '/receiver/foxTokenHistory?token=' + token )
            .then((res) => {
                setIsLoading(false)
                const labels = res?.data?.map((el: { createdAt: any }) => {
                    // user can set this in the chart
                    if (chartDateSelected === 'fromNow') {
                        return moment(el.createdAt).fromNow()
                    } else {
                        return moment(el.createdAt).format('MM-DD HH:MM');
                    }
                });
                const lineData = res?.data?.map((el: { floorPrice: any }) => {
                    return parseFloat(el.floorPrice);
                });

                const listingsData = res?.data?.map(
                    (el: { totalTokenListings: any }) =>
                        parseInt(el.totalTokenListings)
                );

                if (lineData.length === 0 && listingsData.length === 0) {
                    present({
                        message: 'Unable to get price & listings data on this!',
                        color: 'danger',
                        duration: 8000,
                    });
                }

                // graph latest point...
                for (let t in tableData) {
                    if (tableData[t].token === token && tableData[t].floorPrice) {
                        labels.push('a few seconds ago');
                        lineData.push(tableData[t].floorPrice);
                        listingsData.push(tableData[t].totalTokenListings);
                        break;
                    }
                }

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y1',
                        label: 'Price',
                        borderColor: lineColorSelected,
                        data: lineData,
                        // data: [10,10,150,10,50,12,85,45,78,36],
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,
                        },
                    },
                    {
                        type: 'line' as const,
                        label: 'Listings',
                        // borderColor: '#9945FF',
                        yAxisID: 'y0',
                        borderColor: '#9945FF',
                        data: listingsData,
                    },
                ];

                // console.log(labels);
                // console.log("Arrays ::: foxLineData ===>>> ", foxLineData)
                // console.log(datasetsAry);
                setFoxLineData({
                    labels:labels,
                    datasets: datasetsAry,
                    });
                // removeChartHighValue(datasetsAry,labels)
                
            })
            .catch((err) => {
                setIsLoading(false)
                console.error( 'error when getting fox token history data: ' + err );
                present({
                    message: 'Error - unable to load chart data. Please refresh and try again',
                    color: 'danger',
                    duration: 8000,
                    buttons: [{ text: 'hide', handler: () => dismiss() }],
                });
            });

        // REMOVING-FF-FOR-NOW
        // also get the sales history for that token, from FF
        instance
            .post(environment.backendApi + '/receiver/foxSales', {token: token})
            .then((res) => {
                // now graph it!
                if(res.data.data?.length === 0){
                    setIsChartHidden(true)
                    present({
                        message: 'No sales data found!',
                        color: 'danger',
                        duration: 5000
                    });
                }else {
                    setIsChartHidden(false)
                    setFoxSalesData({
                        labels: res.data.labels,
                        datasets: [
                            {
                                type: 'line' as const,
                                label: 'Price',
                                yAxisID: 'y0',
                                borderColor: lineColorSelected,
                                // tension: 0.1,
                                data: res.data.data,
                                showLine: false
                            },

                        ]
                    });
                }

            });

            // and then get the latest sale for that token
            instance
                .post(`${environment.backendApi}/receiver/foxTokenLatestSale`, { tokens: [token] })
                .then((res) => {
                    // (nice to have) Update table data with the last listing date
                    // sales = res.data.data.sales
                });
    };

    // need to call it duh...
    useEffect(() => {
        // BUG-92-commented-out-1
        // if (firstUpdate.current) {
        //     firstUpdate.current = false;
        //     return;
        // }

        viewChart();

    }, []);

    // remove initial high value of graph price
    // const removeChartHighValue = (data : any, labels:any) =>{
    // let dataLength = data[0]?.data?.length

    // if(dataLength > 8){
    //     let arrayLength = (dataLength * 10) / 100
    //     // let arrayLength = 5
    //     let tempArray = []
    //     let arrayOfIndex: any[] = []
    //     let sum : any 

    //     for(let i=0; i<arrayLength; i++){
    //         tempArray.push(data[0]?.data[i])
    //     }

    //     for(let i=0; i<tempArray.length; i++){
    //         sum = tempArray[i]- tempArray[i + 1]
    //         arrayOfIndex.push(sum)
    //     }
    //     arrayOfIndex.splice(arrayOfIndex.length-1 , 1)
    //     const maxValue = Math.max.apply(null, arrayOfIndex);
    //     const valueIndex = arrayOfIndex.indexOf(maxValue)
    //     const originalValue = tempArray[valueIndex+1]
    //     let finalGraphdata = []
    //     let lables = []

    //     if(maxValue >((originalValue*30/100)+originalValue) ){
    //         for(let i=valueIndex+1; i<data[0]?.data.length; i++ ){
    //             finalGraphdata.push(data[0]?.data[i])
    //             }

    //         for(let i=valueIndex+1; i<data[0]?.data.length; i++ ){
    //             lables.push(labels[i])
    //             }
    //             setFoxLineData({
    //                 labels:lables,
    //                 datasets: finalGraphdata
    //                 });
    //     }else{
    //           setFoxLineData({
    //             labels:labels,
    //             datasets: data,
    //             });
    //     }
    //     }
    //     else if (dataLength > 2){

    //     if((data[0].data[0]-data[0].data[1]) > (data[0].data[1]-data[0].data[2]) && (data[0].data[1]-data[0].data[2]) >= 0){
    //         data[0]?.data.splice(0, 1)
    //         setFoxLineData({
    //             labels: removeLable(labels),
    //             datasets: data
    //         });
    //     }else{
    //         setFoxLineData({
    //             labels: labels,
    //             datasets: data
    //         });
    //     }

    //     }else{
    //         setFoxLineData({
    //             labels:labels,
    //             datasets: data
    //         });
    //     }
        
    // }

// remove initial high value of graph lable
    const removeLable = (labels:any) =>{
        labels.splice(0,1)
        return(labels)
    }
 
    return (
        <>
            <div className='text-lg flex justify-center default-chart-theme pt-2 ' > {isLoading ? '' : <div onClick={()=> refreshChart()} className ='underline text-blue-600 cursor-pointer'>Refresh chart</div>}</div>
            <div className="foxTokenCharts px-5 gap-4 grid grid-cols-12 default-chart-theme w-full" css={css` background-color: var(--ion-color-step-50); `} ref={chartsRef}>
                <div className="chart chart-width">
                    {isLoading ? <div className='flex justify-center'><Loader/></div> : 
                        <Chart type="line" data={foxLineData} height={tableHeight}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                // https://stackoverflow.com/questions/42804237/hover-mode-on-chart-js
                                hover: {
                                    mode: 'nearest',
                                    intersect: true
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                    },
                                    title: {
                                        display: false,
                                        text: tokenClickedOn
                                            ? tokenClickedOn + ' - Price'
                                            : 'Price  ',
                                    },
                                    tooltip: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    // tooltip: {
                                    //     enabled: true,
                                    //     usePointStyle: true,
                                    //     callbacks: {
                                    //         // To change title in tooltip
                                    //         title: (data: any) => { return data[0].parsed.x },
                                    //
                                    //         // To change label in tooltip
                                    //         label: (data: any) => {
                                    //             console.log(data);
                                    //             return data.parsed.y === 2 ? "Good" : "Critical"
                                    //         }
                                    //     },
                                    // },
                                },
                                scales: {
                                    // https://www.chartjs.org/docs/latest/axes/cartesian/
                                    // https://stackoverflow.com/questions/51296950/charts-js-graph-with-multiple-y-axes
                                    // yAxes: [
                                    //     {
                                    //         display: true,
                                    //         position: 'left',
                                    //         type: 'linear',
                                    //         // scaleLabel: {
                                    //         //     display: true,
                                    //         //     labelString: 'USD',
                                    //         //     beginAtZero: true,
                                    //         // },
                                    //     },
                                    // ],
                                    y0: {
                                        stacked: true,
                                        type: 'linear',
                                        position: 'right',

                                        // label: {
                                        //     display: true,
                                        //     labelString: 'Listings',
                                        // },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Listings',
                                        },
                                        grid: {
                                            color: '#b3b3ff',
                                        },
                                        suggestedMin: 0,
                                        title: {
                                            display: true,
                                            text: 'Listings',
                                        },
                                    },
                                    y1: {
                                        stacked: false,
                                        type: 'linear',
                                        position: 'left',
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Price',
                                        },
                                        suggestedMin: 0,
                                        title: {
                                            display: true,
                                            text: 'Price',
                                        },
                                    },
                                    x: {
                                        ticks: {
                                            autoSkip: true,
                                            maxTicksLimit: 8,
                                        },
                                    },
                                },
                                // get rid of points on graph
                                elements: {
                                    point: {
                                        radius: 0,
                                    },
                                },
                            }}
                        />
                    }

                    {/*// REMOVING-FF-FOR-NOW*/}
                    {/*sales data*/}
                    <Chart hidden={isChartHidden} className='mt-6' type="line" data={foxSalesData} height={tableHeight / 1.5}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: 'Sales (note the Sales & Price graph do NOT start at the same time)',
                                },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        autoSkip: true,
                                        maxTicksLimit: 8,
                                    },
                                },
                            },
                            elements: {
                                point:{
                                    radius: 3
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default memo(FoxTokenCharts);
