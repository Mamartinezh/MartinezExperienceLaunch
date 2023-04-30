

import './QueryButton.css'


const QueryButton = ({query, callb, child}) => {
	return (
		<div className='button-container'>
			<div
				onClick={!query.succeed?!query.waiting?callb:null:null} 
				className={`query-button 
					${query.waiting?'waiting':''} 
					${query.succeed}`}>
				{child}
				<i className="fa-solid fa-spinner query-data"></i>
				<i className="fa-solid fa-check query-data"></i>
				<i className="fa-solid fa-rotate query-data"></i>
				<i className="fa-solid fa-xmark query-data"></i>
			</div>
		</div>		
	)
}

export default QueryButton