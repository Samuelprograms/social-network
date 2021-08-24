import { CircularProgress, Backdrop } from "@material-ui/core";

const Loading = () => {
  return (
    // <Backdrop open={true}>
      <CircularProgress color="inherit" />
    // </Backdrop>
  );
};

export default Loading;
