import { css } from '@emotion/react'
import {
  IonCol,
  IonContent,
  IonGrid,
  IonMenu,
  IonPage,
  IonRow,
  IonSplitPane,
} from '@ionic/react'
import Sidebar from '../../components/nav/Sidebar'
import StakingPage from './StakingPage'
import LogoHeader from '../../components/nav/LogoHeader'
import './staking.scss'

function StakingLayout() {
  return (
    <IonPage>
      <IonGrid className="w-screen h-screen flex flex-col relative">
        {/* header */}
        <IonRow>
            <IonCol size="12">
              <LogoHeader />
            </IonCol>
          </IonRow>
        {/*  */}
        <IonRow className="flex-grow">
          <IonCol size="12" className="flex h-full">
            <IonSplitPane
              when="md"
              contentId="main"
              css={css`
                @media only screen and (min-width: 768px) and (max-width: 992px) {
                  --side-min-width: none;
                }
              `}
            >
              {/* SIDEBAR */}
              <IonMenu menuId="sidebar" contentId="main">
                <Sidebar />
              </IonMenu>
              {/* CONTENT */}
              <IonContent className="h-full" id="main">
                <StakingPage />
              </IonContent>
            </IonSplitPane>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  )
}

export default StakingLayout
