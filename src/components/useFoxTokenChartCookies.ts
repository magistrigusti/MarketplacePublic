import React from 'react'
import useCookieState from '../hooks/usePersistentState';

const isColor = (strColor : string) => {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== '';
}

function useFoxTokenChartCookies() {
	const [chartDateSelected, setChartDateSelected] = useCookieState<"fromNow" | "yyyyMmDd">("chartDateSelected", "fromNow", (val) => ["fromNow", "yyyyMmDd"].includes(val));
	const [lineColorSelected, setLineColorSelected] = useCookieState<string>("lineAreaColor", "#14F195", isColor );
	const [shadedAreaColorSelected, setShadedAreaColorSelected] = useCookieState<string>("shadedAreaColor", "rgba(67, 192, 187, 0.1)", isColor);
	return {
		chartDateSelected,
		setChartDateSelected,
		lineColorSelected,
		setLineColorSelected,
		shadedAreaColorSelected,
		setShadedAreaColorSelected
	}
}

export default useFoxTokenChartCookies
