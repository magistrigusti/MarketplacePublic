import {useEffect, useState} from "react";
import {instance} from "../axios";
import {
    IonButton,
    IonCheckbox,
    IonInput,
    IonItem,
    IonLabel, IonListHeader, IonRadio, IonRadioGroup,
    useIonToast
} from "@ionic/react";
import {environment} from "../environments/environment";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase";
import { AxiosError } from "axios";

function StackedSearch({foo, onSubmit}: any) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const [formAddalertWalletAddress, setFormAddalertWalletAddress] = useState('');
    const [formLoadingAddalertWalletAddress, setFormLoadingAddalertWalletAddress] = useState(false); // form loading
    const [alertWalletAddress, setAlertWalletAddress] = useState('');
    const [discordDMs, setDiscordDms] = useState(false);
    const [firebaseAlerts, setFirebaseAlerts] = useState(false);
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    // const [alertNewTokensModalOpen, setAlertNewTokensModalOpen] = useState(false); // model open or not

    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const devMode = query.get('devMode');

    /**
     * Use Effects
     */
    /**
     * Use Effects
     */
    useEffect(() => {
        instance
            .get(`${environment.backendApi}/currentUser`)
            .then((res: any) => setAlertWalletAddress(res.data.user.walletAddress));
    }, []);

    // fill in their wallet from 'connect wallet', if set...
    // useEffect(() => {
    //     // @ts-ignore
    //     setFormAddalertWalletAddress(walletAddress);
    // }, [walletAddress]);

    /**
     * Functions
     */
        // const clickedAlertNewTokens = (val: boolean) => {
        //     setAlertNewTokensModalOpen(val);
        //     // setPopoverOpened(null);
        // }

        // in the form for alert on a token - submit button clicked
        // Should remove if unsubscribing
    const modifyAlertWalletSubmit = (shouldRemove: boolean) => {

            if ((!formAddalertWalletAddress || (formAddalertWalletAddress.length !== 43 && formAddalertWalletAddress.length !== 44)) && !shouldRemove) {
                present({
                    message: 'Error - please enter a single, valid SOL wallet address',
                    color: 'danger',
                    duration: 5000,
                    buttons: [{ text: 'hide', handler: () => dismiss() }],
                });
                return;
            }

            setFormLoadingAddalertWalletAddress(true);

            setFormAddalertWalletAddress(''); // clear the form
            // setMultWalletAryFromCookie(cookies.get('multWalletsAry')); // set array to show user on frontend

            instance
                .post(`${environment.backendApi}/receiver/modifyAlertWallet`, {
                    walletAddress: formAddalertWalletAddress || null,
                    shouldRemove,
                    discordDMs,
                    firebaseAlerts
                })
                .then((res) => {
                    const actionVerb = shouldRemove ? 'removed' : 'added';
                    present({
                        message: `Successfully ${actionVerb} the alert wallet address`,
                        color: 'success',
                        duration: 5000,
                        buttons: [{ text: 'hide', handler: () => dismiss() }],
                    });
                    setDiscordDms(false);
                    setFirebaseAlerts(false);
                    instance
                        .get(`${environment.backendApi}/currentUser`)
                        .then((res: any) => setAlertWalletAddress(res.data.user.walletAddress));
                }).catch((err : AxiosError) => {
                    if(err.response){
                        present({
                            message: err.response.data.body || "Something went wrong",
                            color: 'danger',
                            duration: 5000,
                            buttons: [{ text: 'hide', handler: () => dismiss() }],
                        });
                    }
            }).finally(() => setFormLoadingAddalertWalletAddress(false));

            /**
             * TO DO-alerts: alerts!
             *
             * in the UI tell the user the alert is going to discord over DMs
             *
             * once done:
             * - test this by sending yourself tokens between wallets
             * - add to the intro on top of fox page what this is ... then renam the cookie)
             * - update docs.sol
             *
             * ONCE IN PROD:
             * - look for enable:enable ... make it so you are able to remove the alert (unsub etc...)
             * - add a new section to home page ...to view recent alerts?
             */

        }

    const getFcmToken = () =>  {
        if (!firebaseAlerts) return;
        getToken(getMessaging(app), {
            vapidKey: "BN0qlY8sox-k4Pxrw26P5rv0vyX-04zNHf0z_jWBQikTnw14b4b4Vd_37-jpNozwvDgajgyQuwnbb0jC1HMAamM"
        })
            .then((currentToken) => {
                if (currentToken) {
                    instance.post(`${environment.backendApi}/setUserFcmToken`, {currentToken});
                } else {
                    console.error('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.error('An error occurred while retrieving token. ', err);
            });
    }

    /**
     * Renders
     */
    return (
        <>

            {/* hidden={true}  hidden={!devMode} */}
            <div  className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('fnt') ? 'text-red-600 font-medium' : ''}`}>
                    Alerts on New Tokens to your Wallet
                </h4>

                <div
                    className="ml-3 mr-3 mb-2 relative mt-2 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                    <div className="font-medium">
                        <p>
                            This alerts you when any Token (that is also listed on Fox Token Market) gets added to
                            your wallet.
                            Add a single SOL wallet address below.
                            The alert will be sent to you via a Discord DM by our bot.
                            If alerted over Discord, <a className="underline text-blue-500" target="_blank"
                                             href="https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-">you
                            must enable DMs from all users in our server</a> (note we will NEVER DM you with mint
                            links).

                            <br/>
                            <b className="text-red-500">Note: Some bugs are present with this, where it won't send any alerts, or send alerts a day late, or send duplicate alerts. We're slowly working on it - and this is disabled until then, sorry!</b>
                        </p>
                    </div>
                </div>

                <div className="ml-3 mr-3">
                    <IonItem hidden={!!alertWalletAddress}>
                        <IonLabel position="stacked" className="font-bold">
                            SOL Wallet Address
                        </IonLabel>
                        <IonInput onIonChange={(e) =>
                            setFormAddalertWalletAddress(e.detail.value!)
                        }
                                  value={formAddalertWalletAddress}
                                  placeholder="ex. 91q2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU"
                                  />
                    </IonItem>

                    <br/>

                    {/*https://ionicframework.com/docs/api/radio*/}
                    {/*value={selected} onIonChange={e => setSelected(e.detail.value)}*/}

                    <IonItem style={{"width": "250px"}} hidden={!!alertWalletAddress}>
                        <IonLabel>Discord DMs</IonLabel>
                        <IonCheckbox checked={discordDMs} onIonChange={e => setDiscordDms(e.detail.checked)} />
                    </IonItem>
                    <IonItem style={{"width": "250px"}} hidden={!!alertWalletAddress}>
                        <IonLabel>Web push notifications</IonLabel>
                        <IonCheckbox checked={firebaseAlerts} onIonChange={e => setFirebaseAlerts(e.detail.checked)} />
                    </IonItem>
                    <br/>

                    <div hidden={!alertWalletAddress}>Your current alert wallet: {alertWalletAddress}</div>

                    <IonButton
                        color="primary"
                        className="mt-5"
                        hidden={formLoadingAddalertWalletAddress || !!alertWalletAddress}
                        onClick={() => { modifyAlertWalletSubmit(false); getFcmToken();}}
                        disabled={(!discordDMs && !firebaseAlerts) || !formAddalertWalletAddress}
                    >
                        Submit
                    </IonButton>
                    <IonButton
                        color="danger"
                        className="mt-5"
                        hidden={formLoadingAddalertWalletAddress || !alertWalletAddress}
                        onClick={() => modifyAlertWalletSubmit(true)}
                    >
                        Unsubscribe
                    </IonButton>

                    {/*<IonButton*/}
                    {/*    hidden={!multWalletAryFromCookie}*/}
                    {/*    color="danger"*/}
                    {/*    className="mt-5"*/}
                    {/*    onClick={() => resetMultWallets()}*/}
                    {/*>*/}
                    {/*    Reset Stored Wallets*/}
                    {/*</IonButton>*/}

                    <div hidden={!formLoadingAddalertWalletAddress}>Loading...</div>
                </div>
            </div>
            <hr className="m-5"/>


            <h3 className="text-xl font-medium mb-3">Discord Managed Alerts</h3>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                {/*bg-yellow-800*/}
                <h4 className={`font-medium ${window.location.href.includes('fnn') ? 'text-red-600 font-medium' : ''}`}>
                    New Fox Token Market Names
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/951513272132182066" target="_blank"
                       className="underline">#analytics-etc</a> channel in Discord
                and the home page of the site shows when Tokens get official names by the Famous Fox team,
                or when a user of SOL Decoder adds a custom name to one.
                <br/>
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank"
                         className="underline">#self-roles</a> in Discord and get the <b>@fox-wl-alerts</b> role to get
                alerts when this happens
            </div>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('ma') ? 'text-red-600 font-medium' : ''}`}>
                    Mint Alerts (parsed from Discord)
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/925215482561302529" target="_blank"
                       className="underline">#mint-alerts-automated</a> channel in Discord
                and the <Link to={'mintstats'} className="underline">Mint Stats</Link> page of the site is a live feed
                that parses links from the discords we watch. It alerts when any link could contain a new mint, before
                or while it is released. The mint must be linked from two discords before it shows up. On Discord, Candy
                Machine ID and mint details are also posted, if found.
                <br/>
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank"
                         className="underline">#self-roles</a> in Discord and get the <b>@Minter</b> role to get alerts
                when this happens
            </div>

        </>
    );
}

export default StackedSearch;
