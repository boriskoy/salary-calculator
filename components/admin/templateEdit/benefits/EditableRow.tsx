import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { Tr, Td, Input, IconButton, Text, Select } from "@chakra-ui/react";
import { FC, memo, ReactElement, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useTemplateEditContext } from "../../../../hooks/templateEdit";
import { addDeleteBenefit, addDeleteBenefitOption, updateBenefits } from "../../../../redux/benefitsEditor/actions";
import BenefitOptionsEditTable from "./benefitOptions/BenefitOptionsEditTable";

interface EditableRowProps {
  index: number
}

const EditableRow: FC<EditableRowProps> = ({ index }: EditableRowProps): ReactElement => {
  const { benefits } = useAppSelector((state) => state.benefitsEditor)
  const dispatch = useAppDispatch()

  const { editing, loading } = useTemplateEditContext()

  const [showCollapse, setShowCollapse] = useState(false)

  const updateBenefitName = (e: any) => {
    benefits[index].name = e.target.value
    dispatch(updateBenefits(benefits))
  }

  const updateBenefitType = (e: any) => {
    if (benefits[index].type != e.target.value) {
      benefits[index].benefit_options.forEach(benefitOption => {
        if (benefitOption.id != null && benefitOption.benefit != null) {
          dispatch(addDeleteBenefitOption({
            id: benefitOption.id,
            benefit: benefitOption.benefit,
            type: benefitOption.type,
            value: benefitOption.value,
            salary: benefitOption.salary
          }))
        }
      })
      if (e.target.value === "Checkbox") {
        benefits[index].benefit_options = [
          {
            type: e.target.value,
            value: "true",
            salary: 0
          }
        ]
      } else if (e.target.value === "List") {
        benefits[index].benefit_options = []
      } else {
        benefits[index].benefit_options = [
          {
            type: e.target.value,
            value: "days",
            salary: 0
          }
        ]
      }
    }
    benefits[index].type = e.target.value
    dispatch(updateBenefits(benefits))
  }

  const onDelete = (): void => {
    const target = benefits[index]
    if (target.id != null) {
      dispatch(addDeleteBenefit({
        id: target.id,
        name: target.name,
        parent_template: target.parent_template,
        type: target.type,
        benefit_options: []
      }))
    }
    benefits.splice(index, 1)
    dispatch(updateBenefits(benefits))
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
        <Td>
          {editing ? (
            <Input isDisabled={loading} value={benefits[index].name} onChange={updateBenefitName} />
          ) : (
            <Text>{benefits[index].name}</Text>
          )}
        </Td>
        <Td>
        {editing ? (
            <Select isDisabled={loading} value={benefits[index].type}  onChange={updateBenefitType}>
              <option value="Checkbox">Checkbox</option>
              <option value="List">List</option>
              <option value="Scaled">Scaled</option>
            </Select>
          ) : (
            <Text>{benefits[index].type}</Text>
          )}
        </Td>
        <Td>
          <IconButton aria-label="Delete" size="sm" icon={<DeleteIcon />} isLoading={loading} isDisabled={editing} onClick={onDelete} />
        </Td>
      </Tr>
      {showCollapse ? (
        <Tr>
          <Td colSpan={4}>
            <BenefitOptionsEditTable benefitIndex={index} />
          </Td>
        </Tr>
      ) : null}
    </>
  )
}

export default memo(EditableRow)