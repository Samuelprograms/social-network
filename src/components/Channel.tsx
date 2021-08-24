import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSelectChannel } from "../features/channelSlice";
import { selectUser } from "../features/userSlice";
import { useHistory } from "react-router";
import { db } from "../firebase";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

interface Props {
  id: string;
  channelName: string;
  createdBy: {
    name: string;
    email: string;
    photo: string;
  };
}

const Channel: React.FC<Props> = ({ id, channelName, createdBy }) => {
  const dispatch = useDispatch();
  const user:any = useSelector(selectUser);
  const history = useHistory();
  const onSelectChannel = () => {
    dispatch(handleSelectChannel({ id, channelName, createdBy }));
    history.push(
      `/${channelName.toLowerCase().trim().replace(" ", "-")}/${id}`
    );
  };
  const handleDeleteChannel = async (id: string, channelName: string) => {
    if (
      window.confirm(
        `You are you sure you want to remove ${channelName} channel?`
      )
    ) {
      await db
        .collection("channels")
        .doc(id)
        .delete()
        .then(() => alert(`${channelName} has been deleted`))
        .finally(() => history.push("/"));
    }
  };
  return (
    <Container
      title={`${channelName}\ncreated by: ${createdBy.name}`}
      onClick={() => onSelectChannel()}
    >
      {createdBy.name === user.name && createdBy.email === user.email && (
        <IconButton
          className="channel__button"
          onClick={() => handleDeleteChannel(id, channelName)}
        >
          <ClearIcon className="channel__button__icon" />
        </IconButton>
      )}

      <Image src={createdBy.photo} alt={channelName} />
    </Container>
  );
};

export default Channel;

const Container = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  .channel__button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    background: #ffa7a7;
    color: #f00;
    padding: 6px;
    &:hover {
      background: #ff5d5d;
      color: #ffa7a7;
    }
    .channel__button__icon {
      font-size: 20px;
    }
  }
`;
const Image = styled.img`
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;
