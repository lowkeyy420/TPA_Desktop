import React, { useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  user: "",
  role: "",
  email: "",
});

const calculateRemainingTime = (expirationTime) => {
  //get time in mili second with new date
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjustedExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");
  const storedRefreshToken = localStorage.getItem("refresh");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    refresh: storedRefreshToken,
  };
};

async function retrieveUserId(refreshToken) {
  let id;
  let userEmail;
  let userRole;
  const apiKey = process.env.REACT_APP_FIREBASE_PROJECTKEY;
  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

  const url = "https://securetoken.googleapis.com/v1/token?key=";
  await fetch(`${url}${apiKey}`, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        id = data.user_id;
      });
    }
  });

  await fetch(`${baseURL}employees/${id}.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        userEmail = data.email;
        userRole = data.role;
      });
    }
  });

  return {
    userid: id,
    email: userEmail,
    role: userRole,
  };
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let refreshTkn;
  let userId;
  let userRole;
  let userEmail;

  if (tokenData) {
    initialToken = tokenData.token;
    refreshTkn = tokenData.refresh;
  }
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(userId);
  const [role, setRole] = useState(userRole);
  const [email, setEmail] = useState(userEmail);
  const [refresh, setRefresh] = useState(refreshTkn);

  // if token is empty return false else true
  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    setRefresh(null);
    setUser(null);
    setRole(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    localStorage.removeItem("expirationTime");
  };

  function loginHandler(token, expirationTime, refreshToken) {
    setToken(token);
    setRefresh(refreshToken);
    retrieveUserId(refreshToken).then((result) => {
      setUser(result.userid);
      setRole(result.role);
      setEmail(result.email);
    });

    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  }

  //set timer kalau ada
  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      if (!userEmail) {
        retrieveUserId(localStorage.getItem("refresh")).then((result) => {
          setUser(result.userid);
          setRole(result.role);
          setEmail(result.email);
        });
      }
    }
  }, [tokenData, userEmail]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user: user,
    role: role,
    email: email,
    refresh: refresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
