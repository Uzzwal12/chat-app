import React, { useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useAuthState } from "../../Context/auth";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($id: ID!, $content: String!) {
    reactToMessage(id: $id, content: $content) {
      id
      content
      createdAt
    }
  }
`;

const Message = ({ message, reactions }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  const [showPopover, setShowPopover] = useState(false);

  const reactionsArray = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setShowPopover(false),
  });

  const react = (reaction) => {
    reactToMessage({ variables: { id: message.id, content: reaction } });
  };

  const reactButton = (
    <OverlayTrigger
      transition={false}
      trigger="click"
      placement={"top"}
      show={showPopover}
      onToggle={setShowPopover}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
            {reactionsArray.map((reaction) => (
              <Button
                key={reaction}
                className="react-icon-button"
                variant="link"
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );
  const selectedReactions =
    reactions &&
    reactions.filter((reaction) => reaction.messageId == message.id);
  return (
    <div
      className={classNames("d-flex my-3", {
        "ml-auto": sent,
        "mr-auto": received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? "left" : "right"}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @h:mm a")}
          </Tooltip>
        }
        transition={false}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill bg-primary", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p className={classNames({ "text-white": sent })}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {selectedReactions &&
        selectedReactions.map((reaction) => (
          <div key={reaction.id} className="py-2 px-3 rounded-pill bg-white">
            {reaction.content}
          </div>
        ))}
      {received && reactButton}
    </div>
  );
};

export default Message;
