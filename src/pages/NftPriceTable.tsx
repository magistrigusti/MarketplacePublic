import {IonLabel, IonContent, IonIcon, useIonToast, IonRefresher, IonRefresherContent} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import Loader from "../components/Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import meLogo from '../images/me.png';
import {Column} from '@material-table/core';
import Table from '../components/Table';
import moment from 'moment';
import {chatbubbleEllipsesOutline, eye, eyeOff, eyeOffOutline, eyeOutline, notifications} from "ionicons/icons";
import {useHistory} from "react-router";
import usePersistentState from '../hooks/usePersistentState';
import {RefresherEventDetail} from '@ionic/core';
import {Virtuoso} from 'react-virtuoso';

interface NftPriceTableProps {
    foo?: string;

    onSubmit(bar: string): unknown;
}

interface MintData {
    name: string;
    mintPrice: string;
    highestPrice: string;
    pctChange: number;
    meta: string | null;
    image: string;
    comments: string | null;
    meUrl: string;
    mintUrl: string;
    createdAt: string;
    updatedAt: string;
    numDiscordsAlerted: number;
    stillBeingTracked: number;
}

function NftPriceTable({foo, onSubmit}: NftPriceTableProps) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const history = useHistory();

    const [tableData, setTableData] = useState<MintData[]>([]);
    const [hideComments, setHideComments] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);

    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode] = usePersistentState("mode", "dark");

    const smallWidthpx = 768;

    const columns_mobile: Column<MintData>[] = [
        {
            title: 'Details',
            render: (record) => (
                <>
                    <b>Name : </b>{record?.image ?
                    <img className={`avatarImg ${!record.image ? 'hiddenImg' : ''}`} key={record.image} src={record.image}/> : null}
                    <span>{record ? record.name?.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : '-'}</span>
                    <span><br/><b>Mint Date : </b>{record ? moment(record.createdAt).fromNow() : "-"}</span>
                    <span><br/><b>Mint Price : </b>{record && record.mintPrice ? `${record.mintPrice} ◎` : '-'}</span>
                    <span><br/><b>High Price : </b>{record  && record.highestPrice && record.highestPrice !== null ? `${record.highestPrice} ◎` : "-"}</span>
                    <span><br/><b>% Change : </b>{record ? <span className={record.pctChange > 0 ? 'greenPctChange' : 'redPctChange'} hidden={!record.pctChange}>{record ? record?.pctChange?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}%</span> : '-'}</span>
                    <span><br/><b>Meta : </b>{record ? record.meta : '-'}</span>
                    <span className='flex flex-row items-center'><br/><b>ME URL : </b> {record ? <a href={record.meUrl} target="_blank" className="big-emoji" hidden={!record.meUrl || record.meUrl.length < 5}><img src={meLogo} className="me-logo ml-2"/></a> : '-'}</span>
                    <span><b>Mint URL : </b>{record ? <a href={record?.mintUrl} target="_blank" className="big-emoji" hidden={record.mintUrl.length < 5}> 🌐 </a> : "-"}</span>
                    <span><br/><b>Comments : </b>{record ? <span hidden={hideComments}>{record.comments}</span> : "-"}</span>
                </>
            ),
            customSort: (a, b) => a.name.localeCompare(b.name),
            searchable: true,
            customFilterAndSearch: (term, rowData) => rowData?.name.toLowerCase().includes(term.toLowerCase()),
        },

    ];
    const columns: Column<MintData>[] = [
        {
            title: 'Name',
            render: (record) => (
                <>
                    <img className={`avatarImg ${!record.image ? 'hiddenImg' : ''}`} key={record.image} src={record.image}/>
                    <span> {record.name.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())} </span>
                </>
            ),
            customSort: (a, b) => a.name.localeCompare(b.name),
            searchable: true,
            customFilterAndSearch: (term, rowData) => rowData?.name.toLowerCase().includes(term.toLowerCase()),
        },
        {
            title: 'Mint Date',
            render: (record) => (<span> {moment(record?.createdAt).fromNow()} </span>),
            customSort: (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
        },
        {
            title: 'Mint Price',
            customSort: (a, b) => +a.mintPrice - +b.mintPrice,
            render: (record) => <span>{record && record.mintPrice ? `${record.mintPrice} ◎ ` : '-' }</span>,

        },
        {
            title: 'High Price',
            customSort: (a, b) => +a.highestPrice - +b.highestPrice,
            render: (record) => <span>{record && record.highestPrice ? `${record.highestPrice} ◎` : "-"}</span>,

        },
        {
            title: '% change',
            customSort: (a, b) => a.pctChange - b.pctChange,
            render: (record) => (<span className={record?.pctChange > 0 ? 'greenPctChange' : 'redPctChange'} hidden={!record.pctChange}> {record ? record?.pctChange?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''} % </span>),
        },
        {
            title: 'Meta',
            sorting: false,
            render: (record) => <span>{record?.meta}</span>,
        },
        {
            title: 'ME URL',
            render: (record) => (
                <a href={record?.meUrl} target="_blank" className="big-emoji" hidden={!record.meUrl || record.meUrl.length < 5}>
                    <img src={meLogo} className="me-logo"/>
                </a>
            ),
            sorting: false
        },
        {
            title: 'Mint URL',
            render: (record) => (
                <a href={record?.mintUrl} target="_blank" className="big-emoji" hidden={record.mintUrl.length < 5}> 🌐  </a>
            ),
            sorting: false
        },
        {
            title: 'Comments',
            render: (record) => (
                // <span>{(record.comments.length > 90) ? record.comments.substr(0, 90 - 1) + '...' : record.comments}</span>
                <span hidden={hideComments}>{record?.comments}</span>
            ),
            sorting: false
        },
    ];


    /**
     * Use Effects
     */
    useEffect(() => {
        fetchTableData();
    }, []);

    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }
    }, [window.innerWidth])

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

// Pull to refresh function
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            fetchTableData()
            event.detail.complete();
        }, 1000);
    }

    const fetchTableData = async () => {

        setTableData([]);
        setIsLoading(true);

        instance
            .get(environment.backendApi + '/mintAlertsAutomatedStats')
            .then((res) => {
                setTableData(res.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("error when getting mint alerts automated: " + error);
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
                    buttons: [{text: 'X', handler: () => dismiss()}],
                });
                // if(msg.includes('logging in again')){
                //     history.push("/login");
                // }
            });
    }

    /**
     * Renders
     */

    return (
        <>

            {/*{*/}
            {/*    !tableData.length*/}
            {/*        ? <div className="pt-10 flex justify-center items-center">*/}
            {/*            <Loader/>*/}
            {/*        </div>*/}
            {/*        : <div className=" "> /!* max-w-fit mx-auto *!/*/}

            {/*            <Table*/}
            {/*                data={tableData}*/}
            {/*                columns={isMobile ? columns_mobile : columns}*/}
            {/*                title={"Mint Alerts Automated - Stats"}*/}
            {/*                description="These are mints that were posted in at least two discords, and sent to the #mint-alerts-automated channel"*/}
            {/*                actions={[*/}
            {/*                    {*/}
            {/*                        icon: () => <IonIcon icon={notifications}/>,*/}
            {/*                        tooltip: 'Alerts for new links',*/}
            {/*                        onClick: () => history.push('/alerts#ma'),*/}
            {/*                        isFreeAction: true,*/}
            {/*                    },*/}
            {/*                    {*/}
            {/*                        icon: hideComments ? () => <IonIcon icon={eye}/> : () => <IonIcon icon={eyeOff}/>,*/}
            {/*                        tooltip: hideComments ? "Show Comments" : "Hide comments",*/}
            {/*                        onClick: () => setHideComments(!hideComments),*/}
            {/*                        isFreeAction: true*/}
            {/*                    }*/}
            {/*                ]}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*}*/}

            <div className="m-3 relative bg-red-100 p-4 rounded-xl">
                <p className="text-lg text-red-700 font-medium">
                    <b>These are mints that 2 of our 15+ Discords worth several hundred SOL linked. You can click through a few pages to see when the rest of the columns were filled in. Currently pausing filling them in as need to find the mint name, mint price, and link to ME, and for most part these are just less than $5 degen mints. Will resume data parsing in near future</b>
                </p>
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                    !
                </span>
            </div>

            {
                !tableData.length
                    ? <div className="pt-10 flex justify-center items-center">
                        {isLoading ? <Loader/> : <div>No data available</div> }
                      </div>
                    : <div className=" "> {/* max-w-fit mx-auto */}
                        <IonContent className='h-screen' scroll-y='false'>
                            {isMobile ? <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullFactor={0.5} pullMin={100}  pullMax={200}>
                                <IonRefresherContent/>
                            </IonRefresher> : ''}

                            <Virtuoso className='h-full' totalCount={1}
                                      itemContent={() => <Table
                                          data={tableData}
                                          columns={isMobile ? columns_mobile : columns}
                                          options={{
                                              searchFieldStyle: {
                                                  marginLeft: '-24%',
                                                  marginTop: '2%',
                                                  paddingLeft: "4%",
                                                  borderRadius: 30,
                                                  borderWidth: 1
                                              },
                                              rowStyle: (rowData: any) => ({
                                                  backgroundColor: mode === 'dark' ? '' : '#F5F7F7',
                                                  color: mode === 'dark' ? "" : '#4B5563',
                                                  borderTop: mode === 'dark' ? "" : '1px solid #E3E8EA',
                                              }),
                                          }}
                                          title={"Mint Stats"}
                                          description="These are mints that were posted in at least two discords, and sent to the #mint-alerts-automated channel"
                                          actions={[
                                              {
                                                  icon: () => <IonIcon icon={notifications}/>,
                                                  tooltip: 'Alerts for new links',
                                                  onClick: () => history.push('/alerts#ma'),
                                                  isFreeAction: true,
                                              },
                                              {
                                                  icon: hideComments ? () => <IonIcon
                                                      icon={chatbubbleEllipsesOutline}/> : () => <IonIcon
                                                      icon={chatbubbleEllipsesOutline}/>,
                                                  tooltip: hideComments ? "Show Comments" : "Hide comments",
                                                  onClick: () => setHideComments(!hideComments),
                                                  isFreeAction: true
                                              }
                                          ]}
                                      />}/>
                        </IonContent>
                    </div>
            }

            {/*<div hidden={true}*/}
            {/*    className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>*/}
            {/*    <div className={`font-bold pb-3 w-full text-lg`}>Mint Alerts Automated - Custom Alerts</div>*/}
            {/*    <div>Note: for 3 NFT holders only</div>*/}

            {/*    <div>*/}
            {/*        <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below meta gets alerted in #mint-alerts-automated</label>*/}

            {/*        <IonList>*/}
            {/*            <IonItem>*/}
            {/*                <IonLabel>Staking/Token/Low Supply</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="biff" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Metaverse</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="griff" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Casino</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>P2E</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Bot / Sniper</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}

            {/*            <IonItem>*/}
            {/*                <IonLabel>Asian / Hong Kong devs</IonLabel>*/}
            {/*                <IonCheckbox slot="start" value="buford" />*/}
            {/*            </IonItem>*/}
            {/*        </IonList>*/}

            {/*        <IonButton color="success" className="text-sm" >*/}
            {/*            Submit*/}
            {/*        </IonButton>*/}
            {/*        <br/><br/>*/}


            {/*    </div>*/}

            {/*</div>*/}

        </>
    );
}

export default NftPriceTable;

