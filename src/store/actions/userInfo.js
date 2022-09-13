import { SET_USERINFO } from '../constants/index';
const setUserInfo = (data) => {
    return {
        type:SET_USERINFO,
        data
    }
};
export {setUserInfo};
