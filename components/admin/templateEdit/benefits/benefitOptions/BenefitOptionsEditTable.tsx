import { AddIcon } from "@chakra-ui/icons";
import { Table, Thead, Tr, Th, Tbody, TableCaption, Button, Flex } from "@chakra-ui/react";
import { FC, memo, ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { useTemplateEditContext } from "../../../../../hooks/templateEdit";
import { updateBenefits } from "../../../../../redux/benefitsEditor/actions";
import NoData from "../../../NoData";
import EditableRow from "./EditableRow";

interface BenefitOptionsEditTableProps {
  benefitIndex: number
}

const BenefitOptionsEditTable: FC<BenefitOptionsEditTableProps> = ({ benefitIndex }: BenefitOptionsEditTableProps): ReactElement => {
  const { benefits } = useAppSelector((state) => state.benefitsEditor)
  const dispatch = useAppDispatch()

  const parentBenefit = benefits[benefitIndex]
  const benefitType = parentBenefit.type
  const benefitOptions = parentBenefit.benefit_options

  const { loading } = useTemplateEditContext()

  const addBenefitOptionEditRow = (): void => {
    if (benefitType !== "List") {
      return
    }
    benefitOptions.push({
      benefit: parentBenefit.id,
      type: parentBenefit.type,
      value: "Placeholder",
      salary: 0
    })
    dispatch(updateBenefits(benefits))
  }

  return (
    <Table>
      {benefitType === "List" && (
        <TableCaption>
          <Flex>
            <Button leftIcon={<AddIcon />} size="xs" colorScheme="linkedin" onClick={addBenefitOptionEditRow} isLoading={loading}>Add benefit option</Button>
          </Flex>
        </TableCaption>
      )}
      <Thead>
        <Tr>
          {benefitType === "Checkbox" ? (
            <>
              <Th>Condition</Th>
              <Th>Additional pay</Th>
            </>
          ) : benefitType === "List" ? (
            <>
              <Th>Option</Th>
              <Th>Additional pay</Th> 
              <Th>Remove</Th>
            </>
          ) : (
            <>
              <Th>Unit of measurement</Th>
              <Th>Additional pay per unit</Th>
            </>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {benefitOptions.length > 0 ? benefitOptions.map((benefitOption, index) => (
          <EditableRow
            key={`${benefitOption.benefit}-${benefitIndex}-${index}`}
            index={index}
            benefitIndex={benefitIndex}
          />
        )) : <NoData colSpan={4} />}
      </Tbody>
    </Table>
  )
}

export default memo(BenefitOptionsEditTable)