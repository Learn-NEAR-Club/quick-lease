import 'regenerator-runtime/runtime'
import React from 'react'
import Login from "./components/Login";
import Main from "./components/Main";

export default function App() {
  return (
    <>
      { !window.walletConnection.isSignedIn() ? <Login /> : <Main />}
    </>
  )
}
