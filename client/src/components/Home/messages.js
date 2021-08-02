import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Col, Form } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../Context/message";
import Message from "./message";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      id
      content
      from
      to
      createdAt
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

const GET_REACTIONS = gql`
  query getReactions($username: String!) {
    getReactions(username: $username) {
      id
      content
      createdAt
      messageId
    }
  }
`;

const Messages = () => {
  const dispatch = useMessageDispatch();
  const { users,reactions } = useMessageState();
  const [content, setContent] = useState("");
  const selectedUser = users?.find((user) => user.selected === true);
  const messages = selectedUser?.messages;
  // const reactions = selectedUser?.reactions;

  const [getMessages, { loading, data: messageData }] =
    useLazyQuery(GET_MESSAGES);

  const [getReactions, { data: reactionData }] =
    useLazyQuery(GET_REACTIONS);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { username: selectedUser.username } });
    }
    if (selectedUser) {
      getReactions({ variables: { username: selectedUser.username } });
    }
  }, [selectedUser, getMessages, getReactions]);

  useEffect(() => {
    if (messageData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messageData.getMessages,
        },
      });
    }
  }, [dispatch, messageData]);

  useEffect(() => {
    if (reactionData) {
      dispatch({
        type: "SET_MESSAGE_REACTION",
        payload: {
          username: selectedUser.username,
          reactions: reactionData.getReactions,
        },
      });
    }
  }, [dispatch, reactionData]);



  const submitMessage = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;

    setContent("");
    sendMessage({ variables: { to: selectedUser.username, content } });
  };

  let selectedChatMarkUp;
  if (!messages && !loading) {
    selectedChatMarkUp = (
      <p className="info-text">Select a friend to start conversation</p>
    );
  } else if (loading) {
    selectedChatMarkUp = <p className="info-text">Loading...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkUp = messages.map((message) => (
      <Message key={message.id} message={message} reactions={reactions} />
    ));
  } else if (messages.length === 0) {
    selectedChatMarkUp = <p className="info-text">You are now connected</p>;
  }

  return (
    <Col xs={8} className="p-0">
      <div className="message-box d-flex flex-column-reverse p-3">
        {selectedChatMarkUp}
      </div>
      <div className="px-3 py-2">
        <Form
          onSubmit={submitMessage}
          className={!messages && !loading && "d-none"}
        >
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control
              type="text"
              className="message-input bg-secondary rounded-pill border-0 p-3"
              placeholder="Type a message.."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
            <i
              className="fas fa-paper-plane fa-2x text-primary ml-2"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
