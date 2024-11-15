import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import {
    IonItem,
    IonButton,
    IonLabel,
    useIonToast,
    IonInput,
    IonTextarea,
    IonCard,
    IonSpinner,
} from '@ionic/react';
import { Backdrop, CircularProgress, Grid, Switch } from '@material-ui/core';
import { Tooltip } from 'react-tippy';
import './ServerModule.scss';
import { useHistory, useLocation, useParams } from 'react-router';
import Loader from '../../components/Loader';
import { Server } from '../../types/Server';
import { css } from '@emotion/react';

import Addserver from './components/Addserver';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import isAxiosError from '../../util/isAxiosError';
import { AxiosError } from 'axios';
import { TextFieldTypes } from '@ionic/core';
import { server } from 'ionicons/icons';
import Help from '../../components/Help';
import { useDispatch } from 'react-redux';
import { isEditWhitelist, requiredRoleForUser } from '../../redux/slices/whitelistSlice';
/**
 * The page they see when they click "Add" on one of their servers
 */

interface LocationParams {
    pathname: string;
    state: { server: Server };
    search: string;
    hash: string;
}

interface FormFields {
    image: File & { path: string };
    description: string;
    twitterLink: string;
    discordLink: string;
    magicEdenLink: string;
    requiredRoleId: string;
    requiredRoleName: string;
    imagePath?:string
}

const ServerModule: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
     const dispatch = useDispatch()

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const devMode = query.get('devMode') || window.location.href.indexOf('localhost') !== -1;

    let history = useHistory();
    const location: LocationParams = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [checked, setChecked] = useState<{ mintInfoModule: boolean;  tokenModule: boolean; magicedenSolModule:boolean }>({ mintInfoModule: false, tokenModule: false, magicedenSolModule:false });
    const [isLoading, setIsLoading] = useState(false);
    const [showInstruction, setShowInstruction] = useState<boolean>(false);
    const [mintMoreInfoShow, setMintMoreInfoShow] = useState<boolean>(false);
    const [foxTokenMoreInfoShow, setFoxTokenMoreInfoShow] = useState<boolean>(false);
    const [magicEdenInfoShow, setMagicEdenInfoShow] = useState<boolean>(false);
    const [dropdownValue, setDropdownValue] = useState({
        dailyMintsWebhookChannel: 'default',
        oneHourMintInfoWebhookChannel: 'default',
        analyticsWebhookChannel: 'default',
        tomorrowMintsWebhookChannel:'default',
        walletWatchWebhookChannel: 'default'
    });
    const [channel, setChannel] = useState<any>(null);
    const [backdrop, setBackdrop] = useState(false);
    const [present, dismiss] = useIonToast();
    const [role, setRole] = useState<any>(null);
    const [authorizedModule, setAuthorizedModule] = useState<any>();
    // const [server, setServer] = useState<Server | null>(null);
    const { serverId } = useParams<{ serverId: string }>();
    const [addServerFlag, setAddServerFlag] = useState(false);
    const { control,  handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, getValues } = useForm<FormFields, any>();
    const [isNoBot, setIsNoBot] = useState<boolean>(false);
    const [requiredRole,setRequiredRole] = useState<any>([]);
    const [isBigImage, setIsBigImage] = useState<boolean>(false);
    const [isValidImage, setIsValidImage] = useState<boolean>(false);
    const [guildFormData, setGuildFormData] = useState({
        magicEdenLink: '',
        description: '',
        twitterLink: '',
        discordLink: '',
        requiredRoleId: '',
        requiredRoleName: '',
        imagePath: ''
    });
const [serverName, setServerName] = useState('')

    /**
     * Use Effects
     */

    // console.log('server',location);

     useEffect(() => {
        if(!localStorage.getItem('role')){
            history.push('/dao')
            return
        }else{
            setRole(localStorage.getItem('role'))
        }

        if (window.innerWidth < 525) {
            setIsMobile(true);
        }

    }, [window.innerWidth]);

    // refresh page
    // useEffect(() => {
    //   if (performance.navigation.type === 1) {
    //         history.push('/dao')
    //     }
    // }, [])

    // refresh page  fixed when sometime not redirect to server module
    let refreshCount = localStorage.getItem('refresh')

    useEffect(() => {
     if(refreshCount === 'two'){
        history.push('/dao')
     }
    }, [])

    localStorage.setItem('refresh' ,'two')


    // this gets set from manageserver.tsx
    useEffect(() => {
        if(location.search === 'noBot'){
            setIsNoBot(true);
        }else{
            setIsNoBot(false);
        }
    }, [location.search]);

    useEffect(() => {
        reset(guildFormData);
    }, [guildFormData]);

    useEffect(() => {
        if (role === '3NFT') {
            setAuthorizedModule(1);
        } else if (role === '4NFT') {
            setAuthorizedModule(10);
        } else {
            setAuthorizedModule(0);
        }
        if(refreshCount !== 'two'){
            getWhiteListRole();
        }
    }, [role]);

    // get guilds
    useEffect(() => {
        if (serverId && role) {
            getGuildFormData();
        }
    }, [location,role]);

    // get guild form data that user submit previously
    const getGuildFormData = async() =>{
        if (serverId) {
            setIsLoading(true);
            instance
                .get(`/guilds/${serverId}?checkCondition=false`)
                .then((response) => {
                    let data = response.data.data;
                    setServerName(data.name)
                // change
                    if (role === '3NFT' || role === '4NFT') {
                        setChecked({
                            ...checked,
                            mintInfoModule: data.mintInfoModule,
                            tokenModule: data.tokenModule,
                        });
                    }

                    setDropdownValue({
                        ...dropdownValue,
                        dailyMintsWebhookChannel:
                            data.dailyMintsWebhookChannel || 'default',
                        oneHourMintInfoWebhookChannel:
                            data.oneHourMintInfoWebhookChannel || 'default',
                        analyticsWebhookChannel:
                            data.analyticsWebhookChannel || 'default',
                        tomorrowMintsWebhookChannel:
                            data.tomorrowMintsWebhookChannel || 'default',
                        walletWatchWebhookChannel:
                            data.walletWatchWebhookChannel || 'default'
                    });

                    // guilds data gets looked at, and gets their channels if bot is in it
                    if(data.textChannels.length > 0){
                        setChannel(data.textChannels);
                    // if empty array - means bot isn't in there... so do this
                    }else{
                        if(refreshCount !== 'two'){
                            setIsNoBot(true);
                        }
                    }
                    //

                    setGuildFormData({
                        magicEdenLink:data.magiceden_link,
                        description:data.description,
                        twitterLink:data.twitter_link,
                        discordLink:data.discord_link,
                        requiredRoleId: `${data.requiredRoleId}`,
                        requiredRoleName:data.requiredRoleName,
                        imagePath:data.image
                    })
                    if(data){

                        let botData:any = {
                            requiredRoleId: data.requiredRoleId,
                            requiredRoleName:data.requiredRoleName,
                            name:serverName
                        }
                        localStorage.setItem('requiredBotData', JSON.stringify(botData))
                    }

                })
                .catch((error: any) => {
                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.message);
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
                .finally(() => {
                    setIsLoading(false);
                });
        }

    }

    // update guilds modules
    let enableModule = (obj: { module: string; enabled: boolean }) => {
        if (serverId) {
            setBackdrop(true);
            instance
                .post(`/guilds/${serverId}/modules`, obj, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(({ data }) => {
                    if (data.success) {
                        setChecked({ ...checked, [obj.module]: obj.enabled });
                    } else {
                        let msg = '';
                        if (data?.message) {
                            msg = String(data.message);
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
                })
                .catch((error: any) => {
                    let msg = '';
                    if (error?.response) {
                        msg = String(
                            error.response.data.message
                                ? error.response.data.message
                                : error.response.data.body
                        );
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
                .finally(() => {
                    setIsLoading(false);
                    setBackdrop(false);
                });
        }
    };

    // ie. selecting a channel
    let updateWebHooks = (obj: { webhook: string; channel: string }) => {
        if (serverId) {
            setBackdrop(true);
            instance
                .post(`/guilds/${serverId}/webhooks`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    setDropdownValue({
                        ...dropdownValue,
                        [obj.webhook]: obj.channel,
                    });

                    // show success
                    present({
                        message:
                            'Selection saved. Messages will be sent to the channel in the future',
                        color: 'success',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                })
                .catch((error: any) => {
                    let msg = '';
                    if (error?.response) {
                        msg = String(
                            error.response.data.message
                                ? error.response.data.message
                                : error.response.data.body
                        );
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
                .finally(() => {
                    setIsLoading(false);
                    setBackdrop(false);
                });
        }
    };

    let getOption = () => {
        return channel
            ?.sort((a: { name: string }, b: { name: any }) =>
                a.name.localeCompare(b.name)
            )
            .map((obj: any, index: number) => {
                return (
                    <option value={obj.id} key={index}>
                        {obj.name}
                    </option>
                );
            });
    };

    let showDisableBtnMesage = (message: string) => {
        present({
            message: message,
            color: 'danger',
            duration: 5000,
            buttons: [{ text: 'X', handler: () => dismiss() }],
        });
    };

    let disableButton = (btnType: any) => {
        if (role === 'No Roles') {
            showDisableBtnMesage(
                'Sorry you do not have the right number of NFTs. If you feel this is a mistake, log out on the bottom left and log back in'
            );
            return true;
        } else if (role === '3NFT') {
            if (checked.mintInfoModule || checked.tokenModule) {
                if (btnType === 'mintInfoModule' && checked.mintInfoModule) {
                    return false;
                } else if (btnType === 'tokenModule' && checked.tokenModule) {
                    return false;
                } else {
                    showDisableBtnMesage(
                        'You are Authorized to edit only 1 module'
                    );
                    return true;
                }
            } else {
                return false;
            }
        } else if (role === '4NFT') {
            return false;
        } else {
            showDisableBtnMesage(
                'Sorry you do not have the right number of NFTs. If you feel this is a mistake, log out on the bottom left and log back in'
            );
            return true;
        }
    };

    const sendTestWebhook = (moduleName: string) => {
        if (!serverId) return;
        instance
            .post(
                `/guilds/${serverId}/${moduleName}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() =>
                present({
                    message: 'Message sent successfully',
                    color: 'success',
                    duration: 3000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                })
            )
            .catch(() =>
                present({
                    message: 'An error occurred',
                    color: 'danger',
                    duration: 3000,
                    buttons: [{ text: 'X', handler: () => dismiss() }],
                })
            );
    };

    if (isLoading) {
        return (
            <div className="pt-10 flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (addServerFlag && serverId) {
        return (
            <Addserver
                addServerFlag={addServerFlag}
                setAddServerFlag={setAddServerFlag}
                serverId={serverId}
            />
        );
    }

    const getWhiteListRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 10000,
            });
        }

        try{
            const  data = await instance.get(`/getAllRoles/${serverId}`);
            if(data?.data?.data){
                setRequiredRole(data.data.data)
            }else{
                // errMsg();
            }
        }catch(err){
            // errMsg();
        }

    }


    return (
        <>
            {/*Loading*/}
            <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/*seamless new mint*/}
            <div className="md:text-2xl text-2xl p-4 px-6 w-full">
                {serverName}
            </div>
            <div className="server-module-bg p-4 px-6 w-full" hidden={isNoBot}>
                <div className={isMobile ? 'flex-col items-center flex ':'flex justify-between flex-row items-center'}>
                    <IonLabel className="md:text-2xl text-2xl font-semibold">
                        Seamless - New mint
                    </IonLabel>
                </div>
                <p>
                    Give your whitelist out to servers with 0 work on your mods, 0 fake DAO screenshots, and soon 100% Twitter follower verification.
                    <br/>
                    <a href="https://docs.soldecoder.app/books/intro/page/seamless" target="_blank" className="font-bold cursor-pointer underline mt-5">Follow a step-by-step guide on this here.</a>
                </p>
                <div className={`flex  ${isMobile ? 'flex-col items-center' : 'flex-row'}`}>
                    <div className="mt-3 mb-3 flex ">
                        <IonButton className="text-base" css={css`
                        --padding-top: 25px;
                        --padding-bottom: 25px;
                        --padding-end: 20px;
                        --padding-start: 20px;
                    `} onClick={() => history.push(`/seamless/${serverId}`)}>
                            Initiate a New Seamless
                        </IonButton>
                    </div>

                    {/* TO.DO: !!! EDIT DELETE BROKE - ruchita all bugged */}
                    {/*<div className={`mt-3 mb-3 flex ${isMobile ? '' : 'ml-3'}`}>*/}
                    {/*    <IonButton className="text-base" css={css`*/}
                    {/*    --padding-top: 25px;*/}
                    {/*    --padding-bottom: 25px;*/}
                    {/*    --padding-end: 20px;*/}
                    {/*    --padding-start: 20px;*/}
                    {/*`} onClick={() =>{ history.push({pathname:`/seamless`,search:`sourceId=${serverId}`}) }}>*/}
                    {/*        Edit/Delete an existing Seamless*/}
                    {/*    </IonButton>*/}
                    {/*</div>*/}

                </div>
            </div>
            <br/>

            {/* seamless existing */}
            <div className="server-module-bg p-4 px-6 w-full">
                <div className={isMobile ? 'flex-col items-center flex ':'flex justify-between flex-row items-center'}>
                    <IonLabel className="md:text-2xl text-2xl font-semibold">
                        Seamless - Existing DAO Profile
                    </IonLabel>
                </div>
                <p>
                    Want to receive whitelists from new mints, absolutely free? Fill out the below to help new mints see what you're about. You can then ask them to submit whitelists requests to you via Seamless. If they've never used Seamless before, have them <a href="https://discord.gg/s4ne34TrUC" target="_blank" className="underline cursor-pointer font-bold">join our Discord</a> and we'll walk them through the process.
                </p>

                <form className="space-y-3"
                    // when submitting the form...
                    onSubmit={  handleSubmit(async (data) => {
                        const { image, ...rest } = data;
                        const rawData = { ...rest, };

                        // if(data.requiredRoleId.includes(':')) {
                        //     rawData.requiredRoleId = data.requiredRoleId.split(':')[0];
                        //     rawData.requiredRoleName = data.requiredRoleId.split(':')[1];
                        // }

                        delete rawData.imagePath
                        const formData = new FormData();


                        Object.entries(rawData).forEach(([key, value]) => {
                            if (value) formData.append(key, value as string);
                        });
                        formData.append('image', data.imagePath || image);
                        try {
                            await instance.post( `/updateGuild/${serverId}`, formData, { headers: { 'Content-Type': 'application/json', }, } );
                            present({
                                message: 'Discord profile updated successfully! New servers will now be able to see much more info. on your DAO, and submit whitelists to you',
                                color: 'success',
                                duration: 10000,
                            });
                        } catch (error) {
                            console.error(error);

                            if (isAxiosError(error)) {
                                const { response: { data } = { errors: [] } } = error as AxiosError<{ errors: { location: string; msg: string; param: string; }[]; }>;

                                if (!data || data.hasOwnProperty('error')) {
                                    present({
                                        message: ( data as unknown as { body: string } ).body,
                                        color: 'danger',
                                        duration: 10000,
                                    });
                                } else if (data.hasOwnProperty('errors')) {
                                    data.errors.forEach(({ param, msg }) => {
                                        if (param !== 'source_server') {
                                            setError( param as keyof FormFields, { message: msg, type: 'custom',});
                                        } else {
                                            present({
                                                message: msg,
                                                color: 'danger',
                                                duration: 10000,
                                            });
                                        }
                                    });
                                }
                            }else{
                                present({
                                    message: 'An error occurred, please try again later or contact us',
                                    color: 'danger',
                                    duration: 10000,
                                });
                            }
                        }
                    })}>

                    <div className='mt-3 mb-5'>
                        <label className="font-bold">Magiceden Link (optional)</label>
                        <IonItem className="ion-item-wrapper mt-1">
                            <Controller
                                name="magicEdenLink"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                    <div className='flex flex-col w-full'>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                            type="url"
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            placeholder='Magic Eden Link to existing NFT Collection' />
                                        <p className="formError"> {error?.message} </p>
                                    </div>

                                )} />
                        </IonItem>
                    </div>

                    <div className='mb-5'>
                        <label className="font-bold">Discord Invite Link (optional)</label>
                        <IonItem className="ion-item-wrapper mt-1">
                            <Controller
                                name="discordLink"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                    <div className='flex flex-col w-full'>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                            type="url"
                                            // required
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            placeholder='Discord Invite Link (never expires, no invite limit - optional)' />
                                        <p className="formError"> {error?.message} </p>
                                    </div>
                                )} />
                        </IonItem>
                    </div>

                    <div className='mb-1'>
                        <label className="font-bold">Twitter Link</label>
                        <IonItem className="ion-item-wrapper mt-1">
                            <Controller
                                name="twitterLink"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                    <div className='flex flex-col w-full'>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                            type="url"
                                            required
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            placeholder='Twitter Link' />
                                        <p className="formError"> {error?.message} </p>
                                    </div>
                                )} />

                        </IonItem>
                    </div>

                    {/* no bot! */}
                    {isNoBot || requiredRole.length === 0 ?
                        <>
                            <div className='mb-5'>
                                <label className="font-bold">
                                    Required Role ID (Discord Role ID, ie. 966704866640662541, that your holders will need to enter the whitelist)
                                    <Help description={`New mints will be giving members of your DAO whitelist spots. In order for a member of your DAO to qualify to enter, they must have a specific role. This is usually the Discord role a user gets when holding an NFT (which Metahelix or Matrica would give them). By restricting it to a specific role, only those members may enter the whitelist, instead of just anyone that joins your server being able to enter the whitelist`}/>
                                    <br/>
                                    How to get the Role ID?
                                    <Help description={`First make sure Developer mode is on in Discord. User settings > Advanced > Developer mode. In your Discord, click on yourself in chat to bring up the roles you have. Right click on the role you want to use for this. Click Copy ID.`}/>
                                </label>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                        name="requiredRoleId"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <div className='flex flex-col w-full'>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="text"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Required Role ID (ie. 966704866640662541)' />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
                                        )} />

                                </IonItem>
                            </div>

                            <div className='mb-5'>
                                <label className="font-bold">
                                    Required Role Name
                                </label>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                        name="requiredRoleName"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <div className='flex flex-col w-full'>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="text"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Required Role Name (ie. Verified Holder)' />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
                                        )} />

                                </IonItem>
                            </div>
                        </>
                    :
                        // has bot!
                        <div className='mb-5'>
                            <label className="font-bold">Required Role Name</label>
                            <IonItem className="ion-item-wrapper mt-1">
                            <Controller
                                name="requiredRoleId"
                                rules={{ required: true, }}
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) =>{
                                return (
                                    <div className='flex flex-col w-full'>
                                        <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                            onChange={onChange}
                                            name={name}
                                            value={value}
                                            onBlur={onBlur}
                                            ref={ref}
                                            required >
                                            <option value=''>Select a Required Role Name</option>
                                            {guildFormData.requiredRoleId ? <option value={`${guildFormData.requiredRoleId}:${guildFormData.requiredRoleName}`}>{guildFormData.requiredRoleName}</option> :'' }
                                            {requiredRole && requiredRole.map((role:any) =>{ return (<option  key={role.id} value={`${role.id}:${role.name}`}> {role.name} </option>)}  )}
                                        </select>
                                        <p className="formError"> {error?.message} </p>
                                    </div>
                                )}}
                            />
                            </IonItem>
                        </div>
                    }

                    <div>
                        <label className="font-bold">
                            Description of your DAO
                        </label>
                        <IonItem className="ion-item-wrapper mt-1">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                    <div className='flex flex-col w-full'>
                                        <IonTextarea
                                            className='w-full'
                                            value={value}
                                            onIonChange={(e:any) => {
                                                ( e.target as HTMLInputElement ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            required
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            placeholder='Description of your DAO'
                                        />
                                        <p className="formError"> {error?.message} </p>
                                    </div>
                                )}/>

                        </IonItem>
                    </div>

                    <div className='mb-5 mt-1 w-1/2'>
                        <b>Image to represent your DAO - Image must be less then 10MB</b>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                <>
                                    <IonInput
                                        value={value as unknown as string}
                                        onIonChange={(e) => {
                                            const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                                            const file = target.files?.[0] as FieldValues['image'];
                                            if(file){
                                                if(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpeg' ){
                                                    setIsValidImage(false)
                                                    setError('image', { type: 'custom', message: '' });
                                                }else{
                                                    setError('image', { type: 'custom', message: 'Please upload a valid Image' });
                                                    setIsValidImage(true)
                                                }
                                                let file_size = file.size;
                                                if((file_size/1024) < 10240){
                                                    setIsBigImage(false)
                                                }else{
                                                    setError('image', { type: 'custom', message: 'Maximum allowed file size is 10 MB' });
                                                    setIsBigImage(true)
                                                }
                                            }

                                            if (file)
                                                file.path =  URL.createObjectURL(file);
                                            ( e.target as HTMLInputElement ).value = file as unknown as string;
                                            onChange(e);
                                        }}
                                        name={name}
                                        ref={ref}
                                        required = {getValues('imagePath') ? false : true}
                                        onIonBlur={onBlur}
                                        type={'file' as TextFieldTypes}
                                        accept="image/png, image/gif, image/jpeg" />
                                    <p className="formError"> {error?.message} </p>
                                </>
                            )} />
                    </div>

                    {/*justify-center*/}
                    <div className=' mt-4 mb-5 w-full flex '>
                        <IonButton className='w-50 h-12' type={'submit'} disabled={isSubmitting || isBigImage || isValidImage}>
                            {isSubmitting ? ( <IonSpinner /> ) : ('Submit DAO Profile')}
                        </IonButton>
                    </div>
                </form>
            </div>
            <br/>
            <div className="server-module-bg p-4 px-6 w-full"  hidden={!isNoBot}>
                <div className={isMobile ? 'flex-col items-center flex ':'flex justify-between flex-row items-center'}>
                    <IonLabel className="md:text-2xl text-2xl font-semibold">
                        No Bots detected in your Discord
                    </IonLabel>
                </div>
                <p>
                    We weren't able to detect our SOL Decoder bots in your Discord, so we aren't able to offer you our unique bot channels and commands.
                    <br/>
                    If you are interested in these bots, and you've purchased our NFTs, then <a className='cursor-pointer underline font-bold' href='/dao'>click here</a> and add the bot at the top of the page.
                    <br/>
                    See below for more information on these bots.
                    <br/><br/>
                    <img src="https://media.discordapp.net/attachments/973193136794910770/992844904571084882/image_4.png?width=2530&height=1193" />
                </p>
            </div>




            <div hidden={isNoBot}>

                <br/> <hr/> <br/>

                {/* configure bot */}
                <div className={isMobile ? 'flex-col items-center flex ':'flex justify-between flex-row items-center'}>
                    <IonLabel className="md:text-2xl text-2xl font-semibold">
                        Configure Bot Packages
                    </IonLabel>
                </div>
                {/* module count */}
                <div className={`text-base flex ${isMobile ? 'mt-2' :''}`}>
                    {/* if they can't add any packages */}
                    {authorizedModule === 0 ?
                        <>
                            <span className="text-red-500">
                                You don't have enough NFTs to add packages. Please purchase the appropriate amount and have your role verified in Discord.
                                If you feel this is an error, then log out (bottom left) and log in again.
                                {/*If you want to give one of your admins (that have the NFTs) to manage the bots in your server, then click the 'Add Admin' button here*/}
                            </span>

                        </> :

                        // else show how many packages they can add
                        <span className="text-green-500">You are authorized to add up to {authorizedModule} package(s)</span>}
                </div>

                {/*instructions*/}
                <div className="flex flex-row justify-center w-full mt-3">
                    <div className="server-module-bg p-4 px-6 w-full">
                        <div className='w-full flex items-center justify-between mb-3 cursor-pointer' onClick={()=>setShowInstruction((e)=>!e)}>
                            <div className='text-xl font-semibold '>Bot Instructions (click to expand)</div>
                            <img style={{color : 'red'}} src={showInstruction ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`)}  className='w-4 cursor-pointer'  />
                        </div>
                        {/* <div className='text-xl font-semibold mb-3'>Instructions</div> */}
                        {
                            showInstruction ?
                                <div>
                                    <b>General Instructions</b>
                                    <ul className='list-disc ml-5 leading-9'>
                                        <li>Make a new private channel in your Discord. If doing the "Mints" package, name the channel "daily-mints" or whatever you want. Optionally make "1h-mint-info" if you want that as well. Or if you are doing the "Fox token" package, make a channel for the fox token names, and another channel for where users can enter their own bot commands</li>
                                        <li>Add the bot to the above channels (by going to the channel settings within Discord)</li>
                                        <li>Refresh this page</li>
                                        <li>Enable the "Mints" package (or "Fox token" package)</li>
                                        <li>It should ask you about the channels - pick your new channels. Click the test button. If it doesn't work, make sure the SOL Decoder bot is in that channel, and has permission to "Send Messages" (done within the channel settings in Discord)
                                        </li>
                                        <li>Wait for the channels to be populated with data before showing it to the public (8am EST is when daily-mints is populated, varying times for other channels)</li>
                                        <li>If doing the "Fox token" package, you need to first tell us before you can start using the bot commands (/token, /token_name, /wallet_tokens) in your server. You also need to add permission for any user in that channel to "Use Application Commands"</li>
                                    </ul>

                                    <b>Discord channel permissions</b>
                                    <ul className='list-disc ml-5 leading-9'>
                                        <li>Go to your new channel(s) in Discord - click "edit channel" in the sidebar</li>
                                        <li>Click permissions</li>
                                        <li>Click "Add Members or Roles"</li>
                                        <li>Search for "SOL Decoder Bot"</li>
                                        <li>Scroll down to "Advanced Permissions", make sure the bot is selected on the left</li>
                                        <li>On the right, check the following:</li>
                                        <li>- Send Messages</li>
                                        <li>- Embed Links</li>
                                        <li>- Attach Files</li>
                                        <li>Make sure the bot shows as "Online" in the sidebar</li>
                                        <li>Click the "Send a test message" and make sure it works</li>

                                        <img width="350px" src="https://cdn.discordapp.com/attachments/983706216733765642/984217168889667654/Screen_Shot_2022-06-08_at_6.07.31_PM.png" />
                                    </ul>
                                </div>
                                : ''
                        }

                    </div>
                </div>

                {/*module selection*/}
                <div className="flex flex-row justify-center w-full mt-6">
                    <div className='flex flex-col lg:flex-row gap-6 w-full'>

                        <div className='basis-1/2'>
                            <div className="server-module-bg overflow-hidden">
                                <div className="flex flex-row justify-center w-full">
                                    <div className='card-bg-blur flex justify-center items-center w-full'>
                                        <div className="module-icon-wrapper w-full">
                                            <img src={require('../../images/calendar.png')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col mt-4 p-2 w-full">
                                    <div className='flex justify-between items-center w-full'>
                                        <IonLabel className="ml-3 text-xl font-semibold">
                                            "Mints" package
                                        </IonLabel>
                                        <Switch checked={checked.mintInfoModule}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (disableButton('mintInfoModule')) {
                                                    return
                                                }
                                                enableModule({ module: 'mintInfoModule', enabled: e.target.checked, });
                                            }}
                                        />
                                    </div>

                                    {/* Hide show channel list of mint module */}
                                    {checked.mintInfoModule && (
                                        <>
                                            <div className="flex flex-row justify-center w-full">
                                                <div className="server-module-bg p-2 mt-2">
                                                    <div className="text-lg font-semibold">
                                                        "Daily Mints" Channel
                                                    </div>
                                                    <div className="flex flex-row justify-between my-2">
                                                        <select value={dropdownValue.dailyMintsWebhookChannel} className="server-channel-dropdown"
                                                            onChange={(event: any) => {
                                                                updateWebHooks({
                                                                    webhook: 'dailyMintsWebhookChannel',
                                                                    channel: event.target.value,
                                                                });
                                                            }} >
                                                            <option value="default">
                                                                Please Select the Daily Mints Channel
                                                            </option>
                                                            {getOption()}
                                                        </select>
                                                    </div>
                                                    <div className='italic text-sm'>(Automated posts about today's mints, along with Twitter/Discord stats)</div>
                                                    { dropdownValue.dailyMintsWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendDailyMints')}>Send a test message</IonButton>}

                                                    <div className="text-lg font-semibold mt-6">
                                                        "One Hour Mint Info" Channel
                                                    </div>
                                                    <div className="flex flex-row justify-between my-2">
                                                        <select value={ dropdownValue.oneHourMintInfoWebhookChannel } className="server-channel-dropdown"
                                                            onChange={(event: any) => {
                                                                updateWebHooks({
                                                                    webhook: 'oneHourMintInfoWebhookChannel',
                                                                    channel: event.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <option value="default">
                                                                Please Select the One Hour Mint Info Channel
                                                            </option>
                                                            {getOption()}
                                                        </select>
                                                    </div>
                                                    <div className='italic text-sm'>
                                                        (An hour before one of the top 7 daily mints comes out, this will show the mint info, recent searches from the Discords we parse, and last two official tweets from their team)
                                                    </div>
                                                    {dropdownValue.oneHourMintInfoWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendOneHourMints')}>Send a test message</IonButton>}

                                                    <br/><br/>


                                                    <div className="text-lg font-semibold">
                                                        "Tomorrow's Mints" channel
                                                    </div>
                                                    <div className="flex flex-row justify-between my-2 ">
                                                        <select value={ dropdownValue.tomorrowMintsWebhookChannel } className="server-channel-dropdown"
                                                                onChange={(event: any) => {
                                                                    updateWebHooks({
                                                                        webhook: 'tomorrowMintsWebhookChannel',
                                                                        channel: event.target.value,
                                                                    });
                                                                }}
                                                        >
                                                            <option value="default">
                                                                Please Select the Tomorrow's Mints channel
                                                            </option>
                                                            {getOption()}
                                                        </select>
                                                    </div>
                                                    <div className='italic text-sm'>
                                                        (Automated posts about tomorrow's mints, along with Twitter/Discord stats)
                                                    </div>



                                                    {/*{dropdownValue.tomorrowMintsWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton>}*/}

                                                </div>
                                            </div>
                                        </>
                                    )}


                                    <div className="text-sm  mt-2 p-2 border-t-2">
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='text-base my-2 '>
                                                More information
                                            </div>
                                            <img src={mintMoreInfoShow ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`)} className='w-4 cursor-pointer' onClick={()=> setMintMoreInfoShow((e)=>!e)} />
                                        </div>
                                        {mintMoreInfoShow ? <ul className='list-disc ml-5 leading-7'>
                                            <li>Your server can have the "daily-mints" and "1h-mint-info" feed, and "tomorrows-mints". Enable this to learn more about each</li>
                                            <li>Hold and you get lifetime access, and get free upgrades to existing packages such as getting daily summaries of NFTs coming out in a few weeks, when they they get a bump in their twitter / discord numbers</li>
                                        </ul> : '' }

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* tokenModule */}
                        <div className='basis-1/2'>
                            <div className="server-module-bg overflow-hidden">
                                <div className="flex flex-row justify-between w-full">
                                    <div className='card-bg-blur-fox flex justify-center items-center w-full'>
                                        <div className="module-icon-wrapper w-full">
                                            <img src={require('../../images/fox.png')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-4 p-2">
                                    <div className='flex justify-between items-center w-full'>
                                        <IonLabel className="ml-3 text-xl">
                                            "Fox Token" package
                                        </IonLabel>
                                        <Switch
                                            checked={checked.tokenModule}
                                            onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                                                if (disableButton('tokenModule')) {
                                                    return
                                                }
                                                enableModule({
                                                    module: 'tokenModule',
                                                    enabled: e.target.checked,
                                                });
                                            }}
                                        // disabled={disableButton('tokenModule')}
                                        />
                                    </div>

                                    {/* Hide show channels list of fox token module */}
                                    {checked.tokenModule && (
                                        <>
                                            <div className="flex w-full">
                                                <div className="server-module-bg p-2 mt-2 w-full">
                                                    {/* <div className="text-xl font-semibold flex mt-8 mb-8">
                                                        "Fox Token" package
                                                    </div> */}

                                                    <div className="text-lg font-semibold">
                                                        "Fox Token" channel
                                                    </div>
                                                    <div className="flex flex-row justify-between my-2 ">
                                                        <select value={ dropdownValue.analyticsWebhookChannel } className="server-channel-dropdown"
                                                            onChange={(event: any) => {
                                                                updateWebHooks({
                                                                    webhook: 'analyticsWebhookChannel',
                                                                    channel: event.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <option value="default">
                                                                Please Select the Fox Token channel
                                                            </option>
                                                            {getOption()}
                                                        </select>
                                                    </div>

                                                    <div className='italic text-sm'>
                                                        (Shows when names are added to WL tokens in Fox Token market, along with charts) {' '}
                                                    </div>
                                                    {dropdownValue.analyticsWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton>}


                                                    {/* Choose a channel above, then click the button below to make sure it worked
                                                    <br />
                                                    <IonButton onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton> */}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="text-sm mt-2 p-2 border-t-2">
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='text-base my-2 '> More information </div>
                                            <img src={foxTokenMoreInfoShow ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`) } className='w-4 cursor-pointer' onClick={()=> setFoxTokenMoreInfoShow((e)=>!e)} />
                                        </div>
                                        { foxTokenMoreInfoShow ?
                                            (<ul className='list-disc ml-5 leading-7'>
                                                <li>Your server can have our "analytics" feed (where we show when tokens get new names from the Fox Token team), and users can use our bot's slash commands of /token_name and /token and /wallet_tokens </li>
                                                <li>Hold and you get lifetime access, and get free upgrades to existing packages such as getting alerts for Fox Token price/listings data (ie. alerted when any fox token with a name & greater than 1 sol price & greater than 10 listings is out) </li>
                                                {/*<li>Please contact us after enabling this, so we can enable the bot commands (/token, /token_name, /wallet_tokens) in your server</li>*/}
                                            </ul>): ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Magic Eden */}
                        <div className='basis-1/2'>
                            <div className="server-module-bg overflow-hidden">
                                <div className="flex flex-row justify-between w-full">
                                    <div className='card-bg-blur-magic-eden flex justify-center items-center w-full'>
                                        <div className="module-icon-wrapper w-full">
                                            <img src={require('../../images/me.png')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-4 p-2">
                                    <div className='flex justify-between items-center w-full'>
                                        <IonLabel className="ml-3 text-xl">
                                            "Magic Eden & SOL" package
                                        </IonLabel>
                                        <Switch
                                            checked={checked.magicedenSolModule}
                                            onChange={( e: React.ChangeEvent<HTMLInputElement> ) => {
                                                if (disableButton('magicedenSolModule')) {
                                                    return
                                                }
                                                enableModule({
                                                    module: 'magicedenSolModule',
                                                    enabled: e.target.checked,
                                                });
                                            }}
                                        // disabled={disableButton('magicedenSolModule')}
                                        />
                                    </div>

                                    {/* Hide show channels list of magic eden module */}
                                    {checked.magicedenSolModule && (
                                        <>
                                            <div className="flex w-full">
                                                <div className="server-module-bg p-2 mt-2 w-full">

                                                    <div className="text-lg font-semibold">
                                                        "Wallet Watch" channel
                                                    </div>
                                                    <div className="flex flex-row justify-between my-2 ">
                                                        <select value={ dropdownValue.walletWatchWebhookChannel } className="server-channel-dropdown"
                                                                onChange={(event: any) => {
                                                                    updateWebHooks({
                                                                        webhook: 'walletWatchWebhookChannel',
                                                                        channel: event.target.value,
                                                                    });
                                                                }}
                                                        >
                                                            <option value="default">
                                                                Please Select the Wallet Watch channel
                                                            </option>
                                                            {getOption()}
                                                        </select>
                                                    </div>
                                                    <div className='italic text-sm'>
                                                        (Used with /watch_wallet command, to show activity on a wallet. Use it to monitor whales or your own wallet(s). Max 40 wallets per Discord server)
                                                    </div>
                                                    {/*{dropdownValue.walletWatchWebhookChannel === 'default' ? '' : <IonButton className={`mt-2 ${isMobile ? 'flex self-center' :''}`} onClick={() => sendTestWebhook('sendAnalytics')}>Send a test message</IonButton>}*/}

                                                    <br/>
                                                    <b>User Commands Unlocked:</b>
                                                    <ul className='list-disc ml-5 leading-7'>
                                                        <li>/fp - Users can get the price/volume/listings of any Magic Eden NFT</li>
                                                        <li>
                                                            /watch_wallet - Users can track the buys/sells (limit of 30 per Discord).
                                                            {/*Recommend you lock this down to certain roles. Have a mod right click on the SOL Decoder bot within your Discord. Manage Integration. Commands - /watch_wallet. Click on it. @everyone - denied. Add roles or members - choose a role that can manage this.*/}
                                                        </li>
                                                        <li>/tps - Users can get a live count of Solana's Transactions Per Second</li>
                                                    </ul>

                                                    {/*Please contact us after enabling this, so we can enable the bot commands in your server*/}

                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="text-sm mt-2 p-2 border-t-2">
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='text-base my-2 '> More information </div>
                                            <img src={magicEdenInfoShow ?  require(`../../images/up-icon.png`) : require(`../../images/chevron-down-icon.png`) } className='w-4 cursor-pointer' onClick={()=> setMagicEdenInfoShow((open)=>!open)} />
                                        </div>
                                        { magicEdenInfoShow ?
                                            (<ul className='list-disc ml-5 leading-7'>
                                                <li>/fp - Users can get the price/volume/listings of any Magic Eden NFT</li>
                                                <li>/watch_wallet - Users can track the buys/sells (limit of 30 per Discord)</li>
                                                <li>/tps - Users can get a live count of Solana's Transactions Per Second</li>
                                            </ul>): ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ServerModule;
