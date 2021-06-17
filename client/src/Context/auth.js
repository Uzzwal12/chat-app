import React, { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const AuthState = createContext();
const AuthDispatch = createContext();

let user = null
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresIn = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresIn) {
    localStorage.removeItem("token");
  } else {
    user = decodedToken;
  }
} else {
  console.log("No token found");
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
      };

    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });

  return (
    <AuthDispatch.Provider value={dispatch}>
      <AuthState.Provider value={state}>{children}</AuthState.Provider>
    </AuthDispatch.Provider>
  );
};

export const useAuthState = () => useContext(AuthState);
export const useAuthDispatch = () => useContext(AuthDispatch);
