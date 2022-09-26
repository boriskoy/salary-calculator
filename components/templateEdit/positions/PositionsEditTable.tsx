import { AddIcon } from "@chakra-ui/icons"
import { Table, TableCaption, Button, Thead, Tr, Th, Tbody, HStack } from "@chakra-ui/react"
import { FC, memo, ReactElement, useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { TemplateEditContextProvider } from "../../../hooks/templateEdit"
import { refreshPositions, updatePositions } from "../../../redux/positionsEditor/actions"
import { Template } from "../../../supabase/database/types"
import NoData from "../NoData"
import EditableRow from "./EditableRow"

interface PositionsEditTableProps {
  parentTemplate: Template
}

const PositionsEditTable: FC<PositionsEditTableProps> = memo(({ parentTemplate }: PositionsEditTableProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(false)

  const addPositionEditRow = (): void => {
    positions.push({
      parent_template: parentTemplate.id,
      name: "",
      base_salaries: []
    })
    dispatch(updatePositions(positions))
  }

  const onPersist = async (): Promise<void> => {
    console.log(positions)
  }

  useEffect(() => {
    const fetchPositions = async (): Promise<void> => {
      dispatch(refreshPositions({ templateId: parentTemplate.id }))
    }
    fetchPositions
  }, [])

  return (
    <Table>
      <TableCaption>
        <HStack spacing={3} justifyContent="end">
          <Button leftIcon={<AddIcon />} colorScheme="linkedin" onClick={addPositionEditRow} isLoading={loading}>Add position</Button>
          <Button colorScheme="whatsapp" onClick={onPersist} isLoading={loading}>Save</Button>
        </HStack>
      </TableCaption>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Position Name</Th>
          <Th width="150px">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        <TemplateEditContextProvider loading={loading}>
          {positions.length > 0 ? positions.map((position, index) => (
            <EditableRow
              key={index}
              index={index}
            />
          )) : <NoData />}
        </TemplateEditContextProvider>
      </Tbody>
    </Table>
  )
})

export default PositionsEditTable