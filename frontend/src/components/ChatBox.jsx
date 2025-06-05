import { Box } from "@mui/joy";
import { chatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { SelectedChat } = chatState();

  return (
    <Box
      sx={{
        display: {
          xs: SelectedChat ? "flex" : "none",
          md: "flex",
        },
        alignItems: "center",
        flexDirection: "column",
        p: 3, // padding
        width: {
          xs: "100%",
          md: "68%",
        },
        height: "100%",
        borderLeft: {
          md: "1px solid var(--joy-palette-divider)",
        },
        bgcolor: "background.body",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
};

export default ChatBox;
