
import './CustomButtons.css'
import QueryButton from './QueryButton'
import { useState, useReducer, useRef } from 'react'

//Utils & reducers
import queryReducer from '../utils/query-reducer'
import { queryWrapper, queryInit } from '../utils/query-reducer'

export default function CustomButtons({show=true, buttons=init}) {

	const isGoing = useRef(null)
	const [ shown, setShown ] = useState(null)
	const [ query, dispatch ] = useReducer(queryReducer, queryInit)

	const confirm = queryWrapper( async (bool) => {
		if (isGoing.current===null) isGoing.current = bool
		return await new Promise(r=>setTimeout(e=>r({ok: true}), 3000))
	}, dispatch)

	return (
		<div 
			// style={{minHeight: `${buttons.length * 40 + 40}px`}}
			className={`buttons-div ${show?'active':''}`}>
			{buttons.map((button, idx)=>
				<div key={idx} className={`custom-button ${shown!==null?shown!==idx?'hide':'':''}`}>
					<div
						onClick={e=>setShown(prev=>prev===idx?null:idx)} 
						className='button-head'> 
						{button.icon}
						<p>{button.label}</p>
						{shown===idx && <i className="fa-solid fa-chevron-up"></i>}
						{shown===null && <i className="fa-solid fa-chevron-down"></i>}
					</div>
					<div className={`hiden-content ${shown===idx}`}>
						{button.content.map(line=>
							<p key={line}>{line}</p>
						)}
						{button.link && 
							<a href={button.link.url} target={'BLANK'}>{button.link.label}</a>
						}
						{button.isConfirm && 
							<div className='confirm-buttons'>
								<QueryButton query={query} callb={e=>confirm(true)} child={<p>Si</p>} />
								{(!query.tryed && !query.waiting) &&
									<QueryButton query={query} callb={e=>confirm(false)} child={<p>No</p>} />
								}
							</div>
						}
						{button.images && 
							<div className='images-container'>
								{
									button.images.map(src=>
										<img key={src} src={src} />
									)
								}
							</div>
						}
						{button.iconLinks && 
							<div className='icons-container'>
							{button.iconLinks.map(link=>
								{return link}
							)}
							</div>
						}
					</div>
				</div>
			)}

		</div>
	)
}


const init = [
	{
		label: 'Lugar',
		icon: <i className="fa-solid fa-map-location"></i>,
		content: ['Carrera 43A N 14-143', 'El Poblado, Medellín'],
		link: {
			label: 'Ve en google maps',
			url: 'https://www.google.com/maps/place/Union+Israelita+de+Beneficencia/@6.2166814,-75.5703348,15z/data=!4m6!3m5!1s0x8e44282d9460dce1:0xa8f12c61bcf106c!8m2!3d6.2166814!4d-75.5703348!16s%2Fg%2F11csrwjndb'
		}
	},
	{
		label: 'Fecha',
		icon: <i className="fa-regular fa-calendar"></i>,
		content: ['Miércoles 10 de mayo del 2023', '6:00 P.M. a 11:00 P.M.']
	},
	{
		label: 'Síguenos',
		icon: <i className="fa-solid fa-users"></i>,
		content: ['Síguenos en nuestras redes:'],
		iconLinks: [
			<i key='ig' className="fa-brands fa-instagram" onClick={e=>window.open('https://www.instagram.com/martinezexperience/?igshid=YmMyMTA2M2Y%3D')} />,
			<i key='fb' className="fa-brands fa-facebook-f" onClick={e=>window.open('https://www.facebook.com/casamartinezeventos')} />
		]
	},
	{
		label: 'Apoyan',
		icon: <i className="fa-solid fa-money-check-dollar"></i>,
		content: [],
		images: ['./images/free.png', '/images/carnisseria-1.png', './images/easyfly.png', './images/dislicores-2.png', './images/comunicadores-antioquia.png', './images/german-express.png', './images/periodistas-antioquia.png']

	},
	{
		label: 'Confirmar',
		icon: <i className="fa-solid fa-clipboard-check"></i>,
		content: ['Confirma tu asistencia en el', 'siguiente link'],
		// isConfirm: true
		link: {
			label: <i className="fa-brands fa-whatsapp"></i>,
			url: 'https://wa.link/92lg6e'
		}
	}	
]