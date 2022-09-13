import { SET_BREADCRUMB, SET_TAGS, SET_THEME, SET_COLLAPSE} from '../constants/index';
const setBreadCrumb = data => {
	return {
		type:SET_BREADCRUMB,
		data
	};
};
const setTags = data => {
	return {
		type:SET_TAGS,
		data
	};
};
const setTheme = data => {
	return {
		type:SET_THEME,
		data
	};
};
const setCollapse = data => {
	return {
		type:SET_COLLAPSE,
		data
	};
};

export { setBreadCrumb, setTags, setTheme, setCollapse };
