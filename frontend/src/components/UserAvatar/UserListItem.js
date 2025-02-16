import { Avatar } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center" // Vertically centers content
      justifyContent="center" // Horizontally centers content
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      {/* Center the Avatar both horizontally and vertically */}
      <Avatar
        size="md" // Increased size
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box ml={3}>
        {" "}
        {/* Added margin left for spacing between Avatar and text */}
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
