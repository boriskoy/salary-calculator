import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { requestResetPassword } from "../../supabase"
import { supabaseClient } from "../../supabase/client";

const ResetPassword: NextPage = (): ReactElement => {
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const sendEmail = useCallback(async (): Promise<void> => {
    if (email === "") {
      setErrorMessage("Please fill in your email")
      return
    }
    setLoading(true)
    const { error } = await requestResetPassword({ email })
    if (error) {
      setSuccessMessage(undefined)
      setErrorMessage(error.message)
    } else {
      setErrorMessage(undefined)
      setSuccessMessage("Email sent successfully")
    }
    setLoading(false)
  }, [email])

  useEffect(() => {
    setSuccessMessage(undefined)
    if (email !== "") {
      setErrorMessage(undefined)
    }
  }, [email])

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        const newPassword = prompt("What would you like your new password to be?");
        const { data, error } = await supabaseClient.auth.update({
          password: newPassword || undefined,
        })
        if (data) alert("Password updated successfully!")
        if (error) alert("There was an error updating your password.")
      }
    })
  }, [])

  return (
    <Center width="100%">
      <VStack width="30%" spacing={5}>
        <Heading size="md">Send password reset email</Heading>
        <FormControl isInvalid={errorMessage != null}>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
        <Text color="green.300" fontSize="sm" alignSelf="start">{successMessage}</Text>
        <Button colorScheme="linkedin" width="100%" isLoading={loading} onClick={sendEmail}>Send Email</Button>
      </VStack>
    </Center>
  )
}

export default ResetPassword