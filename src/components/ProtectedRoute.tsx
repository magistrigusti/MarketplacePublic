import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { isDev } from "../environments/environment";
import { RootState } from "../redux/store";
import AppRoute from "./Route";
import {IonButton} from '@ionic/react';

/**
 * Descriptions of the login flow on Login.tsx
 */

// a route to be used to protect pages against unauthenticated users
const ProtectedRoute = (props: Parameters<typeof AppRoute>[0] & {
	needsRole ?: boolean,
    computedMatch?:any
}) => {
    let history = useHistory();

	const user = useUser();

    // all routes need a role, unless needsRole: False is set on App.tsx
	const needsRole = props.needsRole ?? true;

    // set in App.tsx -- gets read from /getToken endpoint
	const hasRoles = useSelector<RootState>(state => state.user.hasRoles);
    // console.log(hasRoles);

	return user

        // ### if this is UNCOMMENTED - it will skip logging in, if in dev
        // || (isDev )
    ? (
		(needsRole
            // ### if this is UNCOMMENTED - it will skip logging in, if in dev
            // && !isDev

            ? hasRoles : true) ?
            <AppRoute {...props} /> :

            <AppRoute {...props} component={() => <div>

                <div className='text-xl font-bold'>Get whitelisted with Seamless?</div>
                Seamless offers many whitelist opportunities for existing DAOs. No screenshots, no waiting for a mod to tag you, no needing to open a ticket to get tagged. Get whitelisted in under 15 seconds. Want to learn more? <Link className="underline cursor-pointer font-bold" to="https://medium.com/@sol-decoder/sol-decoder-presents-seamless-32251a4deb43" target="_blank">
                Read our Medium article here</Link>

                <div className="mt-3" >
                    <a className='cursor-pointer underline font-bold' href='/seamless'>
                    <IonButton>Get whitelisted!</IonButton>
                    </a>
                </div>
                <br/><hr/><br/>

                <div className='text-xl font-bold'>Setting up your new mint with Seamless?</div>
                Pay only a portion of your whitelist to Communi3, SOL Decoder, and partnered top DAOs. Join our <Link to="https://discord.gg/s4ne34TrUC" target="_blank" className="underline cursor-pointer font-bold">Discord</Link> and we'll walk you through the process. Obtain all of your whitelist spots with 0 manual tagging of roles, and 100% Twitter verification
                <div className="mt-3" >
                    <a className='cursor-pointer underline font-bold' href='/dao'>
                        <IonButton>Sign my new mint up!</IonButton>
                    </a>
                </div>

                <br/>
                <div className='text-xl font-bold'>Existing DAO wanting to get whitelist spots with Seamless?</div>
                It's free, and no bots need to be added to your server. Just make a profile, and after any mint using Seamless already can give you spots in {'<'} a minute. Mints not using Seamless can get onboarded with Seamless very quickly, then give you spots

                <div className="mt-3" >
                    <a className='cursor-pointer underline font-bold' href='/dao'>
                        <IonButton>Sign my existing DAO up!</IonButton>
                    </a>
                </div>
                <br/><hr/><br/>

                <div className='text-xl font-bold'>Adding SOL Decoder Discord Bots?</div>
                We offer a variety of Discord bots to help your server with various Alpha and DAO capabilities. Future updates are free, and there are no monthly charges.

                <div className="mt-3" >
                    <a className='cursor-pointer underline font-bold' href='/dao'>
                        <IonButton>Add the SOL Decoder bots!</IonButton>
                    </a>
                </div>
                <br/><hr/><br/>

                <div className='text-xl font-bold'>Doing something else?</div>
                You cannot access this page (SOL Decoder holders only). If you feel this is an error, click "Logout" on bottom left and log back in, or otherwise buy 1 of our NFTs on Magiceden. After purchasing, you must verify within the SOL Decoder Discord (metahelix-verify channel), and then login with Discord on this website.

            </div>} />
	) : (
		<Route
			{...props}
			render={() => (
				// if user is not authenticated redirect user to login page
			<Redirect to={`/login?next=${props?.computedMatch?.url || props.path}`} />
			)}
			component={undefined}
			children={undefined}
		/>
	);
};

export default ProtectedRoute;



