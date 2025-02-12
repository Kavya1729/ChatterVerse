import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const postDetails = (pic) => {
    // handle the uploaded profile picture
  };

  const submitHandler = () => {
    // handle the signup form submission
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
          placeholderColor="white"
          _placeholder={{ color: "white", fontWeight: "bold", fontSize: "lg" }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Email
        </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          color="white"
          placeholderColor="white"
          _placeholder={{ color: "white", fontWeight: "bold", fontSize: "lg" }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Password
        </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            color="white"
            placeholderColor="white"
            _placeholder={{
              color: "white",
              fontWeight: "bold",
              fontSize: "lg",
            }}
          />
          <InputRightElement width="4.5rem">
            <button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel color="white" fontWeight="bold" fontSize="lg">
          Confirm Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            color="white"
            placeholderColor="white"
            _placeholder={{
              color: "white",
              fontWeight: "bold",
              fontSize: "lg",
            }}
          />
          <InputRightElement width="4.5rem">
            <button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
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
          _placeholder={{ color: "white", fontWeight: "bold", fontSize: "lg" }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
