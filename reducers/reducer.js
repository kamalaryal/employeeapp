const initState = {
    data: [],
    loading: true,
}

const reducer = (state = initState, action) => {
    if (action.type === 'GET_DATA') {
        return {
            ...state,
            data: action.payload,
        }
    }
    if (action.type === 'SET_LOADING') {
        return {
            ...state,
            loading: action.payload,
        }
    }
    if (action.type === 'ADD_DATA') {
        var data = state.data;
        data = data.push(action.payload);
        return {
            ...state,
        }
    }
    if (action.type === 'UPDATE_DATA') {
        var data = state.data;
        data = data.find((element, index) => {
            if (element._id === action.payload._id)
                return data[index] = action.payload;
        });
        return {
            ...state,
        }
    }
    if (action.type === 'DELETE_DATA') {
        var data = state.data;
        data.filter(element => {
            if (element._id === action.payload)
                data.pop(element);
        });
        return {
            ...state,
        }
    }
    return state;
}

export {
    reducer
}