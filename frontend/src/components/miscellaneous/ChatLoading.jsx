import { Stack, Skeleton, Box } from "@mui/joy";

const ChatLoading = () => {
  return (
    <Box px={2} py={1}>
      <Stack spacing={2}>
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: "md",
              bgcolor: "neutral.softBg",
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ChatLoading;
