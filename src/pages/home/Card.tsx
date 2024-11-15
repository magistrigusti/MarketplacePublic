import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonIcon,
  IonButton,
  IonLabel,
} from '@ionic/react';
import { readdir } from 'fs';
import { pin, wifi, wine, warning, walk } from 'ionicons/icons';
import React from "react";
interface CardProps {
  url: any;
  readableTimestamp: any;
  source: any;
}

const Card: React.FC<CardProps> = ({ url, readableTimestamp, source }) => {

  return (
    <>
      <IonCard>
        <IonItem onClick={()=> window.open(url, "_blank")} className="ion-activated" href="#/">
          <IonLabel>{"Source: " + source + " " + url}</IonLabel>
        </IonItem>

        <IonItem href="#/">
          <IonLabel>{readableTimestamp}</IonLabel>
        </IonItem>
      </IonCard>
    </>
  );
};
export default Card;