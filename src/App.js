

import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import CustomButtons from './components/CustomButtons'
import { useState } from 'react'
import LoadingDots from './components/LoadingDots'
import { NoToneMapping, LinearEncoding, sRGBEncoding } from 'three'

export default function App() {

	const [ isLoaded, setIsLoaded ] = useState(false)
	const [ showHint, setShowHint ] = useState(false)
	const [ animDone, setAnimDone ] = useState(false)
	const [ hideText, setHideText ] = useState(false)
	const [ hasClicked, setHasCliked ] = useState(false)
	const [ onLoadText, setOnLoadText ] = useState('Has sido invitado-para asistir al lanzamiento-de Martinez Experience!')

	const showText = () => {
		setIsLoaded(true)
		setTimeout(()=>{
			setShowHint(true)
			addEventListener('click', animateScene)
		}, onLoadText.length * 0.05 * 1000 + 1000)
	}

	const animateScene = () => {
		setHideText(true)
		setShowHint(false)
		removeEventListener('click', animateScene)
		setTimeout(()=>{
			setHasCliked(true)
		}, onLoadText.length * 0.05 * 1000)
	}

	return (
		<>
		<div className='webgl'>
			<Canvas
				orthographic
				gl={{
					toneMapping: NoToneMapping,
					outputEncoding: sRGBEncoding
				}}
				camera={{
					zoom: 450,
					position: [
					2.8 * Math.sin(45 * Math.PI / 180),
					2,
					2.8 * Math.cos(45 * Math.PI / 180),
					]
				}}
			>	
				<Scene 
					onLoad={showText}
					startAnim={hasClicked}
					onAnim={e=>setAnimDone(true)} />
			</Canvas>
		</div>
		<LoadingDots isLoaded={isLoaded} />
		{isLoaded && 
			onLoadText.split('-').map((fragment, id)=>
				<div 
					key={id}
					style={{'--n': id, '--t': onLoadText.split('-').length}} 
					className='onload-div'>
				{fragment.split('').map((letter, idx)=>
					<span
						key={idx}
						style={{
							'--id': idx,
							'--total': onLoadText.split('-').slice(0, id).join('').length??0}} 
						className={`onload-text ${hideText?'reverse':''}`}
					>
						{letter}
					</span>
				)}
				</div>
			)
		}
		<div className={`click-hint ${showHint?'active':''}`}>
			Click para continuar
		</div>
		{hasClicked &&
			<CustomButtons show={animDone} />
		}
		</>
	)
}