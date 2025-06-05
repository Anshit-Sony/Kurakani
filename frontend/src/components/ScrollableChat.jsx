import { useEffect, useRef } from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/joy";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { chatState } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = chatState();
  const bottomRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        maxHeight: "100%", // Adjust based on your layout
        px: 1,
      }}
    >
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id;

          return (
            <Box
              key={m._id}
              sx={{
                display: "flex",
                justifyContent: isOwn ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                px: 1,
              }}
            >
              {!isOwn &&
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip title={m.sender.name} arrow>
                    <Avatar
                      src={m.sender.pic}
                      alt={m.sender.name}
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        mb: "4px",
                      }}
                    />
                  </Tooltip>
                )}

              <Box
                sx={{
                  backgroundColor: isOwn ? "#BEE3F8" : "#B9F5D0",
                  borderRadius: "20px",
                  px: 2,
                  py: 1,
                  maxWidth: "75%",
                  mt: isSameUser(messages, m, i, user._id) ? 1 : 2,
                  ml: !isOwn ? isSameSenderMargin(messages, m, i, user._id) : 0,
                }}
              >
                <Typography level="body-sm">{m.content}</Typography>
              </Box>
            </Box>
          );
        })}
      {/* Scroll target */}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ScrollableChat;
