import React, {useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);


  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats"); // Redirect after successful registration
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setPicLoading(false);
      return;
    }
    console.log(pics);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwrquhhn9");
      fetch("https://api.cloudinary.com/v1_1/dwrquhhn9/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px" color="white">
      <FormControl id="first-name" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Name
        </FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          color="white"
          _placeholder={{
            color: "white",
            fontWeight: "bold",
            fontSize: "lg",
          }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Email Address
        </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          color="white"
          _placeholder={{
            color: "white",
            fontWeight: "bold",
            fontSize: "lg",
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Password
        </FormLabel>
        <InputGroup saturate='md'>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            color="white"
            _placeholder={{
              color: "white",
              fontWeight: "bold",
              fontSize: "lg",
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Confirm Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            color="white"
            _placeholder={{
              color: "white",
              fontWeight: "bold",
              fontSize: "lg",
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Profile Picture
        </FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Upload Your Profile Picture"
          onChange={(e) => postDetails(e.target.files[0])}
          color="white"
          _placeholder={{
            color: "white",
            fontWeight: "bold",
            fontSize: "lg",
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
