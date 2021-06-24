import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
import classNames from "classnames";
import { useMessageDispatch, useMessageState } from "../../Context/message";

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

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }), // GET_USERS gives us data and then we dispatch it to messages context
    onError: (err) => console.log(err),
  });

  let userMarkUp;
  if (!users || loading) {
    <p>loading...</p>;
  } else if (users.length === 0) {
    <p>No user has joined yet</p>;
  } else if (users.length > 0) {
    userMarkUp = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames("user d-flex p-3", {
            "bg-white": selected,
          })}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={user.imageUrl}
            className="user-image"
          />
          <div className="ml-2">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected"}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col className="p-0 bg-secondary" xs={4}>
      {userMarkUp}
    </Col>
  );
};

export default Users;
