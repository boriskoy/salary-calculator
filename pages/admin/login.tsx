import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "../../supabase";
import NextLink from "next/link"
import { useRouter } from "next/router";

const Login: NextPage = (): ReactElement => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const login = useCallback(async (): Promise<void> => {
    if (email === "" || password === "") {
      setLoginErrorMessage("Email and password are required")
      return
    }
    setLoading(true)
    const { session, error } = await signInWithEmailAndPassword({ email, password })
    setLoading(false)
    if (error) {
      setLoginErrorMessage(error.message)
    } else {
      router.push({
        pathname: "/admin",
        query: {
          accessToken: session?.access_token
        }
      }, "/admin")
    }
  }, [email, password, router])

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
        <NextLink href="/admin/reset_password" passHref>
          <Link alignSelf="end" fontSize="sm">Forgot password?</Link>
        </NextLink>
        <Button width="100%" colorScheme="linkedin" isLoading={loading} onClick={login}>Login</Button>
      </VStack>
    </Center>

  )
}

export default Login