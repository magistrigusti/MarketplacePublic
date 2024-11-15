import React, { useEffect, useMemo, useState } from 'react';

interface CustomStorageEvent extends Event {
	key ?: string;
	value? : StorageValues;
}

const originalSetItem = localStorage.setItem; 
const originalRemoveItem = localStorage.removeItem; 

localStorage.setItem = function(key,value){
	const event : CustomStorageEvent = new Event("storageValueChanged") ;
	event.key = key;
	event.value = parseWithoutError(value)
    document.dispatchEvent(event)
    originalSetItem.apply(this, [key,value]);
}
localStorage.removeItem = function(key){
	const event : CustomStorageEvent & {
		key ?: string;
	} = new Event("storageValueChanged") ;
	event.key = key;
    document.dispatchEvent(event);
    originalRemoveItem.apply(this, [key]);
}
type StorageValues = string | number| boolean;


const parseWithoutError = (value : string) : StorageValues  => {
	try {
        return JSON.parse(value as string);
    } catch (error) {
        return value;
    }
}
const getStorageValue = (name: string) => {
    const value = localStorage.getItem(name);
   	return value && parseWithoutError(value)
};

function usePersistentState<T extends StorageValues>(
    name: string,
    initialValue: T,
    customTypeGuard: (cookieValue: T) => boolean = (val) => true
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const extendedTypeGuard = (val: T | null) : val is T => {
		if(val === null){
		return false;
		}
        return typeof val === typeof initialValue
            && customTypeGuard(val)
    };
    const initialStateValue = useMemo(
        () => {
			const value = getStorageValue(name) as T;
			return extendedTypeGuard(value) ? value : initialValue;
		},
        [name]
    );
    const [value, setValue] = useState<T>(initialStateValue);

    useEffect(() => {
		document.addEventListener("storageValueChanged", (event : CustomStorageEvent) => {
			if(event.key === name){
				setValue(event.value as T);
			}
		})
	}, []);

    useEffect(() => {
        localStorage.setItem(name, JSON.stringify(value));
    }, [name,value]);

    return [value, setValue];
}

export default usePersistentState;
