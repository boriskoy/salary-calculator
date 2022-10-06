import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { Tr, Td, Input, IconButton, Text, NumberInput, NumberInputField } from "@chakra-ui/react";
import { FC, memo, ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useTemplateEditContext } from "../../../../hooks/templateEdit";
import { addDeletePosition, updatePositions } from "../../../../redux/positionsEditor/actions";
import BaseSalariesEditTable from "./baseSalaries/BaseSalariesEditTable";

interface EditableRowProps {
  index: number
}

const EditableRow: FC<EditableRowProps> = ({ index }: EditableRowProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const { editing, loading } = useTemplateEditContext()

  const [showCollapse, setShowCollapse] = useState(false)

  const updatePositionName = (e: any) => {
    positions[index].name = e.target.value
    dispatch(updatePositions(positions))
  }

  const updatePositionOrder = (_: string, value: number) => {
    positions[index].order = !isNaN(value) ? value : 0
    dispatch(updatePositions(positions))
  }

  const onDelete = (): void => {
    const target = positions[index]
    if (target.id != null) {
      dispatch(addDeletePosition({
        id: target.id,
        name: target.name,
        parent_template: target.parent_template,
        order: target.order,
        base_salaries: []
      }))
    }
    positions.splice(index, 1)
    dispatch(updatePositions(positions))
  }

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
        {editing ? (
          <>
            <Td>
              <Input isDisabled={loading} value={positions[index].name} onChange={updatePositionName} />
            </Td>
            <Td>
              <NumberInput min={0} value={positions[index].order} onChange={updatePositionOrder}>
                <NumberInputField />
              </NumberInput>
            </Td>
          </>
        ) : (
          <>
            <Td>
              <Text>{positions[index].name}</Text>
            </Td>
            <Td>
              <Text>{positions[index].order}</Text>
            </Td>
          </>
        )}
        <Td>
          <IconButton aria-label="Delete" size="sm" icon={<DeleteIcon />} isLoading={loading} isDisabled={editing} onClick={onDelete} />
        </Td>
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