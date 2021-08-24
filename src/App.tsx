import { useEffect, useState } from "react";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import { selectUser, handleLogin } from "./features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "./firebase";
import "./App.css";
import styled from "styled-components";

const App = () => {
  const dispatch = useDispatch();
  const userAuth: any = useSelector(selectUser);
  const [description, setDescription] = useState<string>("");
  const handleSetupDescription = async () => {
    if (userAuth) {
      await db
        .collection("users")
        .doc(userAuth.id)
        .get()
        .then((data) => setDescription(data?.data()?.description || ""))
        .finally(() => {
          db.collection("users")
            .doc(userAuth.id)
            .set({
              ...userAuth,
              description: description,
            });
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        dispatch(
          handleLogin({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          })
        );
        handleSetupDescription();
      }
    });
  }, []);
  return <Container>{userAuth ? <Dashboard /> : <Login />}</Container>;
};

export default App;

const Container = styled.div`
  height: 100vh;
`;
