import axios from "axios";

//Checks to see if token exists and if one does exist, we set the token as a common header for authentication
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
