import { css } from "@emotion/react";
import React,{useState,useEffect} from "react";
import './Loader.css'
import loaderImageLogo from '../images/logo-transparent.png'

const Loader: React.FC = () => {
    const [isMobile,setIsMobile] = useState(true); // false

    // useEffect(() => {
    //     if (window.innerWidth < 525){
    //         setIsMobile(true)
    //     }
    // }, [window.innerWidth])

    return (
        <div className="h-48 w-48" >

            {isMobile ? (<div className="spinner-box">
               <img src={loaderImageLogo} className="loaderImageWrapper" alt="logo" />
                <div className="configure-border-1">
                    <div className="configure-core"></div>
                </div>
                <div className="configure-border-2">
                    <div className="configure-core"></div>
                 </div>
            </div>):(<img src="/assets/site-logos/Logo_Sol_decoder/Terminados/Gif/logo.gif" />) }

            <div className="mt-5 text-gray-200 dark:text-gray-700 font-mono font-bold pl-14" css={css``}>Loading...</div>
            {/*text-sm sm:text-xs*/}

        </div>
    );
}
export default Loader;

