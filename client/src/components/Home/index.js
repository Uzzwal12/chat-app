import React, { Fragment, useState, useEffect } from "react";
import { Row, Button, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../Context/auth";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      imageUrl
      createdAt
      latestMessage {
        from
        to
        content
        createdAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($username: String!) {
    getMessages(username: $username) {
      id
      content
      from
      to
      createdAt
    }
  }
`;

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  const [getMessages, { loading: messageLoader, data: messageData }] =
    useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { username: selectedUser } });
    }
  }, [selectedUser, getMessages]);

  let userMarkUp;
  if (!data || loading) {
    <p>loading...</p>;
  } else if (data.getUsers.length === 0) {
    <p>No user has joined yet</p>;
  } else if (data.getUsers.length > 0) {
    userMarkUp = data.getUsers.map((user) => (
      <div
        className="p-3 d-flex"
        key={user.username}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div>
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected"}
          </p>
        </div>
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
        <Col className="p-0 bg-secondary" xs={4}>
          {userMarkUp}
        </Col>
        <Col xs={8}>
          {messageData && messageData.getMessages.length > 0 ? (
            messageData.getMessages.map((message) => (
              <p key={message.id}>{message.content}</p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
