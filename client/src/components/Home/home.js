import React, { Fragment, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";
import { useAuthDispatch, useAuthState } from "../../Context/auth";
import { useMessageDispatch } from "../../Context/message";
import Users from "./users";
import Messages from "./messages";

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      content
      from
      to
      createdAt
    }
  }
`;

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      id
      content
      createdAt
      messageId
    }
  }
`;

const Home = () => {
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);
  const { data: reactionData, error: reactionError } =
    useSubscription(NEW_REACTION);

  console.log("reactionData", reactionData);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);

    if (reactionData) {
      const reaction = reactionData.newReaction;
      console.log("reactionsubs",reaction)
      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          reaction,
        },
      });
    }
  }, [reactionError, reactionData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

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
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
};

export default Home;
