import  { useState } from "react";
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Button,
  Input,
  Box,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatState } from "../../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessage }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { SelectedChat, setSelectedChat, user, ENDPOINT } = chatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/rename`,
        {
          chatId: SelectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast.success("Group name updated!");
    } catch (error) {
      toast.error("Failed to rename group");
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${ENDPOINT}/api/user?search=${query}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to search users.");
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (SelectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already in group");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/groupadd`,
        {
          chatId: SelectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("User added to group");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `${ENDPOINT}/api/chat/groupremove`,
        {
          chatId: SelectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      if (userToRemove._id === user._id) {
        setSelectedChat(null);
        handleClose();
      } else {
        setSelectedChat(data);
      }
      setFetchAgain(!fetchAgain);
      fetchAllMessage();
      toast.success("User removed");
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startDecorator={<Add />}
        size="sm"
        onClick={handleOpen}
      >
        Update Group Chat
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            width: 450,
            p: 3,
            borderRadius: "md",
            boxShadow: "lg",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ModalClose />
          <Typography level="h4">Update Group Chat</Typography>

          {/* Rename Group */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Input
              placeholder="New Group Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              fullWidth
            />
            <Button
              variant="soft"
              color="success"
              onClick={handleRename}
              loading={renameLoading}
            >
              Rename
            </Button>
          </Box>

          {/* Current Users */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {SelectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemoveUser(u)}
              />
            ))}
          </Box>

          {/* Search Users */}
          <Input
            placeholder="Add user to group"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
          )}

          {/* Leave Group Button (only if current user is NOT admin) */}
          {SelectedChat.groupAdmin?._id !== user._id && (
            <Button
              variant="soft"
              color="danger"
              onClick={() => handleRemoveUser(user)}
              fullWidth
            >
              Leave Group
            </Button>
          )}
        </ModalDialog>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
