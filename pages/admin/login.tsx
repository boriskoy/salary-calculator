import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "../../supabase";

const Login: NextPage = (): ReactElement => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (): Promise<void> => {
    if (email === "" || password === "") {
      setLoginErrorMessage("Email and password are required")
      return
    }
    setLoading(true)
    const { user, session, error } = await signInWithEmailAndPassword({ email, password })
    if (error) {
      setLoginErrorMessage(error.message)

    } else {
      console.log(user, session)
    }
    setLoading(false)
  }, [email, password])

  useEffect(() => {
    if (email !== "" || password !== "") {
      setLoginErrorMessage(undefined)
    }
  }, [email, password])

  return (
    <Center width="100%">
      <VStack width="30%" spacing={5}>
        <Heading size="md">Login to your admin account</Heading>
          <FormControl isInvalid={loginErrorMessage != null}>
            <FormLabel>Email Address</FormLabel>
            <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isInvalid={loginErrorMessage != null}>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <FormErrorMessage>{loginErrorMessage}</FormErrorMessage>
          </FormControl>
          <Button width="100%" colorScheme="linkedin" isLoading={loading} onClick={login}>Login</Button>
      </VStack>
    </Center>

  )
}

export default Login