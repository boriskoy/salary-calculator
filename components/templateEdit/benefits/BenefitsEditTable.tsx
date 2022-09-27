import { CheckIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { Table, TableCaption, HStack, IconButton, Button, Thead, Tr, Th, Tbody, Box } from "@chakra-ui/react";
import { FC, memo, ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { TemplateEditContextProvider } from "../../../hooks/templateEdit";
import { refreshBenefits, updateBenefits } from "../../../redux/benefitsEditor/actions";
import { REVERT_FORM_EDITS } from "../../../redux/benefitsEditor/types";
import { Template } from "../../../supabase/database/types";
import NoData from "../../NoData";
import EditableRow from "./EditableRow";

interface BenefitsEditTableProps {
  parentTemplate: Template
}

const BenefitsEditTable: FC<BenefitsEditTableProps> = ({ parentTemplate }: BenefitsEditTableProps): ReactElement => {
  const { benefits, deleteBenefits, deleteBenefitOptions } = useAppSelector((state) => state.benefitsEditor)
  const dispatch = useAppDispatch()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const addBenefitEditRow = (): void => {
    benefits.push({
      parent_template: parentTemplate.id,
      name: "Placeholder",
      type: "Checkbox",
      benefit_options: [
        {
          type: "Checkbox",
          value: "true",
          salary: 0
        }
      ]
    })
    dispatch(updateBenefits(benefits))
  }

  const reset = (): void => {
    dispatch({
      type: REVERT_FORM_EDITS
    })
    setEditing(false)
  }

  const onPersist = async (): Promise<void> => {
    // setEditing(false)
    // setLoading(true)
    // const isValid = positions.every(position => {
    //   return position.name !== "" && position.parent_template !== "" && position.base_salaries.every(baseSalary => baseSalary.years > -1 && baseSalary.salary > -1)
    // })
    // if (!isValid) {
    //   setLoading(false)
    //   alert("Must not have empty fields")
    //   return
    // }
    // try {
    //   await deleteTemplateBaseSalaries(Array.from(deleteBaseSalaries))
    //   await deleteTemplatePositions(Array.from(deletePositions))
    //   await upsertTemplatePositions({ positions })
    //   dispatch(refreshPositions({ templateId: parentTemplate.id }))
    // } catch (error: any) {
    //   alert(error.message)
    // }
    // setLoading(false)
  }

  useEffect(() => {
    const fetchBenefits = async (): Promise<void> => {
      dispatch(refreshBenefits({ templateId: parentTemplate.id }))
    }
    fetchBenefits()
  }, [])

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
            <Button leftIcon={<AddIcon />} colorScheme="linkedin" onClick={addBenefitEditRow} isLoading={loading}>Add benefit</Button>
            <Button colorScheme="whatsapp" onClick={onPersist} isLoading={loading}>Save</Button>
          </HStack>
        </TableCaption>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Benefit Name</Th>
            <Th>Benefit Type</Th>
            <Th>Remove</Th>
          </Tr>
        </Thead>
        <Tbody>
          <TemplateEditContextProvider editing={editing} loading={loading}>
            {benefits.length > 0 ? benefits.map((benefit, index) => (
              <EditableRow
                key={`${benefit.id}-${index}`}
                index={index}
              />
            )) : <NoData colSpan={4} />}
          </TemplateEditContextProvider>
        </Tbody>
      </Table>
    </Box>
  )
}

export default memo(BenefitsEditTable)