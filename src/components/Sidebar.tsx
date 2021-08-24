import React, { useState, useEffect } from "react";
import Channel from "./Channel";
import { selectUser, handleLogout } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { db, auth } from "../firebase";
import firebase from "firebase";
import {
  selectShowSidebar,
  handleShowSidebar,
} from "../features/performanceSlice";
import { handleUnselectChannel } from "../features/channelSlice";

import styled from "styled-components";
import { useHistory } from "react-router";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import { Button } from "@material-ui/core";

interface Channels {
  id: string;
  data: {
    channelName: string;
    createdBy: any;
  };
}

const Sidebar: React.FC = () => {
  const [channels, setChannels] = useState<Channels[]>([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const showSidebar = useSelector(selectShowSidebar);
  const user: any = useSelector(selectUser);
  const handleAddChannel = async () => {
    const channelName: any = prompt("Enter channel name: ")?.trim();
    if (channelName?.length !== 0 && !/^\s+$/.test(channelName)) {
      await db
        .collection("channels")
        .add({
          channelName: channelName,
          createdBy: user,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => alert("channel created successfully"))
        .catch((error) => alert(error));
    } else {
      alert("channel name cannot be empty");
    }
  };
  const handleSignOut = async () => {
    await auth
      .signOut()
      .then(() => dispatch(handleLogout()))
      .finally(() => dispatch(handleUnselectChannel()))
      .catch((err) => alert(err));
  };
  useEffect(() => {
    db.collection("channels")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) =>
        setChannels(
          snapshot.docs.map((doc: firebase.firestore.DocumentData) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);
  if (showSidebar) {
    return (
      <Container>
        <Button
          className="sidebar__button"
          onClick={() => {
            handleSignOut();
            dispatch(handleShowSidebar());
          }}
          startIcon={<InboxIcon />}
        >
          Logout
        </Button>
        <Button
          className="sidebar__button"
          onClick={() => {
            history.push(`/profile/${user.id}`);
            dispatch(handleShowSidebar());
          }}
          startIcon={<InboxIcon />}
        >
          Profile
        </Button>
        <Button
          className="sidebar__button"
          onClick={() => {
            history.push("/feed");
            dispatch(handleShowSidebar());
          }}
          startIcon={<InboxIcon />}
        >
          Feed
        </Button>
        <Button
          className="sidebar__button"
          onClick={() => handleAddChannel()}
          startIcon={<AddIcon />}
        >
          Add Channel
        </Button>
        <Channels>
          {channels.map(({ id, data: { channelName, createdBy } }) => (
            <Channel
              key={id}
              id={id}
              channelName={channelName}
              createdBy={createdBy}
            />
          ))}
        </Channels>
      </Container>
    );
  }
  return <></>;
};

export default Sidebar;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100vh - 69px);
  overflow-y: scroll;
  width: 200px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background: #f00;
  align-items: center;
  .sidebar__button {
    width: 100%;
    padding: 20px 0px;
    margin-bottom: 1px;
    background: #aaa;
  }
`;
const Channels = styled.div`
  height: 500px;
  overflow-y: scroll;
`;
