import { Flex } from "@chakra-ui/react";
import { Session, User } from "@supabase/supabase-js";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminTemplateTable from "../../components/templateEdit/AdminTemplateTable";
import { getUserTemplates, retrieveAuthenticatedUserWithJwt } from "../../supabase";
import { Template } from "../../supabase/database/types";

interface AdminProps {
  serverUser: User | undefined
}

const Admin: NextPage<AdminProps> = ({ serverUser }: AdminProps): ReactElement => {
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
    <Flex width="100%" direction="column">
      <AdminNavbar templates={templates} onSelect={setSelectedTemplate} />
      {selectedTemplate && <AdminTemplateTable template={selectedTemplate} />}
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
  const { user, error} = await retrieveAuthenticatedUserWithJwt({ jwt: formattedAccessToken })
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

export default Admin