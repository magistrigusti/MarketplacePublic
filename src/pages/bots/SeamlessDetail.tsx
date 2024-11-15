import React, { useEffect, useMemo ,useState} from 'react';
import { AppComponentProps } from '../../components/Route';
import { IonButton, useIonToast, IonGrid, IonRow, IonCol, IonCard, IonSpinner } from '@ionic/react';
import './SeamlessDetail.scss';
import {  useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import isAxiosError from '../../util/isAxiosError';
import { AxiosError } from 'axios';
import BotServerCard from './components/BotServerCard';
import Help from '../../components/Help';
import { createNewWhitelistPartnership, getAllRoles, getLastWhitelistPartnerShip, getWhitelistPartnership, setWhiteListFormData, updateWhitelistPartnership, whitelistFormState } from './service/whiteListServices';
import WhiteListFormField from './components/WhiteListFormField';
import { whiteListFormField } from './service/whiteListModalType';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

const SeamlessDetail: React.FC<AppComponentProps> = () => {
    const server:any = useLocation();
    // new mint / source server --- comes from params
    const { serverId } = useParams<any>();

    let history = useHistory();

    const [formField,setFormField] = useState<whiteListFormField>({
        ...whitelistFormState,
        max_users: '',
        required_role: server?.state?.requiredRoleId ? server?.state?.requiredRoleId : '',
        required_role_name: server?.state?.requiredRoleName ? server.state.requiredRoleName : '',
        })
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting },setValue,getValues } = useForm<whiteListFormField, any>();
    const [present, dismiss] = useIonToast();

    const [whiteListRole,setWhiteListRole] = useState<any>([])
    const [whiteListRequireRole,setWhiteListRequireRole] = useState<any>([])
    const [isBigImage, setIsBigImage] = useState<boolean>(false);
    const [isValidImage, setIsValidImage] = useState<boolean>(false);
    const [formSubmit, setformSubmit] = useState<boolean>(false)
    const [sourceServerDetail, setSourceServerDetail] = useState<any>(null)

    const serverObject = localStorage.getItem('servers')
    let serverArray = serverObject &&  JSON.parse(serverObject)

    useEffect(() => {
        if(server?.state?.editForm){
            fetchServerDetail()
        }
    }, [server])

    useEffect(() => {
        reset(formField);
    }, [formField,server])

    let fetchServerDetail = () =>{
        getWhitelistPartnership(server?.state?.id).then((response:any)=>{
            setFormField({...response.data.data,imagePath:response.data.data.image})
        }).catch((error)=>{
            console.log("error",error)
        })
    }

    // get roles for the WL role we will give to people --- new mint --- source server
    const getWhiteListRole = () =>{
        getAllRoles(serverId,present).then((response:any)=>{
            setSourceServerDetail(response.data.sourceServer);
            setWhiteListRole(response.data.data);
        })
    }

    // get last submitted whitelist partnership
    const getLastPartnership = async() =>{
        await getLastWhitelistPartnerShip(serverArray).then((response:any)=>{
            if(response.data){

                for(let i in response.data){

                    if(response.data[i].sourceServer.discordGuildId === serverId){
                        let lastData = {...response.data[i]};

                        delete lastData.id;
                        delete lastData.required_role_name;
                        delete lastData.required_role;
                        delete lastData.expiration_date;
                        delete lastData.max_users;
                        // delete lastData.type;

                        setFormField({...lastData,imagePath:lastData.image})

                        break;
                    }
                }

            }
        })
    }

    // get roles for what is required to enter the collab
    const getWhiteListRequireRole = () =>{
        getAllRoles(server?.state?.discordGuildId,present).then((response:any)=>{
            setWhiteListRequireRole(response.data.data);
        })
    }

    let showError = (error:any) =>{
        if (isAxiosError(error)) {
            const { response: { data } = { errors: [] } } =
                error as AxiosError<{ errors: { location: string; msg: string; param: string; }[]; }>;

            if (!data || data.hasOwnProperty('error')) {
                present({
                    message: ( data as unknown as { body: string } ).body,
                    color: 'danger',
                    duration: 10000,
                });
            } else if (data.hasOwnProperty('errors')) {
                data.errors.forEach(({ param, msg }) => {
                    // if (param !== 'source_server') {
                        setError( param as keyof whiteListFormField, { message: msg, type: 'custom',});
                    // } else {
                        present({
                            message: msg,
                            color: 'danger',
                            duration: 10000,
                        });
                    // }
                });
            }else{
                present({
                    message: 'An error occurred, please look at the form above to see if you are missing something',
                    color: 'danger',
                    duration: 10000,
                });
            }
        }else{
            present({
                message: 'An error occurred, please look at the form above to see if you are missing something',
                color: 'danger',
                duration: 10000,
            });
        }
    }
    // load it on load...
    useEffect(() => {
        getWhiteListRole();
        getWhiteListRequireRole();
        getLastPartnership()
    }, [])

    return (
        <IonGrid>
            {sourceServerDetail&&
                <IonCol size="12">
                <div className='server-module-bg p-4 px-6 w-full mb-1'>
                    {sourceServerDetail?.name}
                </div>
                </IonCol>
            }
            <IonRow>
                <IonCol size="12"><h2 className="ion-no-margin font-bold text-xl"> Seamless - fill out whitelist details</h2> </IonCol>

                <div className="font-bold text-red-500">
                    <ul>
                        <li>- Note it is expected that you reach out to the DAOs before hand, and have them agree on receiving these spots. </li>
                        <li>- You must also ask for their "Required Role" (ie. DAO holder role), if they haven't set one - if you set the wrong role then nothing will work! </li>
                        <li>- You must also reach out to the SOL Decoder team to obtain a special role, in order to submit Seamless requests, and must get your very first Seamless approved before it shows up for everyone else </li>
                    </ul>
                </div>

                <IonCol size-xl="12" size-md="12" size-sm="12" size-xs="12" />

                <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" >
                    <BotServerCard serverData={server.state?.sourceServer || server.state} classes={`semless-light-card` }/>
                </IonCol>

                <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                    <form className="space-y-3"
                     // when submitting the form...
                     onSubmit={handleSubmit(async (data) => {
                        let formData = await setWhiteListFormData(data,serverId,server.state.discordGuildId)
                        try{
                            setformSubmit(true)
                            if(data.id){
                                let response = await updateWhitelistPartnership(data.id,formData)
                                present({
                                    message: 'Seamless partnership updated successfully!',
                                    color: 'success',
                                    duration: 10000,
                                });
                            }else{
                                let response = await createNewWhitelistPartnership(formData)
                                present({
                                    // message repeated 2x in code
                                    message: 'New Seamless created! Note: if this is your first Seamless, it will NOT show up for others until approved. Let the SOL Decoder team know, so they can approve your first Seamless',
                                    color: 'success',
                                    buttons: [{ text: 'Got it!', handler: () => dismiss() }],
                                    // duration: 10000,
                                });
                            }
                            // history.push(`/seamless`);
                            history.goBack();

                            reset(data);
                        }catch(error){
                            reset(data);
                            showError(error)
                        }finally{
                            setformSubmit(false)
                        }
                    })}>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                            {/* type */}
                            <WhiteListFormField fieldLable={'Giveaway Type'} fieldName={'type'} control={control} classes='mb-5' />
                            {/* expiration_date */}
                            <WhiteListFormField fieldLable={'Expiration Date'} fieldName={'expiration_date'} control={control} setValue={setValue} />
                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                            {/* max_users */}
                            <WhiteListFormField fieldLable={'Max Users'} fieldName={'max_users'} control={control} classes='mb-5' />
                            {/* whitelist_role */}
                            <WhiteListFormField fieldLable={'Whitelist Role (role they will get once Whitelisted in your new mint server)'}
                            fieldName={'whitelist_role'}
                            control={control}
                            classes='mb-5'
                            dropdownOption={whiteListRole}
                            />
                            {/* verified_role */}
                            <WhiteListFormField fieldLable={'Verified role (a role that indicates a member of your new mint server is verified)'}
                            fieldName={'verified_role'}
                            control={control}
                            classes='mb-5'
                            dropdownOption={whiteListRole}
                            showHelp={<Help description={`Some servers have a verification system in place to prevent their server being overpopulated with fake members.
                            Most systems work in a way that a member has to do a certain action like react to a message or click somewhere in order to obtain a role indicating that the user is verified in the server.
                            If your new mint server has a role for verified members, select it below. The verified role will be added alongside the whitelist role so that the member can get automatically verified in the server.`}/>}
                            />

                            {/* required_role */}
                            {whiteListRequireRole.length>0?
                                <WhiteListFormField fieldLable={'Required Role (Discord Role ID required to enter the giveaway)'}
                                fieldName={'required_role'}
                                control={control}
                                classes='mb-5'
                                dropdownOption={whiteListRequireRole}
                                ShowMessage={
                                    <span className="font-bold text-green-500">
                                        {server?.state?.requiredRoleId && server?.state?.requiredRoleName ? `'${server?.state?.name}' recommends a Required Role of ${server?.state?.requiredRoleName}` : ''}
                                    </span>
                                }
                                requiredRoleId={server?.state?.requiredRoleId}
                                requiredRoleName={server?.state?.requiredRoleName}
                                />
                                :
                                <>
                                {/* input required_role */}
                                    <WhiteListFormField fieldLable={`Required Role ID (Discord Role ID required of them in ${server?.state?.name} to enter the giveaway)`}
                                    fieldName={'required_role'}
                                    control={control}
                                    classes='mb-5'
                                    dropdownOption={whiteListRequireRole}
                                    ShowMessage={
                                        <span className="font-bold text-green-500">
                                            {server?.state?.requiredRoleId ? `'${server?.state?.name}' recommends a Required Role ID of ${server?.state?.requiredRoleId}` : ''}
                                        </span>
                                    }
                                    requiredRoleId={server?.state?.requiredRoleId}
                                    requiredRoleName={server?.state?.requiredRoleName}
                                    />
                                    {/* input required_role_name */}
                                    <WhiteListFormField fieldLable={`Required Role Name (Discord Role ID required of them in ${server?.state?.name} to enter the giveaway)`} fieldName={'required_role_name'}
                                    control={control}
                                    ShowMessage={
                                    <span className="font-bold text-green-500">
                                        {server?.state?.requiredRoleName ? `'${server?.state?.name}' recommends a Required Role Name of ${server?.state?.requiredRoleName}` : ''}
                                    </span>
                                    }

                                    />
                                </>
                            }
                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                            {/*upload image */}
                            <WhiteListFormField fieldLable={'Image to represent your DAO - Image must be less then 10MB'}
                                fieldName={'image'}
                                control={control}
                                classes='mb-5'
                                imageFieldProps={{setIsValidImage:setIsValidImage,setError:setError,getValues:getValues,setIsBigImage:setIsBigImage}}
                            />
                            {/* discordInvite Linik */}
                            <WhiteListFormField fieldLable={'Discord Invite Link (never expires, no invite limit)'} fieldName={'discordInvite'} control={control} classes='mb-5' />
                            {/* twitter Linik */}
                            <WhiteListFormField fieldLable={'Twitter Link'} fieldName={'twitter'} control={control} classes='mb-5' />
                            {/* magicEden Linik */}
                            <WhiteListFormField fieldLable={'Magic Eden drops URL'} fieldName={'magicEdenUpvoteUrl'} control={control} classes='mb-5' />
                            {/* Mint Date */}
                            {/*<WhiteListFormField fieldLable={'Mint Date'} fieldName={'mintDate'} control={control} setValue={setValue} />*/}
                            {/* mint supply */}
                            <WhiteListFormField fieldLable={'Mint Supply'} fieldName={'mintSupply'} control={control} classes='mb-5' />
                            {/* mint Price */}
                            <WhiteListFormField fieldLable={'Mint Price'} fieldName={'mintPrice'} control={control} classes='mb-5' />
                            {/* Description */}
                            <WhiteListFormField fieldLable={'Description'} fieldName={'description'} control={control} classes='mb-5' />
                        </IonCard>
                        <div className='ion-text-right'>
                            <IonButton className="cardButton" type={'submit'} disabled={isSubmitting || isBigImage  || isValidImage}>
                                {isSubmitting || formSubmit ? ( <IonSpinner /> ) : ('Submit')}
                            </IonButton>
                        </div>
                    </form>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

// @ts-ignore
export default SeamlessDetail;
