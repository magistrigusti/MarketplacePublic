import React, { useEffect, useMemo ,useState} from 'react';
import { AppComponentProps } from '../../../components/Route';
import { IonLabel, IonButton, useIonToast, IonGrid, IonRow, IonCol, IonCard,IonSpinner, } from '@ionic/react';
import './multipleWhiteListAdd.scss';
import {  useHistory, useLocation, useParams } from 'react-router';
import {  useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Loader from '../../../components/Loader';
import Help from '../../../components/Help';
import { createNewWhitelistPartnership, getAllRoles, getLastWhitelistPartnerShip, setWhiteListFormData, whitelistFormState } from '../service/whiteListServices';
import WhiteListFormField from '../components/WhiteListFormField';
import { FormFields, multipleField, multipleServerDetails } from '../service/whiteListModalType';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */
const AddMultipleWhiteList: React.FC<AppComponentProps> = () => {
    const getServer:any = useLocation();

    let history = useHistory();
    // get selected server list from redux store
    const multipleServerList:any = useSelector<RootState>(state => state.whiteList.selectMultipleServerList);


    // create form data
    const [formField,setFormField] = useState<multipleField>({
        ...whitelistFormState,
        multipleServerDetails:[],
        })

    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, setValue,getValues} = useForm<multipleField, any>();

    const { fields, append } = useFieldArray({
        control,
        name: "multipleServerDetails"
      });

    let botData:any = localStorage.getItem('requiredBotData')
    // console.log('requiredUserRole:',JSON.parse (botData))
    let requiredRoleForUser = JSON.parse (botData)

    const [present, dismiss] = useIonToast();
    const [whiteListRole,setWhiteListRole] = useState<any>([]) // Whitelist Role dropdown value
    const [loaderFlag, setLoaderFlag] = useState(false) //loader flag
    const [isBigImage, setIsBigImage] = useState<boolean>(false);
    const [isValidImage, setIsValidImage] = useState<boolean>(false);
    let [whiteListServer, setWhiteListServer] = useState<multipleServerDetails[]>([]) //selected server state
    const [sourceServerDetail, setSourceServerDetail] = useState<any>(null)

    const serverObject = localStorage.getItem('servers')
    let serverArray = serverObject &&  JSON.parse(serverObject)

    // create serverarray filed
    const watchFieldArray = watch("multipleServerDetails");
    const controlledFields = fields.map((field, index) => {
        return {
          ...field,
          ...watchFieldArray[index]
        };
      });


    //   get Whitelist Role dropdown value
    useEffect(() => {
        getWhiteListRole()
    }, [])

    // check multiple server List and set list in whiteListServer state
    useEffect(() => {
        if(multipleServerList.length>0){
        let arr:multipleServerDetails[] =[];
        // error solved ( Cannot assign to read only property) and create obj for serverDetails
            for (let index = 0; index < multipleServerList.length; index++) {
                const element = multipleServerList[index];
                arr.push({
                    max_users:'',
                    required_role:element.requiredRoleId ? element.requiredRoleId : requiredRoleForUser.requiredRoleId,
                    id:element.id,
                    name:element.name,
                    discordGuildId:element.discordGuildId,
                    required_role_dropdown:[],
                    required_role_name:element.requiredRoleName ? element.requiredRoleName : requiredRoleForUser.requiredRoleName ,
                })
            }

            setWhiteListServer([...arr])
        }else{
            history.goBack()
        }
    }, [multipleServerList])



// get WhiteListRequireRole by server descorGuildId
    useEffect(() => {

    if(whiteListServer.length>0){

    let fetchRequiredRoleByDiscordGuildId = async() =>{
        setLoaderFlag(true)
        let lastSubmitData:any ={}

        await getLastWhitelistPartnerShip(serverArray).then((response:any)=>{
            if(response.data){
                 let lastData = {...response.data[response.data.length-1]}
                delete lastData.id
                lastSubmitData = lastData
            }
        })

        let results = await Promise.all(whiteListServer.map(async (server): Promise<any> => {
            let RequiredRoles:any = await getWhiteListRequireRole(server.discordGuildId);
            server.required_role_dropdown = RequiredRoles
            return server
        }));
        setFormField({...formField,...lastSubmitData,multipleServerDetails:results})
        setLoaderFlag(false)
    }
    fetchRequiredRoleByDiscordGuildId()
    }
    }, [whiteListServer.length])


// reset form value
    useEffect(() => {
        reset(formField)
    }, [formField])


// get roles for the WL role we will give to people --- new mint --- source server
      const getWhiteListRole = async() =>{
       await getAllRoles(getServer.state,present).then((response:any)=>{
                setSourceServerDetail(response.data.sourceServer);
                setWhiteListRole(response.data.data);
        })
    }

    // get roles for what is required to enter the collab
    const getWhiteListRequireRole = async(discordGuildId:string) =>{
        let response:any = await getAllRoles(getServer.state,present)
        return response.data.data
    }


// add whiteList Server
    let multipleWhiteListServerAdd = async(data:any) =>{
        let formData = await setWhiteListFormData(data)
            try {
                let response = await createNewWhitelistPartnership(formData)
                return response
            } catch (error:any) {
                let {response} = error
                return {...response.data,status:response.status}
            }
    }


    // lodaer show
    if(loaderFlag){
        return (<Loader />)
    }
    // content show
    return (
        <div className='add_multiple_whitelist_wrapper'>
        <IonGrid>

        {sourceServerDetail&&
            <IonCol size="12">
            <div className='server-module-bg p-4 px-6 w-full mb-5'>
                {sourceServerDetail?.name}
            </div>
            </IonCol>
        }

        <form className="space-y-3"// when submitting the form...
            onSubmit={  handleSubmit(async (data) => {
                let WhiteListFomrArray = data.multipleServerDetails.map((server)=>{
                    let createObj = {
                        image: data.image,
                        target_server: server.discordGuildId,
                        source_server: getServer.state,
                        max_users: server.max_users ,
                        expiration_date: data.expiration_date,
                        type: data.type,
                        description: data.description,
                        twitter: data.twitter,
                        discordInvite: data.discordInvite,
                        magicEdenUpvoteUrl:data.magicEdenUpvoteUrl || '',
                        whitelist_role:data.whitelist_role,
                        required_role:server.required_role,
                        required_role_name:server.required_role_name,
                        mintDate:data.mintDate,
                        mintSupply :data.mintSupply,
                        mintPrice :data.mintPrice,
                        verified_role:data.verified_role
                    }
                    return createObj
                })

                // call multiple Time Api
                let results = await Promise.all(WhiteListFomrArray.map(async (server): Promise<any> => {
                    let response = await multipleWhiteListServerAdd(server)
                    return response
                }));



                let successResponse:any = [] //successes response
                let failedResponse:any = [] // failed response
                // check How many response success and failed
                results.map((result)=>{
                    if(result.status === 200){
                        successResponse.push(result)
                    }else{
                        failedResponse.push(result)
                    }
                })

                // show Success Message and Error Message
                let failedServerDetails:any[] = []
                if(failedResponse.length>0){

                    failedResponse.map((response:any,index:number)=>{
                        let serverDetail:any = formField.multipleServerDetails.find((server)=>server.discordGuildId===response.server.id)
                        failedServerDetails.push(serverDetail)
                        if(!response.server.name){
                            response.server.name = serverDetail.name
                        }

                        response.errors?.map((err:any)=>{
                            if(err.param==='required_role'){
                                setError(`multipleServerDetails.${index}.required_role`, { type: 'custom', message: err.msg })
                            }else{
                                setError(err.param, { type: 'custom', message: err.msg })
                            }
                        })

                        present({
                            message: `Couldn't create whitelist partnership for ${response.server.name} server.`,
                            color: 'danger',
                            duration: 10000,
                        });
                    })

                }else{
                    present({
                        // message repeated 2x in code
                        message: 'New Seamless created! Note: if this is your first Seamless, it will NOT show up for others until approved. Let the SOL Decoder team know, so they can approve your first Seamless',
                        color: 'success',
                        buttons: [{ text: 'Got it!', handler: () => dismiss() }],
                        // duration: 20000,
                    });
                    history.goBack();
                }

                if(failedServerDetails.length>0){
                    let values = getValues()
                    let multipleServerDetails:multipleServerDetails[] =[]
                     values.multipleServerDetails.forEach((server:any,index:number)=>{
                        failedServerDetails.map((faieldServer:any)=>{
                            if(server.discordGuildId===faieldServer.discordGuildId){
                                multipleServerDetails.push(server)
                            }
                        })
                    })
                    setFormField({...values,multipleServerDetails:multipleServerDetails})
                }

            })}>

            <IonRow>
                <IonCol size="12"><h2 className="ion-no-margin font-bold text-xl"> Seamless - fill out whitelist details</h2> </IonCol>

                <IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12" />



                    <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" >
                        {/*  maultiple server maping */}
                        {controlledFields.map((controlledField,index)=>{
                                return(
                                    <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card" key={index}>
                                        <div className='mb-5'>
                                        <IonLabel className="card-detail-wrapper">{controlledField.name}</IonLabel>
                                        </div>
                                        {/* Max Users */}
                                        <WhiteListFormField fieldLable={'Max Users'} multipleFieldName={`multipleServerDetails.${index}.max_users` as const} fieldName={'max_users'} control={control} classes='mb-5' />

                                        {controlledField?.required_role_dropdown?.length>0?
                                        <WhiteListFormField fieldLable={'Whitelist Role (role they will get once Whitelisted in your new mint server)'}
                                        multipleFieldName={`multipleServerDetails.${index}.required_role` as const}
                                            fieldName={'required_role'}
                                            control={control}
                                            classes='mb-5'
                                            dropdownOption={controlledField?.required_role_dropdown}
                                            ShowMessage={
                                                <span className="font-bold text-green-500">
                                                    {controlledField?.required_role && controlledField?.required_role_name ? `'${controlledField?.name}' recommends a Required Role of ${controlledField?.required_role_name}` : ''}
                                                </span>
                                            }
                                            requiredRoleId={controlledField.required_role}
                                            requiredRoleName={controlledField?.required_role_name}
                                        />
                                        :
                                        <>
                                        {/* input required_role */}
                                            <WhiteListFormField fieldLable={`Required Role ID (Discord Role ID required of them in ${controlledField?.name} to enter the giveaway)`}
                                            multipleFieldName={`multipleServerDetails.${index}.required_role` as const}
                                            fieldName={'required_role'}
                                            control={control}
                                            classes='mb-5'
                                            dropdownOption={controlledField.required_role_dropdown}
                                            ShowMessage={
                                                <span className="font-bold text-green-500">
                                                    {controlledField.required_role ? `'${controlledField?.name}' recommends a Required Role ID of ${controlledField?.required_role}` : `${requiredRoleForUser?.name}' recommends a Required Role ID of ${requiredRoleForUser?.requiredRoleId}`}
                                                </span>
                                            }
                                            requiredRoleId={controlledField.required_role}
                                            requiredRoleName={controlledField?.required_role_name}
                                            />
                                         {/* input required_role_name */}
                                         <WhiteListFormField fieldLable={`Required Role Name (Discord Role ID required of them in ${controlledField?.name} to enter the giveaway)`} fieldName={'required_role_name'}
                                          multipleFieldName={`multipleServerDetails.${index}.required_role_name` as const}
                                          control={control}
                                          ShowMessage={
                                            <span className="font-bold text-green-500">
                                                {controlledField?.required_role_name ? `'${controlledField?.name}' recommends a Required Role Name of ${controlledField?.required_role_name}` : `${requiredRoleForUser?.name}' recommends a Required Role Name of ${requiredRoleForUser?.requiredRoleName}`}
                                            </span>
                                          }

                                          />
                                        </>
                                        }
                                    </IonCard>
                                )
                             })}
                    </IonCol>



                    <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                                {/* type */}
                                <WhiteListFormField fieldLable={'Giveaway Type'} fieldName={'type'} control={control} classes='mb-5' />
                                 {/* Expiration Date */}
                                 <WhiteListFormField fieldLable={'Expiration Date'} fieldName={'expiration_date'} control={control} setValue={setValue} />
                            </IonCard>



                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
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

                            {/* Image Upload */}
                            <WhiteListFormField fieldLable={'Image to represent your DAO - Image must be less then 10MB'}
                            fieldName={'image'}
                            control={control}
                            classes='mb-5'
                            imageFieldProps={{setIsValidImage:setIsValidImage,setError:setError,getValues:getValues,setIsBigImage:setIsBigImage}}
                            />
                            {/* Discord Invite Link */}
                            <WhiteListFormField fieldLable={'Discord Invite Link (never expires, no invite limit)'} fieldName={'discordInvite'} control={control} classes='mb-5' />
                            {/* Twitter Link */}
                            <WhiteListFormField fieldLable={'Twitter Link'} fieldName={'twitter'} control={control} classes='mb-5' />
                            {/*  Magic Eden upvote URL */}
                            <WhiteListFormField fieldLable={'Magic Eden drops URL'} fieldName={'magicEdenUpvoteUrl'} control={control} classes='mb-5' />
                            {/* mintDate */}
                            <WhiteListFormField fieldLable={'Mint Date'} fieldName={'mintDate'} control={control} setValue={setValue} />
                            {/*  mintSupply */}
                            <WhiteListFormField fieldLable={'Mint Supply'} fieldName={'mintSupply'} control={control} classes='mb-5' />
                            {/* mint Price */}
                            <WhiteListFormField fieldLable={'Mint Price'} fieldName={'mintPrice'} control={control} classes='mb-5' />
                            {/* description */}
                            <WhiteListFormField fieldLable={'Description'} fieldName={'description'} control={control} classes='mb-5' />
                            </IonCard>
                            <div className='ion-text-right'>
                                <IonButton className="cardButton" onClick={()=> history.goBack()}>
                                    Cancel
                                </IonButton>
                                {/*  */}
                                <IonButton className="cardButton" type={'submit'} disabled={isSubmitting || isValidImage || isBigImage}>
                                    {isSubmitting ? ( <IonSpinner /> ) : ('Submit')}
                                </IonButton>
                            </div>
                    </IonCol>
            </IonRow>
        </form>
        </IonGrid>
        </div>
    );
};

// @ts-ignore
export default AddMultipleWhiteList;
