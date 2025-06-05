import { useState } from "react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { chatState } from "../context/ChatProvider"
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";


const Chat = () => {
  const {user}=chatState();
  const [fetchAgain, setFetchAgain]=useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91.5vh",
          padding: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>

      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Chat
