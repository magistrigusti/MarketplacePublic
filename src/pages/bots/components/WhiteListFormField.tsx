import { jsx } from '@emotion/react';
import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { SetState } from 'immer/dist/internal';
import moment from 'moment';
import React, { Dispatch, memo, SetStateAction, useMemo } from 'react'
import { Controller,Control, UseFormReturn, UseFormSetValue, ControllerRenderProps, ControllerFieldState, UseFormStateReturn, FieldValues, FieldError, UseFormSetError, UseFormGetValues,  } from 'react-hook-form';
import { TextFieldTypes } from '@ionic/core';
import { useLocation } from 'react-router';

interface imgeFieldProps{
    setIsValidImage:Dispatch<SetStateAction<boolean>>
    setError:UseFormSetError<any>
    getValues:UseFormGetValues<any>
    setIsBigImage:Dispatch<SetStateAction<boolean>>
}

interface props{
    fieldLable:string
    control:Control<any>
    fieldName:string
    classes?:string
    setValue?: UseFormSetValue<any>;
    dropdownOption?:any[]
    showHelp?:JSX.Element
    requiredRoleId?:string
    requiredRoleName?:string
    ShowMessage?:JSX.Element
    imageFieldProps?:imgeFieldProps
    multipleFieldName?:any
}

interface containerProps extends props{
    fieldProps:{
        field: ControllerRenderProps<any, string>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<any>;
    }
}
let FieldContainer = (props:containerProps) =>{

    let {fieldProps, fieldName, setValue, dropdownOption, requiredRoleId, requiredRoleName, imageFieldProps}=props
    let { field: { onChange, onBlur, value, name, ref }, fieldState: { error }, } = fieldProps
    const now = useMemo(() => new Date(), []);

    if(fieldName==='type'){
        return(
            <IonSelect onIonChange={(e) => {
                    ( e.target as HTMLInputElement ).value = e.detail.value;
                    onChange(e);
                    }}
                    name={name} value={value}  onIonBlur={onBlur} ref={ref} >
                <IonSelectOption value="fcfs"> FCFS </IonSelectOption>
                {/*<IonSelectOption  value="raffle"> Raffle </IonSelectOption>*/}
            </IonSelect>
            )
    }else if(fieldName==='expiration_date'){
        return(
            <div className='flex flex-col w-full'>
                <input type="date"
                className='w-full h-10 '
                style={{backgroundColor : 'transparent'}}
                name={name}
                value={moment(new Date(value)).format('yyyy-MM-DD')}
                onBlur={onBlur}
                required
                ref={ref}
                onChange={(e) => {
                    const value = new Date(e.target.value as string);
                    value.setHours(23,59,59,999)
                    // console.log(value.toISOString())
                    setValue&&setValue('expiration_date',value.toISOString())
                    }}
                min={new Date(  +now + 86400 * 1000 ).toISOString()}
                max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()}
                />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==='max_users'){
        return(
            <div className='flex flex-col w-full'>
                <IonInput
                    className='w-full'
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string;  onChange(e); }}
                    required
                    type="number"
                    min="1"
                    name={name}
                    value={value}
                    onIonBlur={onBlur}
                    ref={ref}
                    placeholder='ie. 25'
                />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==="whitelist_role" || fieldName==="verified_role"){
        return(
            <div className='flex flex-col w-full'>
                <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                    onChange={onChange}
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    ref={ref}
                    required
                    placeholder={`${fieldName==='whitelist_role'?'Select a Whitelist Role':'Select a Verified Role'}`} >
                    <option value=''>{fieldName==='whitelist_role'?'Select a Whitelist Role':'Select a Verified Role'}</option>
                    {dropdownOption && dropdownOption.map((role:any) =>{ return (<option  key={role.id} value={role.id}> {role.name} </option>)}  )}
                </select>
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==='required_role'){
        if(dropdownOption && dropdownOption.length>0){
            return(
            <div className='flex flex-col w-full'>
                <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                    onChange={onChange}
                    name={name}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder='Select a Required Role'
                    value={value}
                    required
                    >
                        <option value='0'>Select a Required Role</option>
                        {dropdownOption && dropdownOption.map((role:any,index:number) =>{
                            return (<option  key={index}  value={role.id} defaultChecked={requiredRoleId ? role.id === requiredRoleId :false}  > {role.name} </option>)}
                        )}
                </select>
                <p className="formError"> {error?.message} </p>
            </div>
            )
        }else{
            return(
            <div className='flex flex-col w-full'>
                <IonInput
                    value={value}
                    className='w-full'
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                    type="text"
                    required
                    name={name}
                    ref={ref}
                    onIonBlur={onBlur}
                    placeholder='Required Role ID (ie. 966704866640662541)' />
                <p className="formError"> {error?.message} </p>
            </div>
            )
        }
    }else if(fieldName==='required_role_name'){
        return(
            <div className='flex flex-col w-full'>
                <IonInput
                    value={value}
                    className='w-full'
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                    type="text"
                    required
                    name={name}
                    ref={ref}
                    onIonBlur={onBlur}
                    placeholder='Required Role Name (ie. Verified Holder)' />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==="image"){
        return(
            <div className='flex flex-col w-full'>
            <IonInput
                className='w-full'
                value={value as unknown as string}
                onIonChange={(e) => {
                    const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                    const file = target .files?.[0] as FieldValues['image'];
                    if(file){
                        if(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpeg' ){
                            imageFieldProps?.setIsValidImage(false)
                            imageFieldProps?.setError('image', { type: 'custom', message: '' });
                        }else{
                            imageFieldProps?.setIsValidImage(true)
                            imageFieldProps?.setError('image', { type: 'custom', message: 'Please upload a valid Image' });
                        }

                        let file_size = file.size;
                        if((file_size/1024) < 10240){
                            imageFieldProps?.setIsBigImage(false)
                            imageFieldProps?.setError('image', { type: 'custom', message: '' });
                        }else{
                            imageFieldProps?.setIsBigImage(true)
                            imageFieldProps?.setError('image', { type: 'custom', message: 'Maximum allowed file size is 10 MB' });
                        }
                    }
                    if (file)
                        file.path =  URL.createObjectURL(file);
                    ( e.target as HTMLInputElement ).value = file as unknown as string;
                    onChange(e);
                }}
                name={name}
                ref={ref}
                required = {imageFieldProps?.getValues('imagePath') ? false : true}
                onIonBlur={onBlur}
                type={'file' as TextFieldTypes}
                accept="image/png, image/gif, image/jpeg" />
            <p className="formError"> {error?.message} </p>
        </div>
        )
    }else if(fieldName==='discordInvite'){
        return (
            <div className='flex flex-col w-full'>
            <IonInput
                className='w-full'
                value={value}
                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                type="url"
                required
                name={name}
                ref={ref}
                onIonBlur={onBlur}
                placeholder='Discord Invite Link' />
            <p className="formError"> {error?.message} </p>
        </div>
        )
    }else if(fieldName==='twitter'){
        return(
            <div className='flex flex-col w-full'>
            <IonInput
                className='w-full'
                value={value}
                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                type="url"
                required
                name={name}
                ref={ref}
                onIonBlur={onBlur}
                placeholder='Twitter Link' />
            <p className="formError"> {error?.message} </p>
        </div>
        )
    }else if(fieldName==='magicEdenUpvoteUrl'){
        return(
            <div className='flex flex-col w-full'>
                <IonInput
                    className='w-full'
                    value={value}
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                    type="url"
                    // required
                    name={name}
                    ref={ref}
                    onIonBlur={onBlur}
                    placeholder='Magic Eden drops URL (to get people to upvote it)' />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==='mintDate'){
        return(
            <div className='flex flex-col w-full'>
                <input type="date"
                className='w-full h-10 '
                style={{backgroundColor : 'transparent'}}
                name={name}
                value={value?moment(new Date(value)).format('yyyy-MM-DD'):''}
                onBlur={onBlur}
                // required
                ref={ref}
                onChange={(e) => {
                    const value = new Date(e.target.value as string);
                    setValue&&setValue('mintDate',value.toISOString())
                    }}
                />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }else if(fieldName==='mintSupply'){
        return(
            <>
                <IonInput
                    value={value}
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                    type="text"
                    // required
                    name={name}
                    ref={ref}
                    onIonBlur={onBlur}
                    placeholder='Enter your Mint Supply (ie. 1000)' />
                <p className="formError"> {error?.message} </p>
            </>
        )
    }else if(fieldName==='mintPrice'){
        return (
            <>
                <IonInput
                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                    // required
                    type="number"
                    name={name}
                    step="0.01"
                    value={ value}
                    onIonBlur={onBlur}
                    ref={ref}
                    placeholder='Enter your Mint Price (ie. 2 SOL)'
                />
                <p className="formError"> {error?.message} </p>
            </>
        )
    }else if(fieldName==='description'){
        return(
            <div className='flex flex-col w-full'>
                <IonTextarea
                    className='w-full'
                    value={value}
                    onIonChange={(e:any) => {
                        ( e.target as HTMLInputElement ).value = e.detail.value as string;
                            onChange(e);
                        }}
                    required
                    name={name}
                    ref={ref}
                    onIonBlur={onBlur}
                    placeholder='Description of your mint'
                    maxlength={2000} />
                <p className="formError"> {error?.message} </p>
            </div>
        )
    }
    return null
}


function WhiteListFormField(props:props) {

    let {classes,control,fieldName,fieldLable,showHelp,ShowMessage,multipleFieldName} = props
        return (
            <div className={classes}>
                <IonLabel className="card-detail-wrapper">{fieldLable} {showHelp&&showHelp}</IonLabel>
                <IonItem className="c-item-wrapper mt-1">
                    <Controller name={multipleFieldName || fieldName} control={control}
                    render={(fieldProps) => {
                        let { field: { onChange, onBlur, value, name, ref }, fieldState: { error }, } = fieldProps
                        // fieldName
                        return (
                            <FieldContainer {...props} fieldProps={fieldProps}  />
                        )}
                    }  />
                </IonItem>
               {ShowMessage&&ShowMessage}
            </div>
      )
}

export default memo(WhiteListFormField)
