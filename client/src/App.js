import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";
import "./App.scss";
import Register from "./components/Register/index";
import Login from "./components/Login/index";
import Home from "./components/Home/index";

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="pt-5">
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
