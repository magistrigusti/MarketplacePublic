import { IonContent, useIonToast } from '@ionic/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useQuery as useReactQuery } from 'react-query';
import { Virtuoso } from 'react-virtuoso';
import { instance } from '../../axios';
import { Column } from '@material-table/core';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import usePersistentState from '../../hooks/usePersistentState';
import moment from 'moment';


interface guildData {
    id: string;
    name: string;
    createdAt:string;
    analyticsWebhookChannel:string;
    analyticsWebhookLastSendDate:string;
    dailyMintsWebhookChannel:string;
    dailyMintsWebhookLastSendDate:string;
    discordGuildId:string;
    guildOwnerDiscordId:string;
    iconUrl:string;
    magicedenSolModule:boolean;
    mintInfoModule:boolean;
    oneHourMintInfoWebhookChannel:string;
    oneHourMintInfoWebhookLastSendDate:string;
    tokenModule:boolean;
    updatedAt:string;
}




function ViewGuild() {
    const [present, dismiss] = useIonToast();
    const [isMobile, setIsMobile] = useState(false);
    const [mode] = usePersistentState('mode', 'dark');
    const [isModeGuild, setIsModeGuild] = useState<boolean>(true)


    const columns: Column<guildData>[] =
        isModeGuild ? [
            {
                title: 'Name',
                customSort: (a: any, b: any) => a.name - b.name,
                render: (record) => <span>{record?.name ? record?.name : '-'}</span>,
            },
            {
                title: 'Created At',
                customSort: (a: any, b: any) => a.name - b.name,
                render: (record) => <span>{record?.createdAt ? record?.createdAt : '-'}</span>,
            },
        ] : [
        {
            title: '',
            render: (record) => <img className={`avatarImg ${!record.iconUrl ? 'hiddenImg' : ''}`} key={record.iconUrl} src={record.iconUrl} />,
        },
        {
            title: 'Name',
            customSort: (a: any, b: any) => a.name - b.name,
            render: (record) => <span>{record?.name ? record?.name : '-'}</span>,
        },
        {
            title: 'Created At',
            render: (record) => <span>{ record?.createdAt ?  moment(record?.createdAt).fromNow() : '-'}</span>,
        },
            {
                title: 'Discord ID',
                render: (record) => <span>{ record?.discordGuildId }</span>,
            },
            {
                title: 'Owner / Admin / Manager ID',
                render: (record) => <span>{ record?.guildOwnerDiscordId }</span>,
            },
        {
            title: 'Analytics Webhook Channel',
            render: (record) => <span>{record?.analyticsWebhookChannel ? record?.analyticsWebhookChannel : '-'}</span>,
        },
        {
            title: 'Analytics Webhook LastSendDate',
            render: (record) => <span>{record?.analyticsWebhookLastSendDate ? moment(record?.analyticsWebhookLastSendDate).fromNow() : '-'}</span>,
        },
        {
            title: 'Daily Mints Webhook Channel',
            render: (record) => <span>{record?.dailyMintsWebhookChannel ? record?.dailyMintsWebhookChannel : '-'}</span>,
        },
        {
            title: 'DailyMints Webhook LastSendDate',
            render: (record) => <span>{ record?.dailyMintsWebhookLastSendDate ? moment(record?.dailyMintsWebhookLastSendDate).fromNow() : '-'}</span>,
        },
        {
            title: 'Magiceden Sol Module',
            render: (record) => <span>{record?.magicedenSolModule ? record?.magicedenSolModule?.toString() : '-'}</span>,
        },
        {
            title: 'Mint Info Module',
            render: (record) => <span>{record?.mintInfoModule ? record?.mintInfoModule?.toString() : '-'}</span>,
        },
        {
            title: 'One Hour Mint Info Webhook Channel',
            render: (record) => <span>{record?.oneHourMintInfoWebhookChannel ? record?.oneHourMintInfoWebhookChannel : '-'}</span>,
        },
        {
            title: 'One Hour Mint Info Webhook LastSendDate',
            render: (record) => <span>{record?.oneHourMintInfoWebhookLastSendDate ? moment(record?.oneHourMintInfoWebhookLastSendDate).fromNow() : '-'}</span>,
        },
        {
            title: 'Token Module',
            render: (record) => <span>{record?.tokenModule ? record?.tokenModule?.toString() : '-'}</span>,
        },
        {
            title: 'Updated At',
            render: (record) => <span>{record?.updatedAt ? moment(record?.updatedAt).fromNow() : '-'}</span>,
        },
    ];



    const columns_mobile: Column<guildData>[] =
    isModeGuild ? [
        {
            render: (record: any, index) => (
                <>
                    {<span><b></b>{record?.name} </span>}
                    {/*{<span><br/><b>Created At : </b>{ record?.createdAt ?  moment(record?.createdAt).fromNow() : '-'}</span>}*/}
                </>
            )
        },
    ] :  [
        {
            render: (record: any, index) => (
                <>
                    {<><span><b>Name : </b>{record?.iconUrl ? <img className={`avatarImg ${!record.iconUrl ? 'hiddenImg' : ''}`} key={index} src={record?.iconUrl} /> : ''}  {record?.name} </span> </>  }
                    {<span><br/><b>Created At : </b>{ record?.createdAt ?  moment(record?.createdAt).fromNow() : '-'}</span>}
                    {<span><br/><b>Analytics Webhook Channel : </b>{record?.analyticsWebhookChannel ? record?.analyticsWebhookChannel : '-'}</span>}
                    {<span><br/><b>Analytics Webhook LastSendDate : </b>{record?.analyticsWebhookLastSendDate ? moment(record?.analyticsWebhookLastSendDate).fromNow() : '-'}</span>}
                    {<span><br/><b>Daily Mints Webhook Channel : </b>{record?.dailyMintsWebhookChannel ? record?.dailyMintsWebhookChannel : '-'}</span>}
                    {<span><br/><b>DailyMints Webhook LastSendDate : </b>{record?.dailyMintsWebhookLastSendDate ? moment(record?.dailyMintsWebhookLastSendDate).fromNow() : '-'}</span>}
                    {<span><br/><b>Magiceden Sol Module : </b>{record?.magicedenSolModule ? record?.magicedenSolModule?.toString() : '-'}</span>}
                    {<span><br/><b>Mint Info Module : </b>{record?.mintInfoModule ? record?.mintInfoModule?.toString() : '-'}</span>}
                    {<span><br/><b>One Hour Mint Info Webhook Channel : </b>{record?.oneHourMintInfoWebhookChannel ? record?.oneHourMintInfoWebhookChannel : '-'}</span>}
                    {<span><br/><b>Token Module : </b>{record?.tokenModule ? record?.tokenModule?.toString() : '-'}</span>}
                    {<span><br/><b>Updated At : </b>{record?.updatedAt ? moment(record?.updatedAt).fromNow() : '-'}</span>}
                </>
            )
        },
    ];




    // fetch guildData
    let fetchGuildData = async () => {
        try {
            const { data: { guilds }, } = await instance.get( '/guilds/showGuildsDetails' );
            return guilds as guildData[];
        } catch (e) {
            console.error('try/catch ViewGuild: ', e);
            const error = e as Error & { response?: AxiosResponse };
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
        }
    };

    // guilddat quary
    const {
        isLoading: guildLoading,
        isError,
        data: guildData,
        error,
    } = useReactQuery('guidData', fetchGuildData);


    // check isMobile
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    useEffect(() => {
        if(guildData){
            if(guildData[0].discordGuildId){
                setIsModeGuild(false)
            }else{
                setIsModeGuild(true)
            }
        }

    }, [guildData])


    return (
        <div>
            {!guildData?.length ? (
                <div className="pt-10 flex justify-center items-center">
                    <Loader />
                </div>
            ) :
                <IonContent className='h-screen scheduleTable'>
                    <Virtuoso
                        totalCount={1}
                        // style={{ height: '500px' }}
                        itemContent={index => <Table
                            data={guildData}
                            columns={isMobile ? columns_mobile : columns}
                            title="Discords that have our bots"
                            // description="👪"
                            url="https://famousfoxes.com/tokenmarket"
                            options={{
                                thirdSortClick: false,
                                detailPanelType: 'single',
                                search: false,
                                searchFieldStyle: {
                                    display: 'none',
                                    marginLeft: '-20%',
                                    marginTop: '2%',
                                    paddingLeft: "4%",
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.876) !important' : '1px solid rgba(10,10,10,0.8) !important'
                                },
                                rowStyle: (rowData: any) => ({
                                    backgroundColor: mode === 'dark' ? '' : 'rgba(239,239,239,0.8)',
                                    color: mode === 'dark' ? "" : '#202124',
                                    borderTop: mode === 'dark' ? "" : '1px solid rgba(220,220,220,0.8)',
                                }),
                                // hide eye icon on mobile
                                columnsButton: isMobile ? false : true,
                            }}
                        />}
                    />
                </IonContent>
            }
        </div>
    );
}

export default ViewGuild;
