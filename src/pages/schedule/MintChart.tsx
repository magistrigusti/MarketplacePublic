import { ChartData } from 'chart.js';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { IonIcon, useIonToast } from "@ionic/react";
import { Chart } from 'react-chartjs-2';
import "./MintChart.scss"
import { logoDiscord, logoTwitter, link, close } from 'ionicons/icons';



function MintChart({eventGraphData}: any) {
    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const defaultGraph: ChartData <any, string> = {
        labels: [],
        datasets: [],
    };
    // resize window
    const [width, setWidth] = useState(window.innerWidth);
    const [mintLineData, setmintLineData] = useState(defaultGraph);
    const chartsRef = useRef<HTMLDivElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // for setting height of chart, depending on what width browser is
    const tableHeight = useMemo(() => {
        if (width > 1536) return 100;
        if (width > 1280) return 140;
        if (width > 1024) return 130;
        if (width > 768) return 160;
        if (width > 640) return 180;
        return 200;
    }, [width]);

    // viewing the chart for a calendar
    const viewChart = () => {

        // now sort again so chart can be right
        eventGraphData.data.data = eventGraphData.data.data.reverse();

        if(eventGraphData){
            setmintLineData(defaultGraph);
                const labels = eventGraphData.data.data.map((el: { date: Date }) => {
                    return moment(el.date,'MM/DD/YYYY').format('l'); // DD MM YYYY
                });

                const discordAllData = eventGraphData.data.data.map((el: { discord_all: any }) => {
                    return parseInt(el.discord_all);
                });
                const twitterFollowersData = eventGraphData.data.data.map((el: { twitter_all: any }) =>
                        parseInt(el.twitter_all)
                );
                const discordOnlineData = eventGraphData.data.data.map((el: { discord_online: any }) =>
                        parseInt(el.discord_online)
                );

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Discord All',
                        borderColor: '#14F195',
                        data:discordAllData,
                        fill: {
                            target: 'origin',
                            above: '#14F19505',
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Discord Online',
                        borderColor: '#9052F8' ,
                        data:discordOnlineData,
                        fill: {
                            target: 'origin',
                            above: '#9052F805',
                        },
                    },
                    {
                        type: 'line' as const,
                        yAxisID: 'y0',
                        label: 'Twitter Followers',
                        borderColor:'#0052FF',
                        data: twitterFollowersData, // tweetInteractionsData
                        fill: {
                            target: 'origin',
                            above: '#0052FF05',
                        },
                    },

                ];
                setmintLineData({
                    labels: labels,
                    datasets: datasetsAry,
                });
        }




    };

    useEffect(() => {
        viewChart();
    }, [eventGraphData]);

    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    return (
        <>
            <div className="calendarCharts  default-chart-theme " css={css` background-color: var(--ion-color-step-50); `} ref={chartsRef} >
                <div className="chart">
                    <Chart type="line" data={mintLineData} height={tableHeight}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            plugins: {
                                legend: { display: false},
                                tooltip: { mode: 'index', intersect: false, },
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        precision: 0
                                    },
                                  },
                              },
                            elements: {
                                point: {
                                    radius: 0,
                                },
                            },
                        }}
                    />
                </div>
                <div className="items-center flex justify-center pt-5 flex-row pb-4">
                    <div className='flex items-center flex-row' style={{color:'#14F195'}}><IonIcon icon={logoDiscord} className="big-emoji"/><span className='ml-1'>{isMobile ? 'Disc All' : 'Discord All'}</span></div>
                    <div className='flex items-center flex-row ml-4' style={{color:'#9052F8'}}><IonIcon icon={logoDiscord} className="big-emoji"/><span className='ml-1'>{isMobile ? 'Disc On' : 'Discord Online'}</span></div>
                    <div className='flex items-center flex-row ml-4' style={{color:'#0052FF'}}><IonIcon icon={logoTwitter} className="big-emoji"/><span className='ml-1'>{isMobile ? 'Twitter' : 'Twitter Followers'}</span></div>
                </div>
            </div>
        </>
    );
}

export default MintChart;
