import React, { useState } from "react";
import { handleShowSidebar } from "../features/performanceSlice";
import { handleUnselectChannel } from "../features/channelSlice";
import { selectUser, handleLogout } from "../features/userSlice";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import styled from "styled-components";
import { IconButton, Avatar } from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";

const Header: React.FC = () => {
  const user: any = useSelector(selectUser);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    await auth
      .signOut()
      .then(() => dispatch(handleLogout()))
      .finally(() => dispatch(handleUnselectChannel()))
      .catch((err) => alert(err));
  };

  return (
    <Container>
      <IconButton onClick={() => dispatch(handleShowSidebar())}>
        <AppsIcon />
      </IconButton>
      <Avatar
        alt={user.name}
        src={user.photo}
        onClick={() => history.push("/")}
      />
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid red;
  height: 69px;
`;
