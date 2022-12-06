import { createStore } from "redux";



const initialState = {

    userdata: "",
    tailordata: "",
    userfavsuit: "",
    userfavtailor: "",
    userallposts: [],



}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case "USER_DATA":
            return { ...state, userdata: action.userdata };
        case "TAILOR_DATA":
            return { ...state, tailordata: action.tailordata };
        case "USER_FAV_SUIT":
            return { ...state, userfavsuit: action.userfavsuit };
        case "USER_FAV_TAILOR":
            return { ...state, userfavtailor: action.userfavtailor };
        case "USER_ALLPOSTS":
            return { ...state, userallposts: action.userallposts };

        default:
            return state
    }
};


export const store = createStore(reducer);