import React from 'react';
import Nav from "./components/Nav.js";
import './App.css';
import Container from "./Container";
import { AppContext, AppProvider } from "./AppContext";

function App() {
  return (
  <AppProvider>   
    <Nav />
    <Container/>
  </AppProvider>
  );
}

export default App;
