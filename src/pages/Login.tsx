import {IonButton, IonCol, IonIcon, IonLabel, IonRouterLink, IonRow, isPlatform} from '@ionic/react';
import React, {useEffect, useMemo, useState} from 'react';
import {Redirect, useHistory} from 'react-router';
import {instance} from '../axios';
import Loader from '../components/Loader';
import {useUser} from '../context/UserContext';
import {environment} from '../environments/environment';
import {auth} from '../firebase';
import {  signInAnonymously, signInWithCustomToken } from "firebase/auth";
import "./Login.css"
import { InAppBrowser }  from "@awesome-cordova-plugins/in-app-browser"
import { useDispatch } from "react-redux"
import IosLogo from '../images/app-store.png'
import AndroidLogo from '../images/playstore.png'
import {logoDiscord, logoTwitter,logoYoutube} from "ionicons/icons";
import usePersistentState from '../hooks/usePersistentState';
import meLogo from '../images/me.png';

function Login() {
    const history = useHistory()
	const dispatch = useDispatch();
    const user = useUser();
    const { nextUrl, urlCode, discordError } = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        // the login page also works as the redirect page for discord oauth

        // authorization code returned by discord in the search query after user authorises the site
        const urlCode = params.get('code');

        // the url to redirect to after user succesfully logs in
        const nextUrl = params.get('next') || params.get('state') || '/';
        // the error , if any, returned by discord
        const discordError = params.get('error_description');
        return { urlCode, nextUrl, discordError };
    }, []);

    const [error, setError] = useState(discordError);

    const [code,setCode] = useState(urlCode);
    const [next,setNext] = useState(nextUrl);

    // loading state which stores whether an access token is being issued or not
    const [loading, setLoading] = useState(!!code);

    //check open in mobile-web or Browser
    const DeviceCheck = isPlatform('mobileweb');
    const [mode] = usePersistentState("mode", "dark");



    const isMobileDevice = useMemo(() => isPlatform("mobile"), []);

    useEffect(() => {
        if (code && !error && !user) {
            // exchange authorization code given by discord for an access token which we can sign in with using firebase
            // this is defined on discord_auth.js

            // console.log(code)
            instance
                .post(
                    '/getToken',
                    { code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(({ data }) => {
                    // console.log(data);
					// auth.setPersistence(browserLocalPersistence)

                    localStorage.setItem('servers',JSON.stringify(data.servers));
                    localStorage.setItem('roleList',JSON.stringify(data.roles));
                    localStorage.setItem('isLogin','isLogin'); // used for showing search bar or not, and stuff

                    // console.log('servers: ' + data.servers);
                    console.log('roles: ' + data.roles);

                    return signInWithCustomToken(auth, data.body).then(async (userCredential: any) => {
                        const user = userCredential.user;
                        // console.log("user:::::::::::::", user);
                        localStorage.setItem('uid', user.uid);
                        // localStorage.setItem('token', JSON.stringify(user.accessToken));

                    });
                })
                .catch((e) => {
                    console.error(e);

                    if (e?.response?.status === 403){
                        // You need a proper role in Discord before accessing the site. Buy the NFT then go to the 'metahelix-verify' channel
                        setError("An error occurred. Please try again or contact us");
                    }else {
                        setError('Something went wrong, please try again. You may also try using a VPN program, and not a VPN in your browser (as people in Russia are  currently banned by Google). Some anti-virus programs like Bullguard can block the site, so unblock it there.');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [code, error, user]);
    // if user is already authenticated redirect them to the last page they were on if any. or otherwise to the home page

    // if user is authenticated, redirect user to previous page
    return user ? (
        // null
        <Redirect to={next} />
    ) : (
        <>
            {!loading ? (
                <>
                 {DeviceCheck ?
                        <>
                            <IonRow>
                                <IonCol size='6' >
                                <div className='ion-text-right'>
                                    <IonButton href="#"  className='iosButton ionTextRight' fill='clear'
                                        onClick={() =>{
                                           window.open( `https://apps.apple.com/in/app/sol-decoder/id1619922481`);
                                        }} >
                                            <img src={IosLogo} />
                                    </IonButton>
                                </div>
                                </IonCol>
                                <IonCol size='6'  >
                                    <IonButton href="#" className='androidButton ionTextLeft' fill='clear'
                                        onClick={() =>{
                                            window.open( `https://play.google.com/store/apps/details?id=com.soldecoder.app`);
                                        }} >
                                        <img src={AndroidLogo} />
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </>
                        : ''}
                    {/*text-center*/}
                    <div className= {`flex ${isMobileDevice ? 'flex-col': 'flex-row'}`}>
                            <div className={` ${isMobileDevice ? 'w-full mt-4' : 'w-1/3 mt-10' }`}>
                                <div className={`${isMobileDevice ? "text-center" : ""}`}>
                                    <IonLabel className={`text-4xl font-bold`}>
                                        Sign In
                                    </IonLabel>
                                </div>
                                <div className={`flex flex-col mr-2 ${isMobileDevice ? "mt-6 mr-0" : 'mt-10'}`}>

                                    {/* REPEATED TWICE ON THIS PAGE - DIFFERING SCOPES */}
                                    <IonButton className='mb-4 h-11' color={ mode === 'dark' ? '' : "dark"}
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            params.set(
                                                'redirect_uri',
                                                `${!isMobileDevice ? window.location.origin : environment.ionicAppUrl}/login`
                                            );
                                            params.set('state', next);
                                                const urlToRedirect = `https://discord.com/api/oauth2/authorize?client_id=${
                                                environment.clientId
                                                }&response_type=code&scope=identify+guilds+guilds.members.read&${params.toString()}`;
                                                setError("")

                                                if(isMobileDevice){
                                                    const browser = InAppBrowser.create(urlToRedirect, '_blank', 'location=yes');
                                                    browser.on("beforeload")
                                                    browser.on('loadstart').subscribe((event: { url: string; }) => {
                                                        const eventUrl = new URL(event.url)
                                                        if(eventUrl.origin === environment.ionicAppUrl && eventUrl.pathname === '/login'){
                                                            const code = eventUrl.searchParams.get('code');
                                                            if(code){ setCode(code); setLoading(true) };
                                                            setNext(eventUrl.searchParams.get("next") || eventUrl.searchParams.get('state') || "/");
                                                            browser.close();
                                                        }
                                                    })
                                                }
                                                else { window.location.href = urlToRedirect; }
                                        }} >
                                            { <IonIcon icon={logoDiscord} className="big-emoji mr-3"/>} Login with Discord
                                    </IonButton>
                                    <div className='flex flex-row items-center justify-between ml-1 mr-1'>
                                        <div className='login-btn-devider'/> OR <div className='login-btn-devider'/>
                                    </div>
                                    <IonButton className='buy-nft-btn mt-4 h-11'color='medium' onClick={()=> window.open('https://magiceden.io/marketplace/soldecoder', "_blank")}>
                                        <img src={meLogo} className="me-logo mr-2"/>
                                         3538990656448999412281579
                                    </IonButton>
                                    <IonButton className='buy-nft-btn mt-3 h-11' color='medium' onClick={()=> window.open('https://discord.gg/sol-decoder', "_blank")}>
                                        { <IonIcon icon={logoDiscord} className="big-emoji mr-2"/>}
                                        Join the Discord
                                    </IonButton>
                                </div>
                            </div>


                            <div className={`login-right-side-wrapper w-full justify-center flex flex-col rounded-md ${isMobileDevice ? 'pl-4 mt-4 pb-4 pt-4 pr-2' : 'pl-10 pr-4' }`} style={{height:isMobileDevice ? 'auto'  : '' }}>

                                {/*this is the error msg at top! no delete!*/}
                                <p className="text-red-500 my-4 text-xl">
                                    {error}
                                </p>

                                <div className="title-text text-4xl font-bold flex">
                                    New to<br/>SOL Decoder ?
                                </div>
                                <div className={`title-text flex flex-col mt-4`}>
                                    <span>Use of the site / apps is locked to holders of one of our NFTs, <a href="https://magiceden.io/marketplace/soldecoder" className="underline" target="_blank">which you can purchase on the left.</a> </span>
                                    <br/>
                                    <span>After purchasing one, please join <a href="https://discord.gg/sol-decoder" target="_blank" style={{"textDecoration": "underline"}}>our Discord</a> and verify to get a role which allows access to the site / apps.</span>
                                    <br/>

                                    <span>  Follow us <a href="https://twitter.com/SOL_Decoder" target="_blank" className="underline">on Twitter<IonIcon icon={logoTwitter} className="big-emoji ml-1"/></a></span>
                                    <span>Read a Twitter thread of what we do <a href="https://twitter.com/SOL_Decoder/status/1516759793884712965 " target="_blank" className="underline">here</a></span>

                                    <span>Read our <a href="https://docs.soldecoder.app" target="_blank" className="underline">docs here</a> </span>

                                    <div >View our official YouTube channel to view videos about our website / Discord <a href="https://www.youtube.com/playlist?list=PLeuijfzk0Wfv3rgrurWKo26l7rNy4lJE_" target="_blank" className="underline">here <IonIcon icon={logoYoutube} className="big-emoji ml-1"/></a></div>
                                    <span> Read our <IonRouterLink href="/privacy" className="pr-7 underline text-inherit">Privacy Policy & ToS</IonRouterLink> </span>
                                    <br/>
                                    <hr/>
                                    <br/><span>Full access to SOL Decoder is only available to those holding one of our NFTs. If you still want to click around the site to see what we offer, then try out the demo below. Note that you will only see old data, and some features are disabled.</span>

                                    <div className={`mt-4 mb-5 flex ${isMobileDevice ? 'self-center flex-col' : ' flex-row'}`}>
                                        <IonButton className='h-11 w-48' color="dark" onClick={() => {signInAnonymously(auth)}}>
                                            Try our demo
                                        </IonButton>
                                    </div>
                                </div>
                            </div>
                    </div>
                </>

            ) : (
                <div className="h-48 w-48">
                    <Loader />
                </div>
            )}
        </>
    );
}

export default Login;
