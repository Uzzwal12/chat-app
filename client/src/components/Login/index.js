import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../Context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center box-shadow">
      <Col sm={8} md={6} lg={6}>
        <h3 className="text-center">Sign in</h3>
        <p className="para-message">Sign in to continue to Chats.</p>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={errors.username && "text-danger"}>
              {errors.username ?? "Username"}
            </Form.Label>
            <Form.Control
              className={errors.username && "is-invalid"}
              type="text"
              value={variables.username}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && "text-danger"}>
              {errors.password ?? "Password"}
            </Form.Label>
            <Form.Control
              className={errors.password && "is-invalid"}
              type="password"
              value={variables.password}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              Sign in
            </Button>
            <br />
            <small>
              Don't have an account <Link to="/register">Sign Up</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
