import { IonCol, IonContent, IonGrid, IonLabel, IonMenu, IonPage, IonRow, IonSplitPane } from "@ionic/react"
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Route, RouteComponentProps, RouteProps } from "react-router"
import { RootState } from "../redux/store";


export interface AppComponentProps extends RouteComponentProps {
	contentRef: React.MutableRefObject<HTMLIonContentElement | null>["current"]
}
const AppRoute : React.FC<RouteProps> = (
    { children, render, component, ...rest}
) => {
	const contentRef = useRef<HTMLIonContentElement | null>(null);
	const isDemo = useSelector<RootState>(state => state.demo.demo);


    return (
        <Route
            {...rest}
            component={undefined}
            children={undefined}
            render={(originalProps) => {
				const componentProps : AppComponentProps = {
					...originalProps,
					contentRef : contentRef.current,
				}
                return (<>
                    <IonPage>
                        <IonContent ref={contentRef}>
                        	<div className="flex flex-col h-full">
                        		<IonGrid className="flex-grow w-full">
		                            <IonRow>
		                                <IonCol
		                                    size="12"
		                                    className="flex justify-center px-[1vw]"
		                                >
	                                        {/*justify-center*/}
	
	
		                                    		<div className="w-full">
			                                    		{children
					                                        ? typeof children === 'function'
					                                            ? children(componentProps)
					                                            : children
					                                        : component
					                                        ? React.createElement(
					                                              component,
					                                              componentProps
					                                          )
					                                        : render
					                                        ? render(componentProps)
					                                        : null}
			                                    	</div>
	
		                                </IonCol>
		                            </IonRow>
		                        </IonGrid>
								{isDemo && 
                        		<div className='flex  justify-center align-text-bottom ml-2 mr-2'>
                            		<IonLabel className='text-red-500 text-2xl text-center'>You are in demo mode and there is old data only</IonLabel>
                        		</div>}
								<footer className="text-center py-2 text-sm text-gray-500">
									© RST LLC
								</footer>
                        	</div>
                        </IonContent>
                    </IonPage>
                </>)
			}}
        />
    );
};

export default AppRoute
