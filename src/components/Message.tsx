import React from "react";

interface Props {
  data: {
    message: string;
    sendBy: {
      id: string;
      name: string;
      email: string;
    };
    time: {
      seconds: number;
    };
  };
}

const Message: React.FC<Props> = ({ data }) => {
  const { message, sendBy, time } = data;
  return (
    <>
      <p>{message}</p>
      <pre>{JSON.stringify(sendBy, null, 2)}</pre>
      <p>{new Date(time?.seconds * 1000).toUTCString()}</p>
    </>
  );
};

export default Message;
