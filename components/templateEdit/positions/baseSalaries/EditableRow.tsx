import { DeleteIcon } from "@chakra-ui/icons"
import { Tr, Td, IconButton, Input, Text } from "@chakra-ui/react"
import { FC, memo, ReactElement } from "react"
import { useAppSelector, useAppDispatch } from "../../../../hooks/redux"
import { useTemplateEditContext } from "../../../../hooks/templateEdit"
import { addDeleteBaseSalary, updatePositions } from "../../../../redux/positionsEditor/actions"

interface EditableRowProps {
  index: number
  positionIndex: number
}

const EditableRow: FC<EditableRowProps> = ({ index, positionIndex }: EditableRowProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const { editing, loading } = useTemplateEditContext()

  const updateBaseSalaryYears = (e: any) => {
    positions[positionIndex].base_salaries[index].years = parseInt(e.target.value || "0")
    dispatch(updatePositions(positions))
  }

  const updateBaseSalary = (e: any) => {
    positions[positionIndex].base_salaries[index].salary = parseInt(e.target.value || "0")
    dispatch(updatePositions(positions))
  }

  const onDelete = () => {
    const target = positions[positionIndex].base_salaries[index]
    if (target.id != null && target.position != null) {
      dispatch(addDeleteBaseSalary({
        id: target.id,
        position: target.position,
        years: target.years,
        salary: target.salary
      }))
    }
    positions[positionIndex].base_salaries.splice(index, 1)
    dispatch(updatePositions(positions))
  }

  return (
    <>
      <Tr>
        {editing ? (
          <>
            <Td>
              <Input type="number" value={positions[positionIndex].base_salaries[index].years} onChange={updateBaseSalaryYears} />
            </Td>
            <Td>
              <Input type="number" value={positions[positionIndex].base_salaries[index].salary} onChange={updateBaseSalary} />
            </Td>
          </>
        ) : (
          <>
            <Td>
              <Text>{positions[positionIndex].base_salaries[index].years}</Text>
            </Td>
            <Td>
              <Text>{positions[positionIndex].base_salaries[index].salary}</Text>
            </Td>
          </>
        )}
        <Td>
          <IconButton aria-label="Delete" size="sm" icon={<DeleteIcon />} isLoading={loading} onClick={onDelete} />
        </Td>
      </Tr>
    </>
  )
}

export default memo(EditableRow)