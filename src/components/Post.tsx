import React, { useState, useEffect } from "react";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import styled from "styled-components";
import { IconButton, Checkbox, FormControlLabel } from "@material-ui/core";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";

interface Props {
  id: string;
  data: {
    image: string;
    sharedBy: {
      photo: string;
      name: string;
      email: string;
    };

    postBy: {
      photo: string;
      name: string;
      email: string;
    };
    message: string;
    time: {
      seconds: number;
    };
  };
}

const Post: React.FC<Props> = ({ id, data }) => {
  const user: any = useSelector(selectUser);
  const { sharedBy, postBy, message, time, image } = data;
  const [amountLikes, setAmountLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await db
        .collection("posts")
        .doc(id)
        .delete()
        .then(() => alert("post deleted"))
        .catch((err) => alert(err));
    }
  };
  const handleSharePost = async () => {
    if (window.confirm("Are you sure you want to share this post?")) {
      await db.collection("posts").add({
        sharedBy: {
          name: user.name,
          photo: user.photo,
          email: user.email,
        },
        postBy: {
          name: postBy.name,
          photo: postBy.photo,
          email: postBy.email,
        },
        image: image,
        message: message,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };
  const handleLikePost = async (id: string) => {
    if (!isLiked) {
      await db
        .collection("posts")
        .doc(id)
        .collection("likesTo")
        .add(user)
        .then(() => setAmountLikes(amountLikes + 1));
    } else {
      await db
        .collection("posts")
        .doc(id)
        .collection("likesTo")
        .where("name", "==", user.name)
        .get()
        .then(
          async ({ docs }) =>
            await db
              .collection("posts")
              .doc(id)
              .collection("likesTo")
              .doc(docs[0].id)
              .delete()
        )
        .catch((err) => alert(err));
      setAmountLikes(amountLikes - 1);
    }
    setIsLiked(!isLiked);
  };
  const handleFetchData = async () => {
    await db
      .collection("posts")
      .doc(id)
      .collection("likesTo")
      .onSnapshot((snapshot) => setAmountLikes(snapshot.docs.length));
    await db
      .collection("posts")
      .doc(id)
      .collection("likesTo")
      .where("name", "==", user.name)
      .get()
      .then(({ docs }) => setIsLiked(docs.length > 0 ? true : false));
  };
  useEffect(() => {
    handleFetchData();
  }, []);
  return (
    <Container>
      {sharedBy ? (
        <p>
          {sharedBy.name}
          <img src={sharedBy.photo} alt={sharedBy.name} /> has shared a post
          from {postBy.name}
          <img src={postBy.photo} alt={postBy.name} />
        </p>
      ) : (
        <>
          <p>{postBy.name}</p>
          <img alt={postBy.name} src={postBy.photo} title={postBy.name} />
        </>
      )}
      <p>{new Date(time?.seconds * 1000).toUTCString()}</p>
      <strong>{message}</strong>
      {image && <img style={{ width: "400px" }} src={image} alt={image} />}
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLiked}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              onChange={() => handleLikePost(id)}
            />
          }
          label={amountLikes}
        />
        {((postBy.email === postBy.email && postBy.name === user.name) ||
          (sharedBy?.email === user.email && sharedBy?.name === user.name)) && (
          <IconButton onClick={() => handleDeletePost(id)}>
            <ClearIcon />
          </IconButton>
        )}
        <IconButton onClick={() => handleSharePost()}>
          <SendIcon />
        </IconButton>
      </div>
    </Container>
  );
};

export default Post;

const Container = styled.div`
  border: 1px solid yellowgreen;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
