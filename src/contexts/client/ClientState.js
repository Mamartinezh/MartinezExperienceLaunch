
import { useRef, useEffect, useState } from 'react'
import { useContext, createContext } from 'react'

const ClientContext = createContext()

const useClientContext = () => {
	return useContext(ClientContext)
}

const initCursorSettings = {
    isOn: true,
    delta: 0.3,
    damping: 0.01
}

export default function ClientState({children}) {

	const cursor = useRef({x: 0, left: 0, offset: 0})
	const aspect = useRef(window.innerWidth / window.innerHeight)
	const sizes = useRef({width: window.innerWidth, height: window.innerHeight})
	const [ cursorSettings, setCursorSettings ] = useState(initCursorSettings)

	useEffect(()=>{
		addEventListener('resize', updateAspect)
		addEventListener('mousemove', updateCursor)
		return () => {
			removeEventListener('resize', updateAspect)
			removeEventListener('mousemove', updateCursor)
		}
	}, [])

	const updateCursor = (e) => {
	    if (!cursorSettings.isOn) return
	    let posX =  e.clientX / sizes.current.width - 0.5
	    cursor.current.left += (posX - cursor.current.x) * cursorSettings.delta
	    cursor.current.x = posX
	}


	const updateAspect = (e) => {
		sizes.current = {width: window.innerWidth, height: window.innerHeight}
		aspect.current = sizes.current.width / aspect.current.height
	}


	return (
		<ClientContext.Provider 
			value={{
				sizes,
				cursor,
				aspect,
				cursorSettings,
				setCursorSettings
			}} 
		>
			{children}
		</ClientContext.Provider>
	)
}

export { ClientContext, useClientContext }