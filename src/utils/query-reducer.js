
export default function queryReducer(state, action) {

	let { type, msg } = action

	switch (type) {
		case 'NEW_QUERY':
			return ({
				...state,
				info: '',
				waiting: true
			})
		case 'SUCCESS':
			return ({
				...state,
				waiting: false,
				tryed: true,
				succeed: true,
				info: msg??''
			})
		case 'ERROR':
			return ({
				...state,
				waiting: false,
				tryed: true,
				succeed: false,
				info: msg??''
			})
	}
}

const queryInit = {
	succeed: null,
	tryed: false,
	waiting: false,
	info: ''
}

const queryWrapper = (fn, dispatch) => {
	return async (...args) => {
		try {
			if (dispatch) await dispatch({type: 'NEW_QUERY'})
			let res = await fn(...args)
			if (!res.ok) throw new Error(res.msg ?? 'Server error')
			if (dispatch) dispatch({type: 'SUCCESS', msg: res.msg ?? ''})
			if (res.callb) res.callb()
		} catch(error) {
			let msg = error.response?.data?.message ?? error.message 
			if (dispatch) dispatch({type: 'ERROR', msg})
			console.log(msg)
		}		
	}
}


export {
	queryInit,
	queryWrapper
}