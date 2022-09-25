import { User } from "@supabase/supabase-js";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { retrieveAuthenticatedUserWithJwt } from "../../supabase";

interface AdminProps {
  user: User | undefined
}

const Admin: NextPage<AdminProps> = ({ user }: AdminProps): ReactElement => {
  const router = useRouter()

  useEffect(() => {
    if (user == null) {
      router.replace("/admin/login")
    } else {
      router.replace("/admin", undefined, { shallow: true })
    }
  }, [user, router])

  return (
    <div></div>
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
  const user = await retrieveAuthenticatedUserWithJwt({ jwt: formattedAccessToken })
  return {
    props: {
      user
    }
  }
}

export default Admin