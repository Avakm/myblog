import { GET_ACADEMYLIST } from '../constants'


function academyReducer (state=[],action){
    const { type, data} = action
    switch (type) {
        case GET_ACADEMYLIST:
                return data
            break;
        default:
            return state
            break;
    }
}

export default academyReducer;
