export const therapistReducer = (state, { type, payload }) => {
  switch (type) {
      case 'DATE':
     return{
        ...state,
        date:payload
     }
     case 'START':
     return{
        ...state,
        startTime:payload
     }
       case 'END':
     return{
        ...state,
        endTime:payload
     }

    default:
      return state
  }
}