import {
  IonHeader,
  IonRouterLink,
  IonIcon,
  IonToolbar,
  IonMenuButton,
  IonButton,
  IonBadge,
  IonRippleEffect,
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { arrowBack, close, moon, search, sunny } from 'ionicons/icons'
import { queryClient } from '../../queryClient'
import SearchBar from '../SearchBar'
import useConnectWallet from '../../hooks/useConnectWallet'
import WalletButton from '../WalletButton'
import Help from '../Help'
import { css } from '@emotion/react'
import './Header.scss'
import usePersistentState from '../../hooks/usePersistentState'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { auth } from '../../firebase'
// import { signInAnonymously } from "firebase/auth";

const LogoHeader = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const smallHeaderWidth = 1024 // what size browser needs to be, before header goes small mode
  const connectWallet = useConnectWallet()
  const isDemo = useSelector<RootState>((state) => state.demo.demo)
  
  useEffect(() => {
    function resizeWidth() {
      if (window.innerWidth > smallHeaderWidth) {
        setShowMobileSearch(false)
      }
    }
    window.addEventListener('resize', resizeWidth)
    resizeWidth()

    return () => {
      window.removeEventListener('resize', resizeWidth)
    }
  }, [])

  return (
    <>
      <IonHeader
        className={`py-2 ${showMobileSearch ? 'px-2' : 'pr-10'}`}
        css={css`
          --background: var(--ion-background-color);
          ion-toolbar {
            background-color: var(--background);
          }
        `}
      >
        <IonToolbar>
          <div className="justify-between space-x-4 flex items-center">
            {/*pt-3*/}
            {!showMobileSearch && (
              <div className="flex items-center space-x-4">
                {/*hamburger sidebar*/}
                <IonMenuButton
                  color="white"
                  menu="sidebar"
                  className="md:hidden ion-no-padding"
                  css={css`
                    font-size: 32px;
                  `}
                />

                {/*site logo & home*/}
                <IonRouterLink className="text-2xl" routerLink="/" color="text">
                  <div className="flex items-center space-x-2">
                    <img
                      className="logo-height"
                      src="/assets/site-logos/logo-transparent.png"
                      alt="logo"
                    />
                    <span className="headerName logo">SOL Decoder</span>
                    {isDemo ? (
                      <IonBadge
                        color="primary"
                        hidden={!isDemo}
                        className="relative hidden sm:flex space-x-1 hover:opacity-90 py-2 px-3 items-center"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          auth.signOut()
                        }}
                      >
                        <p>demo</p>
                        <IonIcon icon={close} />
                        <IonRippleEffect />
                      </IonBadge>
                    ) : null}
                  </div>
                </IonRouterLink>
              </div>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
    </>
  )
}

export default LogoHeader
