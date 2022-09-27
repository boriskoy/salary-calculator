import { Tr, Td, Badge } from "@chakra-ui/react"
import { FC, ReactElement } from "react"

const NoData: FC<{ colSpan: number }> = ({ colSpan }: { colSpan: number }): ReactElement => {
  return (
    <Tr>
      <Td colSpan={colSpan} textAlign="center">
        <Badge>No data</Badge>
      </Td>
    </Tr>
  )
}

export default NoData