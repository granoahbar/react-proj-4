// importing the react hooks that are going to be used
import { useState, useEffect, useCallback, createContext } from "react";
// declaring a variable called logout timer
let logoutTimer;
// crearting a variable called AuthContext with an object that will take a token, user ID, and I am not sure about the log in and log out
const AuthContext = createContext({
  token: "",
  login: () => {},
  logout: () => {},
  userId: null,
});
//writing code that calculates the time that is left before expiring the session.
// takes the current time, the expiration, and finds the remainig time by subracting the current time from the expire time.
const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime();
  const expTime = exp;
  const remainingTime = expTime - currentTime;
  return remainingTime;
};
// writing the functionality to retrieve local data.
// getting the token from local storage and then storing it as stored token.
// getting the experation from local storage and storing it as stored expiration
// getting the user ID from local storage and storing it as storeId
const getLocalData = () => {
  const storedToken = localStorage.getItem("token");
  const storedExp = localStorage.getItem("exp");
  const storedId = localStorage.getItem("userId");
  // Taking the remainin and setting it equal to the result of running thr calaculateRemainingTime function and passing in the storedExp
  const remainingTime = calculateRemainingTime(storedExp);
  // taking the remaining time and saying that if it is equal to 1000*60*30 then remove the token, expiration, and userID from the local storage. Basically expiring the session.
  // returning null because we are intentially wanting the object values to equal nothing
  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
    localStorage.removeItem("userId");

    return null;
  }
  // returning the values
  return {
    token: storedToken,
    duration: remainingTime,
    userId: storedId,
  };
};
// creating a function called AuthContextProvider that will take in some props.
export const AuthContextProvider = (props) => {
  // setting a new variable called local data that is equal to the rsult of the function called getLocalData that we wrote earlier. Which will be what we returned.
  const localData = getLocalData();
  // creating 2 new varialbe and calling them initialToken and initialID
  let initialToken;
  let initialId;
  // an if statement that is saying if local data is not null, then we will set the values of the 2 above variables to the returned token and userId
  if (localData) {
    initialToken = localData.token;
    initialId = localData.userId;
  }
  // creating 2 peices of state, token and userId. The state will change
  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialId);
  // creating a function called log out
  // seting the token and userId to nothing
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    // repeating the same functionalitly as above when the session expires
    localStorage.removeItem("token");
    localStorage.removeItem("exp");
    localStorage.removeItem("userId");
    // saying if there is a log out timer then clear it
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  // creating a function for loggin in that will take in the token, exoiration, and userId
  const login = (token, exp, userId) => {
    setToken(token);
    setUserId(userId);
    // setting the values of the token, exp, and userId
    localStorage.setItem("token", token);
    localStorage.setItem("exp", exp);
    localStorage.setItem("userId", userId);
    // using callback function and passing in the exp, and setting the returned value to the remainingTime variable
    const remainingTime = calculateRemainingTime(exp);
    // setting a varuable called logout timer to the value of the setTimeout function eith the logout function and remaining timr passed in
    logoutTimer = setTimeout(logout, remainingTime);
  };
  //using the useEffect hook to start the log out timer only when there is a local data body obj
  useEffect(() => {
    if (localData) {
      logoutTimer = setTimeout(logout, localData.duration);
    }
  }, [localData, logout]);
  //naming a variable called contextValue and then setting it to the token, login, logout, and userid
  const contextValue = {
    token,
    login,
    logout,
    userId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
