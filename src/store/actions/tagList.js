import { ADD_TAG, REMOVE_TAG, EMPTY_TAG} from '../constants/index';
const addTag = data => {
	return {
		type:ADD_TAG,
		data
	};
};
const removeTag = data => {
	return {
		type:REMOVE_TAG,
		data
	};
};
const emptyTag = () => {
	return {
		type:EMPTY_TAG
	};
};
export { addTag, removeTag, emptyTag };
