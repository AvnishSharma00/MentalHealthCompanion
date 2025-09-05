import { useContext, createContext, useReducer } from "react";
import { therapistReducer } from "../Reducers/therapistReducer";
const therapistContext = createContext();
const TherapistProvider = ({ children }) => {
    const initialState = {
        date: '',
        startTime: '',
        endTime: ''

    }
    const [{ date,startTime,endTime }, therapistDispatch] = useReducer(therapistReducer, initialState)
    return (
        <therapistContext.Provider value={{date,startTime,endTime, therapistDispatch }}>
            {children}
        </therapistContext.Provider>
    )
}
const useTherapist = () => useContext(therapistContext);
// eslint-disable-next-line react-refresh/only-export-components
export { TherapistProvider, useTherapist }