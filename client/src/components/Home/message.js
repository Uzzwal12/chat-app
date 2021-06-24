import React from "react";
import moment from "moment";
import classNames from "classnames";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAuthState } from "../../Context/auth";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  return (
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
        className={classNames("d-flex my-3", {
          "ml-auto": sent,
          "mr-auto": received,
        })}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill bg-primary", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          <p className={classNames({ "text-white": sent })} key={message.id}>
            {message.content}
          </p>
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default Message;
