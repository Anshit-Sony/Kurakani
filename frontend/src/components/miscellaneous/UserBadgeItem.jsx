import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/joy";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "primary.softBg",
        color: "primary.softColor",
        borderRadius: "lg",
        px: 1.5,
        py: 0.5,
        mx: 0.5,
        my: 0.5,
        fontSize: "sm",
      }}
    >
      <Typography level="body-sm" sx={{ mr: 1 }}>
        {user.name}
      </Typography>
      <IconButton
        variant="plain"
        size="sm"
        onClick={handleFunction}
        sx={{ "--IconButton-size": "20px" }}
      >
        <CloseIcon sx={{ fontSize: "16px" }} />
      </IconButton>
    </Box>
  );
};

export default UserBadgeItem;
