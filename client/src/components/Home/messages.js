import React, { useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Col } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../Context/message";
import Message from "./message";

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

const Messages = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true);
  const messages = selectedUser?.messages;

  const [getMessages, { loading, data: messageData }] =
    useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { username: selectedUser.username } });
    }
  }, [selectedUser, getMessages]);

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
  }, [messageData]);

  let selectedChatMarkUp;
  if (!messages && !loading) {
    selectedChatMarkUp = <p>Select a friend</p>;
  } else if (loading) {
    selectedChatMarkUp = <p>Loading...</p>;
  } else if (messages.length > 0) {
    selectedChatMarkUp = messages.map((message) => (
      <Message key={message.id} message={message} />
    ));
  } else if (messages.length === 0) {
    selectedChatMarkUp = <p>You are now connected</p>;
  }

  return (
    <Col xs={8} className="message-box d-flex flex-column">
      {selectedChatMarkUp}
    </Col>
  );
};

export default Messages;
