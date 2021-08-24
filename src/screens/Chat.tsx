import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { db } from "../firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import firebase from "firebase";
import Message from "../components/Message";
import styled from "styled-components";
import Loading from "../components/Loading";

interface Messages {
  id: string;
  data: any;
}

const Chat: React.FC = () => {
  const user = useSelector(selectUser);
  const history = useHistory();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [message, setMessage] = useState<string>("");
  const { channelName, id } = useParams<{ channelName: string; id: string }>();
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleSendMessage = async (id: string) => {
    if (message.trim().length !== 0 && !/^\s+$/.test(message)) {
      setIsSendingMessage(true);
      await db
        .collection("channels")
        .doc(id)
        .collection("messages")
        .add({
          message: message,
          sendBy: user,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => setMessage(""))
        .finally(() => setIsSendingMessage(false))
        .catch((err) => alert(err));
    } else {
      alert("Please enter a message");
    }
  };
  const handleSearchChannel = async () => {
    setIsLoading(true);
    await db
      .collection("channels")
      .doc(id)
      .get()
      .then((data) =>
        !data.exists ? history.push("/") : handleGetMessages(id)
      )
      .catch((err) => console.log(err));
    setIsLoading(false);
  };
  const handleGetMessages = (id: string) => {
    db.collection("channels")
      .doc(id)
      .collection("messages")
      .orderBy("time", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearchChannel();
  }, [channelName, id]);
  if (!isLoading) {
    return (
      <Container>
        {channelName}
        <div style={{ border: "2px solid red" }}>
          {messages.map(({ id, data }) => (
            <Message key={id} data={data} />
          ))}
        </div>
        <input
          type="text"
          value={message.trimStart()}
          onChange={(e) => setMessage(e.target.value)}
        />
        you are in {id}
        <button
          disabled={isSendingMessage}
          onClick={() => handleSendMessage(id)}
        >
          send message to {channelName}
        </button>
      </Container>
    );
  }
  return <Loading />;
};

export default Chat;

const Container = styled.div`
  width: 100%;
`;
