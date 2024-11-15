import { Chart } from "chart.js";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import usePersistentState from "../hooks/usePersistentState";
import { RootState } from "../redux/store";


interface Color {
	name : string;
	main : `#${string}`;
	mainRgb : `${number},${number},${number}`;
	contrast : `#${string}`;
	contrastRgb : `${number},${number},${number}`;
	shade: `#${string}`;
	tint : `#${string}`;

}
const colors : Color[]  = 
	[
		{
			name : "primary",
			main : "#0052FF",
			mainRgb : "0,82,255",
			contrast: "#F9F8F6",
			contrastRgb : "249, 248, 246",
			shade : "#0048e0",
			tint: "#1a63ff"
		}
	]


export const colorsByName : { [name : string] : Color }= colors.reduce(
    (obj, color) => Object.assign(obj, { [color.name]: color }),
    {}
);

Chart.defaults.scale.grid.display = false;
function Theme({ children } : {
	children : React.ReactNode
}) {

	const [mode] = usePersistentState("mode", "dark");

  useLayoutEffect(() => {
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(mode);
	// Chart.defaults.color = mode === "dark" ? colorsByName.primary.contrast : "#161616";
	Chart.defaults.color = colorsByName.primary.contrast ;
  }, [mode])
  return (
      <>
          <style>{`
		 	:root {
				${colors.map(color => `
					--ion-color-${color.name} : ${color.main};
					--ion-color-${color.name}-rgb : ${color.mainRgb};
					--ion-color-${color.name}-contrast : ${color.contrast};
					--ion-color-${color.name}-contrast-rgb : ${color.contrastRgb};
					--ion-color-${color.name}-shade : ${color.shade};
					--ion-color-${color.name}-tint : ${color.tint};
				`).join("\n")}
			} 
		  `}</style>
		  {children}
      </>
  );
}

export default Theme