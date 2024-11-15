import { useEffect, useState } from "react"

export default function useOnScreen<T extends Element = Element>(ref : React.RefObject<T>) {

	const [isIntersecting, setIntersecting] = useState(false)
  
	
  
	useEffect(() => {
	const observer = new IntersectionObserver(
		([entry]) => setIntersecting(entry.isIntersecting)
		)
	  observer.observe(ref.current as Element)
	  // Remove the observer as soon as the component is unmounted
	  return () => { observer.disconnect() }
	}, [ref])
  
	return isIntersecting
  }