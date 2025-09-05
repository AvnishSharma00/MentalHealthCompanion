export const LoginReducer = (state, { type, payload }) => {
  switch (type) {
    case 'EMAIL':
      return { ...state, email: payload }

    case 'PASSWORD':
      return { ...state, password: payload }

    case 'CLEAR_EMAIL':
      return { ...state, email: '', password: '' }

    case 'USERNAME':
      return { ...state, username: payload }

    case 'FULLNAME':
      return { ...state, fullName: payload }

    case 'GENDER':
      return { ...state, gender: payload }

    case 'DOB':
      return { ...state, dob: payload }

    case 'PHONE':
      return { ...state, phone: payload }

    case "LOG_IN": {
       console.log("REDUCER HIT LOG IN")
  return {
    ...state,
    username: payload.username,
    email: payload.email,
    role: payload.role,    // ✅ map backend `roles` to our state `role`
    isloggedin: true,
    loading: false
  }
}
case "LOGGED_IN":{
  console.log("Reducer hit: LOGGED_IN");
  return{
       ...state,
       isloggedin:true,
       
  }
}


    case "LOG_OUT": {
      return {
        email: "",
        password: "",
        username: "",
        fullName: "",
        gender: "",
        dob: "",
        phone: "",
        role: "",
        isloggedin: false,
        loading: false
      }
    }

    case "ROLE":
      return { ...state, role: payload }

    case "STOP_LOADING":
      return { ...state, loading: false }

    case "SPECIALIZATION":
      return{
        ...state,specialization:payload
      } 
    case "LICENSENUMBER":
      return{
        ...state,licenseNumber:payload
      }   
    case "CONTACTNUMBER":
      return{
        ...state,contactNumber:payload
      }
    case "QUALIFICATION":
      return{
        ...state,qualification:payload
      }

    default:
      return state
  }
}