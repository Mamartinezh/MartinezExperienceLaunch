
import './LoadingDots.css'

export default function LoadingDots({isLoaded}) {

	return (
	    <div className={`loading-dots ${isLoaded?'loaded':''}`}>
		    <div className='loading-dot' style={{'--delay': 0.0}}></div>
		    <div className='loading-dot' style={{'--delay': 0.5}}></div>
		    <div className='loading-dot' style={{'--delay': 1.0}}></div>
	    </div>		
	)
}