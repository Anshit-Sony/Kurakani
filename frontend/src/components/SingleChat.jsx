import { useEffect, useState } from "react";
import { Box, Typography, IconButton, CircularProgress, Input } from "@mui/joy";
import { chatState } from "../context/ChatProvider";
import ViewModal from "./miscellaneous/ViewModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { user, SelectedChat, setSelectedChat, notification, setNotification, ENDPOINT } = chatState();

  const fetchAllMessage = async () => {
    if (!SelectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${SelectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
      toast.error("Error Occurred. Unable to fetch the messages!");
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", SelectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `${ENDPOINT}/api/message`,
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Error Occurred!");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchAllMessage();
    selectedChatCompare = SelectedChat;
  }, [SelectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [SelectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Box
      sx={{
        height: { xs: "100vh", md: "100%" },
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.body",
        borderRadius: { xs: 0, sm: "lg" },
        p: { xs: 1, sm: 2 },
      }}
    >
      {SelectedChat ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            borderRadius: "lg",
            boxShadow: "sm",
            bgcolor: "background.surface",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "neutral.plainHoverBg",
              minHeight: "60px",
              position: "relative",
            }}
          >
            {/* Back Button (visible only on small screens) */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                position: "absolute",
                left: 16,
              }}
            >
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={() => setSelectedChat("")}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {/* Chat Name */}
            <Typography
              level="title-md"
              fontWeight="lg"
              fontSize={{ xs: "md", sm: "lg" }}
              sx={{
                mx: "auto", // center only when needed
                textAlign: { xs: "center", md: "left" },
                pl: { xs: 0, md: 0 },
                ml: { xs: 0, md: 0 },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { xs: "60%", md: "100%" },
                width: { xs: "60%", md: "auto" },
              }}
            >
              {!SelectedChat.isGroupChat
                ? getSender(user, SelectedChat.users)
                : SelectedChat.chatName}
            </Typography>

            {/* Right Side Button (View/Update Modal) */}
            <Box sx={{ ml: "auto", flexShrink: 0 }}>
              {!SelectedChat.isGroupChat ? (
                <ViewModal user={getSenderFull(user, SelectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessage={fetchAllMessage}
                />
              )}
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 1, sm: 2 },
              overflowY: "auto",
              bgcolor: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: { xs: "calc(100vh - 160px)", sm: "auto" },
            }}
          >
            {loading ? (
              <CircularProgress size="lg" sx={{ margin: "auto" }} />
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: { xs: 1, sm: 2 },
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.body",
            }}
          >
            {istyping && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "30px",
                  pl: 1,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </Box>
              </Box>
            )}

            <Input
              placeholder="Write a message..."
              value={newMessage}
              onChange={typingHandler}
              fullWidth
              onKeyDown={sendMessage}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            px: 3,
            py: 4,
            borderRadius: "lg",
            bgcolor: "background.level1",
            boxShadow: "sm",
            width: "100%",
            maxWidth: { xs: "100%", sm: "400px" },
          }}
        >
          <Typography level="body-sm" color="neutral">
            Click on a user or group to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SingleChat;
