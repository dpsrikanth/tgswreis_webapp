const initialState = {
  profileData: {},
  configData: {},
  siteData: {},  
  TOKEN: "",
};

const AccountDetailsReducer = (state = initialState, action) => {  
  switch (action.type) {
    case "RESET":
      return initialState; // Reset to initial state
    case "LOGIN_DATA":
      return { ...state, profileData: action.payload };
    case "SITE_DATA":
      return { ...state, siteData: action.payload };
    case "CONFIG_DATA":
      return { ...state, configData: action.payload };
    case "TOKEN":
      return { ...state, TOKEN: action.payload };
    case "DPC_LIST":
      return { ...state, DPC_LIST: action.payload };
    case "DISTRICT_LIST":
      return { ...state, DISTRICT_LIST: action.payload };
    case "LOGOUT":
      return initialState; // Reset to initial state on logout
    case "SCHOOL_LIST":
      return { ...state, SCHOOL_LIST: action.payload };
    case "ZONES_LIST":
      return { ...state, ZONES_LIST: action.payload };
      case "CLASSES_LIST":
      return { ...state, CLASSES_LIST: action.payload };
    default:
      return state; // Fixed to return current state instead of initialState
  }
};

export default AccountDetailsReducer;