import { Box, Avatar, Typography, Sheet } from "@mui/joy";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Sheet
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: "45px",
        py:"20px",
        borderRadius: "md",
        cursor: "pointer",
        transition: "0.2s",
        mb:"10px",
        "&:hover": {
          backgroundColor: "neutral.softActiveBg",
        },
      }}
      onClick={handleFunction}
    >
      <Avatar src={user.pic} alt={user.name} />
      <Box>
        <Typography level="title-md">{user.name}</Typography>
        <Typography level="body-sm" textColor="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Sheet>
  );
};

export default UserListItem;
