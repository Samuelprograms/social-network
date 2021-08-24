import React, { useState, useEffect } from "react";
import Post from "./Post";
import { selectUser } from "../features/userSlice";
import { db, storage } from "../firebase";
import { useSelector } from "react-redux";
import firebase from "firebase";
import styled from "styled-components";
import Loading from "../components/Loading";

const Feed: React.FC = () => {
  const [post, setPost] = useState<any>([]);
  const [postMessage, setPostMessage] = useState<string>("");
  const [pictureURL, setPictureURL] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const user = useSelector(selectUser);
  const handleValidateImage = async (e: any) => {
    setIsPosting(true);
    const file: File = e.target.files[0];
    if (
      file.name.endsWith(".jpg") ||
      file.name.endsWith(".png") ||
      file.name.endsWith(".jpeg")
    ) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`images/${file.name}`);
      await fileRef.put(file);
      setPictureURL(await fileRef.getDownloadURL());
      setIsPosting(false);
    }else {
      setPictureURL("");
      alert("You can only send image files");
      setIsPosting(false);
    }
  };
  const handlePost = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (
      (postMessage.trim().length !== 0 && !/^\s+$/.test(postMessage)) ||
      pictureURL
    ) {
      setIsPosting(true);
      db.collection("posts")
        .add({
          postBy: user,
          message: postMessage,
          image: pictureURL ? pictureURL : null,
          time: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => setPostMessage(""))
        .then(() => setPictureURL(""))
        .finally(() => setIsPosting(false))
        .catch((error) => alert(error));
    } else {
      setPostMessage("");
      alert("Please enter a post!");
    }
  };
  useEffect(() => {
    setIsPosting(true);
    const abortControler = new AbortController();
    db.collection("posts")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) =>
        setPost(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
    setIsPosting(false);
    return () => abortControler.abort();
  }, []);
  if (isPosting) {
    return <Loading />;
  }
  return (
    <Container>
      <form onSubmit={(e) => handlePost(e)}>
        <input
          value={postMessage.trimStart()}
          type="text"
          onChange={(e) => setPostMessage(e.target.value)}
        />
        {pictureURL && (
          <img style={{ width: "400px" }} src={pictureURL} alt={pictureURL} />
        )}
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(e) => handleValidateImage(e)}
        />
        <button type="submit">post</button>
      </form>
      {post.map(({ id, data }: any) => (
        <Post key={id} id={id} data={data} />
      ))}
    </Container>
  );
};

export default Feed;

const Container = styled.div`
  width: 40%;
  height: calc(100vh - 69px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`;
