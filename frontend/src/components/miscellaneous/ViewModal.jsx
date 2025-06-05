import  { useState } from "react";
import { Modal, ModalDialog, Typography, Button, Avatar } from "@mui/joy";
import VisibilityIcon from '@mui/icons-material/Visibility';
const ViewModal = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}
      sx={
        {
          width:"100px"
        }
      }
      >
        <VisibilityIcon></VisibilityIcon>
      </Button>
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
    </>
  );
};

export default ViewModal;
