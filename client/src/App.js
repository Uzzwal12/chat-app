import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";
import "./App.scss";
import Register from "./components/Register/index";
import Login from "./components/Login/index";
import Home from "./components/Home/home";
import { AuthProvider } from "./Context/auth";
import { MessageProvider } from "./Context/message";
import DynamicRoute from "./DynamicRoutes";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute path="/register" component={Register} guest />
                <DynamicRoute path="/login" component={Login} guest />
                <DynamicRoute exact path="/" component={Home} auth />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
