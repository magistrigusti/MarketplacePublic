import { css } from '@emotion/react';
import { set } from 'immer/dist/internal';
import React, { useEffect, useState } from 'react';

interface Props {
    date: string;
	setExpired ?: (expired : boolean) => unknown
}

// not sure if this works or not, so excluded months from getTimeAgo
function monthFromDays(days: number) {
    let daysNumber = days;
    const year = new Date().getFullYear();
    const defaultReturn = {
        months: 0,
        remainingDays: 0,
    };
    if (0) return defaultReturn;
    if (days > 366) return defaultReturn;
    let months = 0;
    let remainingDays = 0;
    for (let i = 0; i < 11; i++) {
        const daysInMonth = new Date(year, i + 1, 0).getDate();
        if (daysNumber > daysInMonth) {
            daysNumber -= daysInMonth;
            months++;
        } else {
            remainingDays = daysNumber;
            break;
        }
    }
    return {
        months,
        remainingDays,
    };
}
function getTimeAgo(dateFuture: Date, dateNow: Date) {
    if (dateFuture <= dateNow) {
        return null;
    }
    let seconds = Math.floor((+dateFuture - +dateNow) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

	let days = Math.floor(hours / 24)
    // let { months, remainingDays } = monthFromDays(days);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    const data = {
        days,
        hours,
        minutes,
        seconds,
    };

    const dataMap = new Map<string, number>();
    Object.entries(data).forEach(([key, value]) => {
        dataMap.set(key, value);
    });

    let removedPrevious = true;
    let n = 0;
    for (const [key, value] of dataMap.entries()) {
        if (removedPrevious && value === 0 && n < 1) {
            dataMap.delete(key);
        } else removedPrevious = false;
        n++;
    }
    const dataToReturn: { [index: string]: string | number } = {};
    n = 0;
    for (const [key, value] of dataMap.entries()) {
        if (n < 3) {
			if(value < 10){
				dataToReturn[key] = "0" + value;
			}
			else { 
				dataToReturn[key] = value;
			}
            n++;
        } else {
            break;
        }
    }
    return dataToReturn;
}

function TimeAgo({ date, setExpired }: Props) {
    const [timeLeft, setTimeLeft] = useState<
        ReturnType<typeof getTimeAgo> | undefined
    >(undefined);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeLeft = getTimeAgo(new Date(date), now);
            setTimeLeft(timeLeft);
			if(timeLeft === null){
				setExpired?.(true)
			}
			else if(timeLeft){
				setExpired?.(false)
			}

        }, 1000);
        return () => clearInterval(interval);
    }, [date]);
    return timeLeft !== undefined ? (
        <p className={`timeLeft space-x-2 my-4 flex justify-end`}>
            {timeLeft !== null
                ? Object.entries(timeLeft).map(([key, value]) => (
                      <span className="p-2 text-sm timeCard rounded-md" key={key}>
                          {value}
                          {key.charAt(0).toUpperCase()}
                      </span>
                  ))
                : null}
        </p>
    ) : (
        <p className="timeLeft">Loading...</p>
    );
}

export default TimeAgo;
