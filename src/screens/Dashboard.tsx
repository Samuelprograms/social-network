import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Feed from "../components/Feed";
import Chat from "./Chat";
import Profile from "./Profile";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import General from "./General";
import styled from "styled-components";

const Dashboard: React.FC = () => {
  return (
    <Router>
      <Container>
        <Header />
        <MainContainer>
          <Sidebar />
          <Switch>
            <Route path="/feed">
              <Feed />
            </Route>
            <Route path="/profile/:id">
              <Profile />
            </Route>
            <Route path="/:channelName/:id">
              <Chat />
            </Route>
            <Route exact path="/">
              <General />
            </Route>
          </Switch>
        </MainContainer>
      </Container>
    </Router>
  );
};

export default Dashboard;

const Container = styled.div`
  height: 100%;
  width: 100%;
`;
const MainContainer = styled.div`
position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
  /* height: calc(100vh - 69px); */
`;
