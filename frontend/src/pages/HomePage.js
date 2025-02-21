import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import logo from "../main-logo-white-transparent.png";
import { Image } from "@chakra-ui/react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/SignUp";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="rgba(255, 255, 255, 0.2)"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
      <Box width="auto" height="60px" display="flex" alignItems="center">
                <Image
                  src={logo}
                  alt="Logo"
                  height="170px" 
                  objectFit="contain"
                  transform="translateY(2%)" 
                />
              </Box>
      </Box>
      <Box
        bg="rgba(255, 255, 255, 0.2)"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab color="white" fontSize="lg" fontWeight="bold">
              Login
            </Tab>
            <Tab color="white" fontSize="lg" fontWeight="bold">
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
