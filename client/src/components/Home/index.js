import React, { Fragment } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../Context/auth";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`;

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);
  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
  }

  let userMarkUp;
  if (!data || loading) {
    <p>loading...</p>;
  } else if (data.getUsers.length === 0) {
    <p>No user has joined yet</p>;
  } else if (data.getUsers.length > 0) {
    userMarkUp = data.getUsers.map((user) => (
      <div key={user.username}>
        <p>{user.username}</p>
      </div>
    ));
  }

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Col xs={4}>{userMarkUp}</Col>
        <Col xs={8}>
          <p>Messages</p>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
