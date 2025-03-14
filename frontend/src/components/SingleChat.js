import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, Spinner, Text, useToast } from "@chakra-ui/react";
import { IconButton, Input } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import "./styles.css";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { set } from "mongoose";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import io from "socket.io-client";
import Lottie from "react-lottie"
import lookup from "socket.io-client";
import animationData from "../animations/typing.json";


const ENDPOINT = "https://lets-chat-1-rp50.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const[socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const[typing,setTyping] = useState(false);
  const[isTyping,setIsTyping] = useState(false);

  const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice"
    },
    
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false));
  }, []);

  useEffect(() => {
    // console.log("Selected Chat Changed");
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if(!selectedChatCompare|| selectedChatCompare._id !== newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      else{
        setMessages([...messages,newMessageRecieved]);
      }
    });
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing",selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // console.log(data);
        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log(messages);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    },timerLength);

    //TYPING INDICATOR LOGIC
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "30px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            color="white"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  /> */}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="750px"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                varaient="filled"
                bg="#A0A0A0"
                placeholder="Enter a message"
                value={newMessage}
                onChange={typingHandler}
                sx={{ "::placeholder": { color: "white" } }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color="gray.200"
        >
          <Text fontSize="5xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
