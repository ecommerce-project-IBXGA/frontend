import axios from "axios";
import setAuthToken from "../utils/authToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";
// Register User
export const registerUser = (userData, history) => (dispatch) => {
  console.log("user", userData);

  axios
    .post(`https://api.juliaveronica.com/users/register`, userData)
    // .then((res) => history.push("/signin")) // re-direct to login on successful register
    // .then((res) => {
    //   window.alert('Sign up Success')
    //   // history.push("/signin")
    // })
    .catch((err) => {
      console.log("error", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      }, window.alert('Please Fill it Correctly, The same email cannot be used'));
    });
};
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post(
      `https://api.juliaveronica.com/users/login`,

      userData
    )
    .then((res) => {
      console.log(res);
      // Save to localStorage Set token to localStorage
      const token = res.data.token;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded), window.alert('Login Success'));
      
    })
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response }, window.alert('Login Fail'))
    );
};
// Set logged in user
export const setCurrentUser = (decoded) => {
  return { type: SET_CURRENT_USER, payload: decoded };
};
// User loading
export const setUserLoading = () => {
  return { type: USER_LOADING };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
