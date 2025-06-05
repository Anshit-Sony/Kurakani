import { useEffect, useState } from "react";
import axios from "axios";
import { chatState } from "../context/ChatProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Typography, Button, Sheet, Stack } from "@mui/joy";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatLoading from "./miscellaneous/ChatLoading";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, SelectedChat, setSelectedChat, Chats, setChats, ENDPOINT } = chatState();


  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${ENDPOINT}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast.error("Error Occurred! Unable to fetch the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Sheet
      variant="outlined"
      sx={{
        display: { xs: SelectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        bgcolor: "background.body",
        width: { xs: "100%", md: "30%" },
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography level="h4" fontFamily="Work Sans" sx={{ width: "100%" }}>
          My Chats
        </Typography>
        <GroupChatModal />
      </Box>

      {/* Chat List */}
      <Sheet
        variant="soft"
        sx={{
          p: 2,
          bgcolor: "#f8f8f8",
          width: "100%",
          height: "100%",
          borderRadius: "md",
          overflowY: "auto",
        }}
      >
        {Chats?.length ? (
          <Stack spacing={1.2}>
            {Chats.map((chat) => (
              <Sheet
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  px: 2,
                  py: 1.5,
                  borderRadius: "md",
                  bgcolor:
                    SelectedChat?._id === chat._id ? "#ADD8E6" : "#E8E8E8",
                  color: SelectedChat?._id === chat._id ? "white" : "black",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: "sm",
                  },
                }}
              >
                <Typography level="title-md">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                {chat.latestMessage && (
                  <Typography level="body-sm" noWrap>
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 50) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Sheet>
            ))}
          </Stack>
        ) : (
          <ChatLoading/>
        )}
      </Sheet>
    </Sheet>
  );
};

export default MyChats;
