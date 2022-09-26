import { Box, TableContainer } from "@chakra-ui/react";
import { FC, memo, ReactElement } from "react";
import { Template } from "../../supabase/database/types";
import PositionsEditTable from "./positions/PositionsEditTable";

interface AdminTemplateTableProps {
  template: Template
}

const AdminTemplateTable: FC<AdminTemplateTableProps> = ({ template }: AdminTemplateTableProps): ReactElement => {
  return (
    <Box border="2px solid gray" borderRadius={10} alignSelf="center" justifySelf="center" width="80%" mt={10} p={3}>
      <TableContainer>
        <PositionsEditTable parentTemplate={template} />
        {/* <Table>
          <Thead>
            <Tr>
              <Th>Benefits</Th>
            </Tr>
          </Thead>
        </Table> */}
      </TableContainer>
    </Box>
  )
}

export default memo(AdminTemplateTable)