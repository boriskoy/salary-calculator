import { AddIcon, CheckIcon, EditIcon } from "@chakra-ui/icons"
import { Table, TableCaption, Button, Thead, Tr, Th, Tbody, HStack, IconButton, Box, position } from "@chakra-ui/react"
import { FC, memo, ReactElement, useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux"
import { TemplateEditContextProvider } from "../../../../hooks/templateEdit"
import { refreshPositions, updatePositions } from "../../../../redux/positionsEditor/actions"
import { REVERT_FORM_EDITS } from "../../../../redux/positionsEditor/types"
import { deleteTemplateBaseSalaries, deleteTemplatePositions, upsertTemplatePositions } from "../../../../supabase"
import { Template } from "../../../../supabase/database/types"
import NoData from "../../NoData"
import EditableRow from "./EditableRow"

interface PositionsEditTableProps {
  parentTemplate: Template
}

const PositionsEditTable: FC<PositionsEditTableProps> = ({ parentTemplate }: PositionsEditTableProps): ReactElement => {
  const { positions, deletePositions, deleteBaseSalaries } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const addPositionEditRow = (): void => {
    positions.push({
      parent_template: parentTemplate.id,
      name: "Placeholder",
      order: positions.length > 0 ? positions[positions.length - 1].order + 1 : 1,
      base_salaries: []
    })
    dispatch(updatePositions(positions))
  }

  const reset = (): void => {
    dispatch({
      type: REVERT_FORM_EDITS
    })
    setEditing(false)
  }

  const onPersist = async (): Promise<void> => {
    setEditing(false)
    setLoading(true)
    const isValid = positions.every(position => {
      return position.name !== "" && position.parent_template !== "" && position.base_salaries.every(baseSalary => baseSalary.years > -1 && baseSalary.salary > -1)
    })
    if (!isValid) {
      setLoading(false)
      alert("Must not have empty fields")
      return
    }
    try {
      await deleteTemplateBaseSalaries(Array.from(deleteBaseSalaries))
      await deleteTemplatePositions(Array.from(deletePositions))
      await upsertTemplatePositions({ positions })
      dispatch(refreshPositions({ templateId: parentTemplate.id }))
    } catch (error: any) {
      alert(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchPositions = async (): Promise<void> => {
      dispatch(refreshPositions({ templateId: parentTemplate.id }))
    }
    fetchPositions()
  }, [dispatch, parentTemplate.id])

  return (
    <Box borderRadius={10} border="1px solid black" p={3} width="100%">
      <Table>
        <TableCaption>
          <HStack justifyContent="end" spacing={3}>
            {editing ? (
              <IconButton aria-label="Save" icon={<CheckIcon />} isLoading={loading} onClick={() => setEditing(false)} />
            ) : (
              <IconButton aria-label="Edit" icon={<EditIcon />} isLoading={loading} onClick={() => setEditing(true)} />
            )}
            <Button isLoading={loading} onClick={reset}>Reset Edits</Button>
            <Button leftIcon={<AddIcon />} colorScheme="linkedin" onClick={addPositionEditRow} isLoading={loading}>Add position</Button>
            <Button colorScheme="whatsapp" onClick={onPersist} isLoading={loading}>Save</Button>
          </HStack>
        </TableCaption>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Position Name</Th>
            <Th>Order</Th>
            <Th>Remove</Th>
          </Tr>
        </Thead>
        <Tbody>
          <TemplateEditContextProvider editing={editing} loading={loading}>
            {positions.length > 0 ? positions.map((position, index) => (
              <EditableRow
                key={`${position.id}-${index}`}
                index={index}
              />
            )) : <NoData colSpan={3} />}
          </TemplateEditContextProvider>
        </Tbody>
      </Table>
    </Box>
  )
}

export default memo(PositionsEditTable)