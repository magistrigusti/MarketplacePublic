import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonButton, IonCard, IonIcon, IonItem, useIonToast} from "@ionic/react";
import {alertOutline, helpOutline, notifications, notificationsOutline, wallet} from "ionicons/icons";
import {Tooltip} from "react-tippy";
import {useHistory} from "react-router";
import './Home.css'
import { useEffect, useState } from 'react';

const PrivacyPolicy = (props:any) => {

    /**
     *
     */
    return (
        <>

            <style>{`
                .bodystuff{
                    padding-left: 10px;
                }
                h4, h2{
                    font-weight: bold;
                    font-size: 110%;
                    padding-bottom: 10px;
                    padding-top: 10px;
                }
                h2{
                    font-size: 140%;
                }
                // p{
                //     font-size: 80%;
                // }
            `}</style>

            <div className='secondary-bg-forced m-1 p-4 rounded-xl'>
                <div className={`font-bold pb-1`}>
                    Privacy Policy
                </div>
            </div>

            {/*<div className="bodystuff">*/}
                <p>Last Modified: April 22, 2022</p>
                <br/>

                <p>
                    <strong>In brief:</strong> SOL Decoder will never share or sell your personal information.
                </p>
                <br/>

                <h4>About Us</h4>
                <p>SOL Decoder (“SOL Decoder” or “We” or “Us”) is the sole owner of soldecoder.app website (“Website”) and all of the information collected on it. Our website collects information from our users in several ways through our Website.</p>
                <p>By using our Website, you consent to our Website’s Privacy Policy.</p>
                <p>We do not knowingly contact or collect personal information from children under 13. If you believe We have inadvertently collected such information, please contact Us so We can either obtain parental consent or delete the information.</p>

                <h4>Online Privacy Policy Only</h4>
                <p>This Policy applies only to information collected through our Website and is not related to any information collected offline.</p>

                <h4>Policy Updates</h4>
                <p>We may update this Policy at our discretion from time to time by posting a new version on our Website. You should check our Website occasionally to ensure any changes made are suitable for you.</p>

                <h2>Which personal information is collected?</h2>

                <h4>Registration - Discord Account</h4>
                <p>In order to access certain features of the Website, you must first login with your Discord account. During registration you will be
                    required to login with Discord, and we will store your Discord username and user ID</p>

                <h4>Opt-in information</h4>
                <p>You may choose to store 1-3 wallets by manually entering them yourself, on the Fox Token page (which we store in our database). You may also choose to subscribe to alerts on a specific wallet, and we then store all of the tokens on your wallet as well as store a unique Firebase messaging identifier if you choose web alerts. All of these features are opt-in and completely optional</p>

                {/*<h4>Cookies</h4>*/}
                {/*<p>We do not use cookies for tracking purposes.</p>*/}
                {/*<p><strong>You have the ability to accept or decline cookies*/}
                {/*    by modifying the settings in your browser. However, you may not be able to use all the interactive features*/}
                {/*    of the Website.</strong></p>*/}

                {/*<h4>Log Files</h4>*/}
                {/*<p>Like most websites, We use web server log files. Records*/}
                {/*    in our log files include internet protocol (IP) addresses, browser types, internet service providers*/}
                {/*    (ISP's), referring pages, exit pages, platform types, and date/time stamps. We use web server log files to*/}
                {/*    administer the site, to provide broad traffic information for site planning purposes, and to ensure that our*/}
                {/*    terms of service agreement are being adhered to. IP addresses are not tied to personally identifiable*/}
                {/*    information in our web server log files.</p>*/}

                <h4>Web beacons (Clear GIFs)</h4>
                <p>Web beacons are tiny graphics with a unique identifier
                    that allow Us to track usage patterns, count users who have visited a particular page, etc. Web beacons only
                    collect limited information, including a cookie number, time and date of a page view, and a description of
                    the page on which the web beacon resides. These beacons do not carry any personally identifiable information
                    and are only used to track the effectiveness of Website. We use web beacons in connection with Google
                    Analytics service. The information generated related to our Website is used to create reports about the use
                    of the Website. Google will store this information. Please refer to Google's privacy policy to get more
                    information.</p>


                <h4>Security</h4>
                <p>We use Secure Socket Layer (SSL) encryption technology in
                    order to protect certain information that you submit. This type of technology protects you from having your
                    information intercepted by anyone while it is being transmitted to our Website. While on a secure
                    page the “lock” icon in the browser window is displayed, confirming that a secure,
                    encrypted connection has been established with the Website. We work hard to ensure that our Website is
                    secure and that we meet industry standards.</p>


                <h4>Links to other sites</h4>
                <p>At our discretion We can add links (web links) to other
                    websites from our Website. These websites can be run by third parties with separate and independent privacy
                    policies. We, therefore, have no responsibility or liability for the content, activities or privacy policies
                    of those linked sites. We suggest you read the privacy policy of each and every site that you visit. We
                    remind you that this Privacy Policy applies only to information collected by our Website.</p>

                {/*<h4>Announcements and Newsletters</h4>*/}
                {/*<p>*/}
                {/*    On rare occasions it is necessary to send out service-related announcements or important newsletters. For*/}
                {/*    instance, if our service is interrupted for a prolonged period or major functionality upgrade is released,*/}
                {/*    We might send all users an email message.*/}
                {/*</p>*/}

                {/*<h4>Customer Service</h4>*/}
                {/*<p>*/}
                {/*    In response to a user's direct support inquiry, We may send email(s) providing assistance with regards to his/her questions.*/}
                {/*</p>*/}

            <div className='secondary-bg-forced m-1 p-4 rounded-xl'>
                <div className={`font-bold pb-1`}>
                    Terms of Service
                </div>
            </div>

            <p>Last Modified: June 11, 2022</p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the soldecoder.app website (the "Service") operated by RST LLC ("us", "we", or "our").</p>
            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
            <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

            <h4>Termination</h4>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of
                liability.</p>

            <h4>Governing Law</h4>
            <p>These Terms shall be governed and construed in accordance with the laws of the United States, without
                regard to its conflict of law provisions.</p>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions
                of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our
                Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>

            <h4>No Investment Advice Provided</h4>
            <p>Any alerts, opinions, chats, messages, news, research, analyses, prices, or other information contained on this Website are provided as general market information for
                educational and entertainment purposes only, and do not constitute investment advice. The Website should not be relied upon as a substitute for extensive
                independent market research before making your actual trading decisions. Opinions, market data, recommendations or any other content is subject to change
                at any time without notice. Our website will not accept liability for any loss or damage, including without limitation any loss of profit, which may
                arise directly or indirectly from use of or reliance on such information.</p>
            <p>We do not recommend the use of technical analysis as a sole means of trading decisions. We do not recommend making hurried trading decisions.
                You should always understand that PAST PERFORMANCE IS NOT NECESSARILY INDICATIVE OF FUTURE RESULTS.</p>

            <h4>Liability & Warranty</h4>
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
                OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>

            <h4>Changes</h4>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion.</p>
            <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>

            <h4>Contact Us</h4>
            <p>If you have any questions about these Terms, please contact us.</p>



            {/*</div>*/}


        </>
    )
}

export default PrivacyPolicy;
