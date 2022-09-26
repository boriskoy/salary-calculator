import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Tr, Td, IconButton, Input, HStack, Text } from "@chakra-ui/react"
import { FC, memo, ReactElement, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../../../hooks/redux"
import { useTemplateEditContext } from "../../../../hooks/templateEdit"
import { updatePositions } from "../../../../redux/positionsEditor/actions"

interface EditableRowProps {
  index: number
  positionIndex: number
}

const EditableRow: FC<EditableRowProps> = ({ index, positionIndex }: EditableRowProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const { loading } = useTemplateEditContext()

  const [baseSalary, setBaseSalary] = useState(positions[positionIndex].base_salaries[index])
  const [editing, setEditing] = useState(false)

  const saveEdit = () => {
    positions[positionIndex].base_salaries[index] = baseSalary
    dispatch(updatePositions(positions))
    setEditing(false)
  }

  const cancelEdit = () => {
    setBaseSalary(positions[positionIndex].base_salaries[index])
    setEditing(false)
  }

  const onDelete = () => {
    positions[positionIndex].base_salaries.splice(index, 1)
    dispatch(updatePositions(positions))
  }

  const EditingActionComponent = (
    <HStack spacing={2}>
      {editing ? (
        <>
          <IconButton aria-label="Save" size="sm" icon={<CheckIcon />} isLoading={loading} onClick={saveEdit} />
          <IconButton aria-label="Cancel" size="sm" icon={<CloseIcon />} isLoading={loading} onClick={cancelEdit} />
        </>
      ) : (
        <>
          <IconButton aria-label="Edit" size="sm" icon={<EditIcon />} isLoading={loading} onClick={() => setEditing(true)} />
          <IconButton aria-label="Delete" size="sm" icon={<DeleteIcon />} isLoading={loading} onClick={onDelete} />
        </>
      )}
    </HStack>
  )

  return (
    <>
      <Tr>
        {editing ? (
          <>
            <Td>
              <Input type="number" value={baseSalary.years} onChange={(e) => setBaseSalary({ ...baseSalary, years: parseInt(e.target.value) })} />
            </Td>
            <Td>
              <Input type="number" value={baseSalary.salary} onChange={(e) => setBaseSalary({ ...baseSalary, salary: parseInt(e.target.value) })} />
            </Td>
          </>
        ) : (
          <>
            <Td>
              <Text>{baseSalary.years}</Text>
            </Td>
            <Td>
              <Text>{baseSalary.salary}</Text>
            </Td>
          </>
        )}
        <Td>{EditingActionComponent}</Td>
      </Tr>
    </>
  )
}

export default memo(EditableRow)