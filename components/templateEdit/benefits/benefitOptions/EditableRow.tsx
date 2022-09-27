import { DeleteIcon } from "@chakra-ui/icons"
import { Tr, Td, IconButton, Input, Text } from "@chakra-ui/react"
import { FC, memo, ReactElement } from "react"
import { useAppSelector, useAppDispatch } from "../../../../hooks/redux"
import { useTemplateEditContext } from "../../../../hooks/templateEdit"
import { addDeleteBenefitOption, updateBenefits } from "../../../../redux/benefitsEditor/actions"

interface EditableRowProps {
  index: number
  benefitIndex: number
}

const EditableRow: FC<EditableRowProps> = ({ index, benefitIndex }: EditableRowProps): ReactElement => {
  const { benefits } = useAppSelector((state) => state.benefitsEditor)
  const dispatch = useAppDispatch()

  const benefitType = benefits[benefitIndex].type

  const { editing, loading } = useTemplateEditContext()

  const updateBenefitOptionValue = (e: any) => {
    benefits[benefitIndex].benefit_options[index].value = e.target.value
    dispatch(updateBenefits(benefits))
  }

  const updateBenefitOptionSalary = (e: any) => {
    benefits[benefitIndex].benefit_options[index].salary = e.target.value
    dispatch(updateBenefits(benefits))
  }

  const onDelete = () => {
    const target = benefits[benefitIndex].benefit_options[index]
    if (target.id != null && target.benefit != null) {
      dispatch(addDeleteBenefitOption({
        id: target.id,
        benefit: target.benefit,
        type: target.type,
        value: target.value,
        salary: target.salary
      }))
    }
    benefits[benefitIndex].benefit_options.splice(index, 1)
    dispatch(updateBenefits(benefits))
  }

  return (
    <>
      <Tr>
        {benefitType === "Checkbox" ? (
          <>
            <Td>True</Td>
            <Td>
              {editing ? (
                <Input value={benefits[benefitIndex].benefit_options[index].salary} onChange={updateBenefitOptionSalary} />
              ) : (
                <Text>{benefits[benefitIndex].benefit_options[index].salary}</Text>
              )}
            </Td>
          </>
        ) : benefitType === "List" ? (
          <>
            {editing ? (
              <>
                <Td>
                  <Input value={benefits[benefitIndex].benefit_options[index].value} onChange={updateBenefitOptionValue} />
                </Td>
                <Td>
                  <Input value={benefits[benefitIndex].benefit_options[index].salary} onChange={updateBenefitOptionSalary} />
                </Td>
              </>
            ) : (
              <>
                <Td>
                  <Text>{benefits[benefitIndex].benefit_options[index].value}</Text>
                </Td>
                <Td>
                  <Text>{benefits[benefitIndex].benefit_options[index].salary}</Text>
                </Td>
              </>
            )}
            <Td>
              <IconButton aria-label="Delete" size="sm" icon={<DeleteIcon />} isLoading={loading} onClick={onDelete} />
            </Td>
          </>
        ) : (
          editing ? (
            <>
              <Td>
                <Input value={benefits[benefitIndex].benefit_options[index].value} onChange={updateBenefitOptionValue} />
              </Td>
              <Td>
                <Input value={benefits[benefitIndex].benefit_options[index].salary} onChange={updateBenefitOptionSalary} />
              </Td>
            </>
          ) : (
            <>
              <Td>
                <Text>{benefits[benefitIndex].benefit_options[index].value}</Text>
              </Td>
              <Td>
                <Text>{benefits[benefitIndex].benefit_options[index].salary}</Text>
              </Td>
            </>
          )
        )}
      </Tr>
    </>
  )
}

export default memo(EditableRow)