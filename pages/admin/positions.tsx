import { Flex, Heading, VStack } from "@chakra-ui/react";
import { Session, User } from "@supabase/supabase-js";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import PositionsEditTable from "../../components/admin/templateEdit/positions/PositionsEditTable";
import { getUserTemplates, retrieveAuthenticatedUserWithJwt } from "../../supabase";
import { Template } from "../../supabase/database/types";

interface PositionsPageProps {
  serverUser: User | undefined
}

const PositionsPage: NextPage<PositionsPageProps> = ({ serverUser }: PositionsPageProps): ReactElement => {
  const [user, setUser] = useState(serverUser)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (serverUser == null) {
      const localStorageRecord = localStorage.getItem("supabase.auth.token")
      if (localStorageRecord == null) {
        router.replace("/admin/login")
        return
      }
      const sessionObject = JSON.parse(localStorageRecord) as { currentSession: Session, expiresAt: number }
      const storedUser = sessionObject.currentSession.user
      if (storedUser == null) {
        router.replace("/admin/login")
        return
      }
      setUser(storedUser)
    }
  }, [serverUser, router])

  useEffect(() => {
    if (user != null) {
      getUserTemplates({ userId: user.id }).then(templates => {
        setTemplates(templates)
        if (templates.length > 0) {
          setSelectedTemplate(templates[0])
        }
      })
    }
  }, [user])

  return (
    <Flex width="100vw" direction="column" alignItems="center">
      <AdminNavbar templates={templates} onSelect={setSelectedTemplate} />
      {selectedTemplate && (
        <VStack width="80%" my={8} spacing={5}>
          <Heading size="lg" fontWeight="normal" alignSelf="start">{selectedTemplate.name}</Heading>
          <Heading size="md" fontWeight="normal" alignSelf="start">Positions + Salary Table</Heading>
          <PositionsEditTable parentTemplate={selectedTemplate} />
        </VStack>
      )}
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { accessToken } = context.query
  if (accessToken == null) {
    return {
      props: {}
    }
  }
  const formattedAccessToken = Array.isArray(accessToken) ? accessToken.join("") : accessToken
  const { user, error } = await retrieveAuthenticatedUserWithJwt({ jwt: formattedAccessToken })
  if (error) {
    return {
      props: {}
    }
  }
  return {
    props: {
      user
    }
  }
}

export default PositionsPage