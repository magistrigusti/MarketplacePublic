import { IonButton, IonCard, IonCheckbox, IonGrid,  IonText } from '@ionic/react';
import { IonRow, IonCol } from '@ionic/react';
import { Dispatch, memo, SetStateAction, useEffect,useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import discordImage from '../../../images/discord.png';
import twitterImage from '../../../images/twitter.png';
import MagicEdenImage from '../../../images/me-black.png';
import { selcetServer } from '../Seamless';
import { useDispatch } from 'react-redux';
import { setMultipleList } from '../../../redux/slices/whitelistSlice';
type props = {
    serverData: any
    multipleflag?:boolean
    setSelectMultipleWhiteList?:Dispatch<SetStateAction<selcetServer[]>>
    selectMultipleWhiteList?:selcetServer[]
    classes?:string
}

const BotServerCard: React.FC<props> = (props) => {

    let { serverData,multipleflag,setSelectMultipleWhiteList,selectMultipleWhiteList,classes } = props;
    let history = useHistory();
    const { serverId } = useParams<any>();
    const dispatch = useDispatch()
    const path:any = useLocation();
    const [initiateButton, setInitiateButton] = useState<boolean>(false)
    const [showMore, setShowMore] = useState<boolean>(false);

    useEffect(() => {
        let pathSlice = path.pathname.slice(1, 15)
        if(pathSlice === 'seamlessdetail'){
            setInitiateButton(false)
        }else{
            setInitiateButton(true)
        }
    }, [path])

    // console.log('serverData--------',serverData)

    return (
        <IonCard className={`ion-no-margin multipleWhite-light-card seamlessCardWrapper ${classes&&classes}` } >
            <div className="cardImage relative">

                {/* image */}
                <img src={serverData?.image} className={serverData?.image ? 'cardMainImage' : 'cardNoImage'}
                alt=''
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.style.opacity='0'
                 }} />
                 <div className="socialMediaIcon flex items-center justify-center mt-2 absolute top-1 right-2">
                        {/*discord*/}
                        <div className='inviteIconWrapper' hidden={!serverData?.discord_link}>
                        <img  src={discordImage} className='cursor-pointer h-4' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData?.discord_link){ window.open(serverData?.discord_link) }}} />
                            </div>
                        {/*twitter*/}
                        <div className='inviteIconWrapper' hidden={!serverData?.twitter_link}>
                        <img  src={twitterImage} className='cursor-pointer h-4' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData?.twitter_link){ window.open(serverData?.twitter_link) }}} />
                            </div>
                        {/* magic eden  */}
                        <div className='inviteIconWrapper' hidden={!serverData?.magiceden_link}>
                        <img  src={MagicEdenImage} className='cursor-pointer h-4' onClick={(event)=>{
                            event.stopPropagation();
                            if(serverData?.magiceden_link){ window.open(serverData?.magiceden_link) }}} />
                            </div>
                    </div>
                    <div className='absolute mt-2 absolute top-2 left-3'>
                    {multipleflag && <IonCheckbox  className='checkboxWrapper' onIonChange={e => {
                        if(e.detail.checked){
                            setSelectMultipleWhiteList&&setSelectMultipleWhiteList((old)=>[...old,{id:serverData.id,name:serverData.name,discordGuildId:serverData.discordGuildId,requiredRoleId:serverData.requiredRoleId, requiredRoleName:serverData.requiredRoleName}])
                        }else{
                            setSelectMultipleWhiteList&&setSelectMultipleWhiteList(old=>old.filter(data=>data.id!==serverData.id))
                        }
                    }} />}
                    </div>

                <div className="cardOverlay-content py-1 px-4">

                    <div className='text-lg font-bold'>{serverData?.name}</div>


                </div>
            </div>

            <IonGrid className="py-4 px-4">

                {initiateButton &&
                    <IonRow>
                        <IonCol size="12">
                            <IonButton disabled={multipleflag} className="cardButton w-full" onClick={(event) => {
                                event.stopPropagation()
                                let obj =[{id:serverData.id,name:serverData.name,discordGuildId:serverData.discordGuildId}]
                                // dispatch(setMultipleList(obj))
                                // console.log('server id',serverId)
                                // history.push({pathname:`/seamlessdetail/${serverId}`,state:serverData})
                                history.push({pathname:`/seamlessdetail/${serverId}`,state:serverData})
                            }}>
                                Initiate Seamless
                            </IonButton>
                        </IonCol>
                    </IonRow>
                }

                {showMore ? <div  className='mb-3 card-detail-wrapper'>{serverData?.description}</div> : <div className='mb-3 card-detail-wrapper'>{serverData?.description?.substring(0, 100)}</div>}
                {serverData?.description?.length > 100 ? <button className="text-sky-500" onClick={()=> setShowMore((n)=>!n)}>{showMore ? 'Less'  : 'More'}</button> : ''}

                {/* <p  className='card-detail-wrapper'>{serverData?.description}</p> */}

                <IonRow hidden={!serverData?.twitter_followers}>
                    <IonCol size="8">
                        <IonText className='card-detail-wrapper'>Twitter Followers</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.twitter_followers || 0 } </IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.twitter_interactions}>
                    <IonCol size="8">
                        <IonText className='card-detail-wrapper'>Twitter Interaction</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.twitter_interactions || 0}</IonText>
                    </IonCol>
                </IonRow>
                <div className="content-extra-space"></div>

                <IonRow hidden={!serverData?.discord_members}>
                    <IonCol size="8">
                        <IonText className='card-detail-wrapper'>Discord Members</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="greenText">{serverData?.discord_members || 0}</IonText>
                    </IonCol>
                </IonRow>

                <IonRow hidden={!serverData?.discord_online}>
                    <IonCol size="8">
                        <IonText className='card-detail-wrapper'>Online</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-end">
                        <IonText className="BlueText">{serverData?.discord_online || 0}</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>

        </IonCard>
    );
};

export default memo(BotServerCard)
