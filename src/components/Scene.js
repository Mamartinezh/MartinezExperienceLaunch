
import { useFrame, useThree } from '@react-three/fiber'
import { MeshBasicMaterial, LoopOnce, SRGBColorSpace } from 'three'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import { useRef, useEffect, useState, Suspense, primitive } from 'react'
import { useClientContext } from '../contexts/client/ClientState'


export default function Scene({onLoad, startAnim, onAnim}) {

	const control = useRef()
	const elapsed = useRef(0)
	const mainGroup = useRef()
	const floorShadow = useRef()
	const { camera, gl } = useThree()
	const { cursor, cursorSettings, sizes } = useClientContext()

	useFrame((state, delta)=>{

	    if (cursorSettings.isOn) {
	        mainGroup.current.position.x += cursor.current.left * cursorSettings.damping
	        mainGroup.current.position.z -= cursor.current.left * cursorSettings.damping
	        cursor.current.left += - cursor.current.left * cursorSettings.damping
	    	cursor.current.offset = cursor.current.x * cursorSettings.delta - cursor.current.left
	    }

	    elapsed.current += delta
	    mainGroup.current.position.y = 0.2 + Math.sin(elapsed.current) * 0.05
	    mainGroup.current.position.y = 0.2 + Math.sin(elapsed.current) * 0.05

	    if (!floorShadow.current || !startAnim || floorShadow.current.scale.x < 0.5) return
	    floorShadow.current.position.y = -0.2 - Math.sin(elapsed.current) * 0.05
		let scale = 1 - Math.sin(elapsed.current) * 0.05
		floorShadow.current.scale.set(scale, scale, scale)

	})

	const [ alphaMap, bakedMap ] = useTexture(
		[
		'./textures/alphaMap.png',
		'./textures/bakedTexture.png'
		],
		([...maps])=>{
			maps.forEach((map, id)=>{
				map.flipY = false
				if (id===0) map.colorSpace = SRGBColorSpace
				else map.colorSpace = SRGBColorSpace
			})
		}
	)

	const model = useGLTF('./models/scene/scene.glb')
	const animations = useAnimations(model.animations, model.scene)

	useEffect(()=>{
		camera.lookAt(0, 0.5, 0)

		const leafsMaterial = new MeshBasicMaterial({color: '#7e638a'})
		const justBlackMaterial = new MeshBasicMaterial({color: '#000'})
		const shadowsMaterial = new MeshBasicMaterial({alphaMap, color:'#000', transparent: true})
		const bakedMaterial = new MeshBasicMaterial({map: bakedMap})

		let children = [...model.scene.children]
		children.forEach(child=>{
			if (child.name.includes('shadow')) child.material = shadowsMaterial
			else if (child.name.includes('justBlack')) child.material = justBlackMaterial
			else if (child.name.includes('bonsaiLeafs')) child.material = leafsMaterial
			else  child.material = bakedMaterial
			if (child.name==='shadowScene') floorShadow.current = child
		})

		onLoad()
	}, [])

	useEffect(()=>{
		if (!startAnim) return
		runAnimations()
	}, [startAnim])

	useEffect(()=>{
		if (sizes.current.width < 750) {
			let zoom = sizes.current.width / (Math.sqrt(2) + 0.5)
			camera.zoom = zoom
			camera.updateProjectionMatrix()
		}		
	}, [sizes.current.width])

	const runAnimations = () =>{
		let maxDur = 0
		Object.entries(animations.actions).forEach(([name, action])=>{
			if (name.includes('initAnim')) {
				if (action._clip.duration>maxDur) maxDur = action._clip.duration
                action.setLoop(LoopOnce, 1) 
                action.clampWhenFinished = true  
                action.play()
			}
		})
		setTimeout(()=>{
			onAnim()
		}, maxDur * 1000 + 1000)
	}

	return (
		<>
			<group ref={ mainGroup }>
				<Suspense>
					<primitive object={model.scene} />
				</Suspense>
			</group>
		</>
	)
}