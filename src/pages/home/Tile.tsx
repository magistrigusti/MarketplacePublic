import {IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle} from '@ionic/react';
interface TileProps {
    name: any;
    description: any;
    author: any;
    image: any;
    link: any;
}
const Tile: React.FC<TileProps> = ({ name, description, author, image, link,}) => {
    return (
    <IonCard className="w-1/2 h-1/2" href={link}>
        <img src={image} className=""/>
        <IonCardHeader> 
            <IonCardSubtitle>{author}</IonCardSubtitle>
            <IonCardTitle>{name}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            {description}
        </IonCardContent>
    </IonCard>
    );
};
export default Tile;