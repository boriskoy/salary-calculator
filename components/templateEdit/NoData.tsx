import { Tr, Td, Badge } from "@chakra-ui/react"
import { FC, ReactElement } from "react"

const NoData: FC = (): ReactElement => {
  return (
    <Tr>
      <Td colSpan={3} textAlign="center">
        <Badge>No data</Badge>
      </Td>
    </Tr>
  )
}

export default NoData