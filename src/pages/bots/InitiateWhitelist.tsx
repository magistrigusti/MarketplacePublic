import { css } from '@emotion/react';
import { TextFieldTypes } from '@ionic/core';
import { IonButton, IonDatetime, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonTextarea, useIonToast, } from '@ionic/react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { instance } from '../../axios';
import { Server } from '../../types/Server';
import { AxiosError } from 'axios';
import isAxiosError from '../../util/isAxiosError';
import './SeamlessDetail.scss';


// not used anymore



function InitiateWhitelist() {

    return (
        <>

            </>
        );


}


export default InitiateWhitelist;
