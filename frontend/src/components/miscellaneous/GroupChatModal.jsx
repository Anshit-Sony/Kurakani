import  { useState } from "react";
import { Box, Typography, Button, Input, Modal, ModalDialog } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = () => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, Chats, setChats, ENDPOINT } = chatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit =async () => {
        if(!groupChatName || !selectedUser){
            toast.warning("Fill all the Information..")
            return;
        }

        try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };

            const {data}=await axios.post(`${ENDPOINT}/api/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUser.map((u)=>u._id)),
            },config)

            setChats([data,...Chats]);
            handleClose();
            toast.success("Group Chat Created Successfully..")
        
        } catch (error) {
            toast.error("failed to create group chat..")
        }
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

  const addUserToGroup = (userToAdd) => {
    if (selectedUser.find((u) => u._id === userToAdd._id)) {
      toast(`${userToAdd.name} is already added.`);
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleDelete = (u) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== u._id));
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
        New Group Chat
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
          <Typography level="h4" textAlign="center" fontWeight="lg">
            Create a Group Chat
          </Typography>

          <Input
            placeholder="Enter the Group Name"
            variant="soft"
            size="md"
            onChange={(e) => setGroupChatName(e.target.value)}
          />

          <Input
            placeholder="Add users..."
            variant="soft"
            size="md"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Selected Users */}
          {selectedUser.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                py: 1,
                px: 0.5,
                backgroundColor: "neutral.softBg",
                borderRadius: "sm",
              }}
            >
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
          )}

          {/* Search Results */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              maxHeight: 200,
              overflowY: "auto",
              mt: 1,
            }}
          >
            {loading ? (
              <Typography level="body-sm" color="neutral">
                Loading...
              </Typography>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addUserToGroup(user)}
                  />
                ))
            )}
          </Box>

          <Button
            variant="solid"
            color="primary"
            size="md"
            onClick={handleSubmit}
            sx={{ alignSelf: "center", mt: 2 }}
          >
            Create Chat
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default GroupChatModal;
