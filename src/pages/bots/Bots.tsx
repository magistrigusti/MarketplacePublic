import React, { useEffect, useState } from 'react';
import { AppComponentProps } from '../../components/Route';
import { MintPackages, FoxTokenPackage } from './BotLIstItem';

const Bots: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const [isMobile, setIsMobile] = useState(false);

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    return (
        <>
            {isMobile ? (
                <>
                    <MintPackages />
                    <FoxTokenPackage/>
                </>
            ) : (
                <>
                    <div className="flex flex-row w-full">
                        <div className="w-1/2 ">
                            <MintPackages />
                        </div>
                        <div className="w-1/2">
                            <FoxTokenPackage/>
                        </div>
                    </div>
                    
                </>
            )}
        </>
    );
};

export default Bots;
