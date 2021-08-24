import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { db } from "../firebase";
import Loading from "../components/Loading";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

const Profile: React.FC = () => {
  const user: any = useSelector(selectUser);
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const addDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    await db
      .collection("users")
      .doc(id)
      .update({
        description: description,
      })
      .then(() => setDescription(""))
      .catch((err) => alert(err));
  };
  const fetchData = async () => {
    await db
      .collection("users")
      .doc(id)
      .onSnapshot((snapshot) => setData(snapshot.data()));
  };
  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return <Loading />;
  } else if (data) {
    return (
      <Container>
        <img src={data.photo} alt={data.name} />
        <p>{data.name}</p>
        <p>{data.email}</p>
        <p>{data.description}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        {user.name === data.name && (
          <form action="" onSubmit={(e) => addDescription(e)}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">add description</button>
            <button
              onClick={(e) => {
                setDescription("");
                addDescription(e);
              }}
            >
              delete description
            </button>
          </form>
        )}
      </Container>
    );
  }
  return <p>no hay</p>;
};

export default Profile;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 69px);
`;
