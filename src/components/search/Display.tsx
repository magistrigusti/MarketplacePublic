import { IonToggle } from "@ionic/react";
import {useEffect, useMemo, useState} from 'react';
import MessageListItem from "./MessageListItem";
import React from "react";
import {Chart} from 'react-chartjs-2';
import Cookies from 'universal-cookie';
import {constants} from "../../util/constants";
import './Display.css';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    ArcElement,
    registerables,
    defaults,
    ChartData,
} from 'chart.js';
import {Message} from "../../types/Message";
import MessageThread from "./MessageThread";
import {useParams} from "react-router";
import Loader from "../Loader";
import DisplayGraph from "./DisplayGraph";


ChartJS.register(...registerables);
ChartJS.register(
    ArcElement,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

defaults.color = '#FFFFFF';
const Display: React.FC<{
    // chartDataDailyCount?: any;
    // chartDataPerSource?: any;
    // chartHeight: number;
    messages: Message[];
    totalCount?: number;
    // isLoadingChart?: any;
    isLoadingMessages?: any;
}> = ({
        //   chartDataDailyCount,
        //   chartDataPerSource,
        //   chartHeight,
          messages,
          totalCount,
        //   isLoadingChart,
          isLoadingMessages
      }) => {

    /**
     * States & Variables
     */
    const cookies = useMemo(() => new Cookies(), []);
    const [showChart, setShowChart] = useState(String(cookies.get('showChart')) === 'false' ? false : true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const {id: word} = useParams<{ id: string; }>();

    const completelyHideChart = false; // useMemo(() => word.indexOf(" ") !== -1 ? true : false, [word]);

    const definedMessages = messages.filter(Boolean);
    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true)




    /**
     * Use Effects
     */
    useEffect(() => {
        cookies.set("showChart", String(showChart));
    }, [showChart, cookies])

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }else{
            setIsMobile(false)
        }
    }, [window.innerWidth])

    /**
     * Functions
     */

    /**
     * Renders
     */
    return (
        <>
            <div className={`py-10 ${isMobile ? 'px' : 'px-5'} messages my-2 overflow-y-scroll rounded-lg mt-10`}>
                {/* bar & line chart */}
                {/* <DisplayGraph {...{
                    chartDataDailyCount : chartDataDailyCount ? chartDataDailyCount: {},
                    chartDataPerSource : chartDataPerSource ? chartDataPerSource : {},
                    chartHeight,
                    isLoadingChart: isLoadingChart,
                }} /> */}

                {/* list of messages, ie. search results */}
                {messages.map((m, i) => {
                        return(<MessageListItem
                            onClick={() => {
                                setIsModalOpen(true)
                                if (m.source === 'Twitter') {
                                    const url = `https://twitter.com/${m.author}`;
                                    window.open(url, '_blank');
                                } else setSelectedMessage(m);
                            }}
                            message={m}
                            key={i}
                        />)
                        }
                )}

                {/*if you click on a message*/}
                {selectedMessage && (
                    <MessageThread onClose={() => setSelectedMessage(null)}  message={selectedMessage}  />
                        // isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                )}
            </div>
        </>
    );
}
export default Display;
