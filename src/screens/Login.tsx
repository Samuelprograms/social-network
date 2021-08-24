import React, { useState } from "react";
import { handleLogin, selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, provider } from "../firebase";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Loading from "../components/Loading";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const user: any = useSelector(selectUser);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    await auth
      .signInWithPopup(provider)
      .then(({ user }: any) => {
        dispatch(
          handleLogin({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          })
        );
      })
      .then(() => {
        if (user) {
          db.collection("users")
            .doc(user.id)
            .get()
            .then((snapshot: any) =>
              setDescription(snapshot.data().description || "")
            );
        }
      })
      .then(() => {
        if (user) {
          db.collection("users")
            .doc(user.id)
            .set({
              ...user,
              description: description,
            });
        }
      })
      .finally(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container>
      <Button
        onClick={() => handleSignIn()}
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
      >
        Login with Google
      </Button>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
