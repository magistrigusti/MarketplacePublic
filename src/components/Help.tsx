
import { IonIcon, IonItem } from '@ionic/react'
import { Tooltip } from 'react-tippy'
import { helpOutline } from "ionicons/icons"
import { css } from '@emotion/react';

interface Props {
	description: string;
}
function Help({ description } : Props) {
	const helpToolTipStyle = css`
				--padding-top: 0.5rem;
				--padding-bottom: var(--padding-top);
				--background: var(--ion-color-step-300);
				background: var(--background);
			`
  return (
      < >
          <Tooltip
              trigger="mouseenter"
              position="bottom-end"
              html={
                  <IonItem
                      lines="none"
                      className="max-w-[320px] rounded whitespace-pre-line"
					  css={helpToolTipStyle}
                  >
                      {description}
                  </IonItem>
              }
			 
          >
              <IonIcon
                  className="rounded-full p-1 text-lg"
                  icon={helpOutline}
				  css={helpToolTipStyle}
              />
          </Tooltip>
      </>
  );
}

export default Help