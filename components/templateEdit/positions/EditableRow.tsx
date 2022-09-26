import { AddIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon, MinusIcon } from "@chakra-ui/icons";
import { Tr, Td, Input, IconButton, HStack, Text } from "@chakra-ui/react";
import { FC, memo, ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useTemplateEditContext } from "../../../hooks/templateEdit";
import { updatePositions } from "../../../redux/positionsEditor/actions";
import BaseSalariesEditTable from "./baseSalaries/BaseSalariesEditTable";

interface EditableRowProps {
  index: number
}

const EditableRow: FC<EditableRowProps> = ({ index }: EditableRowProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const { loading } = useTemplateEditContext()

  const [position, setPosition] = useState(positions[index])
  const [showCollapse, setShowCollapse] = useState(false)
  const [editing, setEditing] = useState(false)

  const saveEdit = (): void => {
    positions[index] = position
    dispatch(updatePositions(positions))
    setEditing(false)
  }

  const cancelEdit = (): void => {
    setPosition(positions[index])
    setEditing(false)
  }

  const onDelete = (): void => {
    positions.splice(index, 1)
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
        <Td>
          {showCollapse ? (
            <IconButton aria-label="Minimize" size="sm" icon={<MinusIcon />} onClick={() => setShowCollapse(!showCollapse)} />
          ) : (
            <IconButton aria-label="Expand" size="sm" icon={<AddIcon />} onClick={() => setShowCollapse(!showCollapse)} />
          )}
        </Td>
        <Td>
          {editing ? (
            <Input isDisabled={loading} value={position.name} onChange={(e) => setPosition({ ...position, name: e.target.value })} />
          ) : (
            <Text>{position.name}</Text>
          )}
        </Td>
        <Td>{EditingActionComponent}</Td>
      </Tr>
      {showCollapse ? (
        <Tr>
          <Td colSpan={3}>
            <BaseSalariesEditTable positionIndex={index} />
          </Td>
        </Tr>
      ) : null}
    </>
  )
}

export default memo(EditableRow)