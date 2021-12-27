import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    // States //
    const [show, setShow] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    // Functions //
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dihpb7leu");
            fetch("https://api.cloudinary.com/v1_1/dihpb7leu/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
              .then(data => {
                  setPic(data.url.toString());
                  console.log(data.url.toString());
                  setLoading(false);
              })
              .catch((err) => {
                  console.log(err);
                  setLoading(false);
              });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = () => {

    };


    // render //
    return (
        <VStack spacing='5px' color="black">
            {/* Name */}
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            {/* Email */}
            <FormControl id='email1' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            {/* Password */}
            <FormControl id='password1' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : 'password'}
                        placeholder='Enter Your Email'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* Confirm Password */}
            <FormControl id="password2" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* Picture */}
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            {/* Sign Up */}
            <Button
                colorScheme='blue'
                width='100%'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
