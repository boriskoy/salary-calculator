import { AddIcon } from "@chakra-ui/icons";
import { Table, Thead, Tr, Th, Tbody, TableCaption, Button, Flex } from "@chakra-ui/react";
import { FC, memo, ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { useTemplateEditContext } from "../../../../../hooks/templateEdit";
import { updatePositions } from "../../../../../redux/positionsEditor/actions";
import NoData from "../../../NoData";
import EditableRow from "./EditableRow";

interface BaseSalariesEditTableProps {
  positionIndex: number
}

const BaseSalariesEditTable: FC<BaseSalariesEditTableProps> = ({ positionIndex }: BaseSalariesEditTableProps): ReactElement => {
  const { positions } = useAppSelector((state) => state.positionsEditor)
  const dispatch = useAppDispatch()

  const parentPosition = positions[positionIndex]
  const baseSalaries = parentPosition.base_salaries

  const { loading } = useTemplateEditContext()

  const addBaseSalaryEditRow = (): void => {
    baseSalaries.push({
      position: parentPosition.id,
      years: 0,
      salary: 0
    })
    dispatch(updatePositions(positions))
  }

  return (
    <Table>
      <TableCaption>
        <Flex>
          <Button leftIcon={<AddIcon />} size="xs" colorScheme="linkedin" onClick={addBaseSalaryEditRow} isLoading={loading}>Add base salary</Button>
        </Flex>
      </TableCaption>
      <Thead>
        <Tr>
          <Th>Years</Th>
          <Th>Salary</Th>
          <Th>Remove</Th>
        </Tr>
      </Thead>
      <Tbody>
        {baseSalaries.length > 0 ? baseSalaries.map((baseSalary, index) => (
          <EditableRow
            key={`${baseSalary.position}-${positionIndex}-${index}`}
            index={index}
            positionIndex={positionIndex}
          />
        )) : <NoData colSpan={3} />}
      </Tbody>
    </Table>
  )
}

export default memo(BaseSalariesEditTable)