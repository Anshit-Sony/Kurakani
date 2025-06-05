import  { useState } from "react";
import { Box, Tooltip, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import {
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  ListDivider,
  Drawer,
  Input,
  IconButton,
} from "@mui/joy";
import { Modal, ModalDialog } from "@mui/joy";
import { chatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import CircularProgress from "@mui/joy/CircularProgress";
import Badge from "@mui/material/Badge";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, Chats, setChats, notification, setNotification, ENDPOINT } = chatState();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${ENDPOINT}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast("Error Occurred. Failed to Search");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/chat`,
        { userId },
        config
      );

      if (!Chats.find((c) => c._id === data._id)) setChats([data, ...Chats]);

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.error("An error occurred while accessing chat!");
      setLoadingChat(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#0084ff",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip title="Search User to Chat" arrow placement="bottom-end">
          <Button
            onClick={() => setOpenDrawer(true)}
            variant="outlined"
            sx={{
              backgroundColor: "transparent",
              color: "black",
              border: "none",
              width: "auto",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                color: "black",
                borderColor: "blue",
              },
              textTransform: "none",
            }}
          >
            <SearchIcon />
            <Typography
              sx={{
                ml: 1,
                display: {
                  xs: "none", // hide on small screens
                  md: "inline", // show on medium and up
                },
                px: "5px",
              }}
            >
              Search
            </Typography>
          </Button>
        </Tooltip>

        <Typography
          sx={{
            fontSize: "35px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ffffff, #00e5ff)", // white to cyan
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}
        >
          Kurakani
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Notification */}
          <Dropdown>
            <MenuButton sx={{ border: "none" }}>
              <Badge
                badgeContent={notification.length}
                color="error"
                overlap="circular"
                invisible={notification.length === 0}
              >
                <NotificationsIcon />
              </Badge>
            </MenuButton>
            <Menu>
              {notification && notification.length > 0 ? (
                notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message from ${notif.chat.chatName}`
                      : `New message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No new notifications</MenuItem>
              )}
            </Menu>
          </Dropdown>

          {/* User Avatar */}
          <Dropdown>
            <MenuButton
              sx={{ border: "none" }}
              endDecorator={<ArrowDropDown />}
            >
              <Avatar alt="Remy Sharp" src={user.pic}>
                {user.name.charAt(0) + user.name.charAt(1)}
              </Avatar>
            </MenuButton>
            <Menu>
              <MenuItem onClick={handleOpen}>My Profile</MenuItem>
              <ListDivider />
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </Dropdown>
        </div>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src={user.pic}
            sx={{ width: "100px", height: "100px" }}
          >
            {user.name.charAt(0) + user.name.charAt(1)}
          </Avatar>
          <Typography level="h4" component="h2" fontSize={40}>
            {user?.name || "No Name"}
          </Typography>
          <Typography level="body-md" sx={{ mt: 1 }}>
            Email: {user?.email || "No Email"}
          </Typography>
          <Button sx={{ mt: 2 }} onClick={handleClose}>
            Close
          </Button>
        </ModalDialog>
      </Modal>

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        anchor="left"
      >
        <Box
          sx={{
            Width: 320,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="h4">Search</Typography>
            <IconButton
              onClick={() => setOpenDrawer(false)}
              variant="plain"
              sx={{ width: "50px" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search Input */}
          <Box sx={{ display: "flex" }}>
            <Input
              placeholder="Type to search..."
              startDecorator={<SearchIcon />}
              size="lg"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              sx={{
                width: "50px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 255, 0.1)",
                  color: "black",
                  borderColor: "blue",
                },
              }}
              onClick={handleSearch}
            >
              Go
            </Button>
          </Box>

          {/* Placeholder Results List */}
          <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </Box>

          {loadingChat && <CircularProgress variant="solid" />}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;
