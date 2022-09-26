import { ChevronDownIcon } from "@chakra-ui/icons"
import { HStack, Menu, MenuButton, Button, MenuList, MenuItem, Text } from "@chakra-ui/react"
import { FC, memo, ReactElement } from "react"
import { Template } from "../supabase"

interface AdminNavbarProps {
  templates: Template[]
  onSelect: (template: Template) => void
}

const AdminNavbar: FC<AdminNavbarProps> = ({ templates, onSelect }: AdminNavbarProps): ReactElement => {
  const selectTemplate = (template: Template): void => {
    onSelect(template)
  }

  return (
    <HStack justifyContent="space-between" py={3} px={5} width="100%" bgColor="blue.100">
      <Menu>
        <MenuButton as={Button} colorScheme="linkedin" rightIcon={<ChevronDownIcon />}>Templates</MenuButton>
        <MenuList >
          {templates.length > 0 ? (
            templates.map(template => <MenuItem key={template.id} onClick={() => selectTemplate(template)}>{template.name}</MenuItem>)
          ) : (
            <Text textAlign="center">No templates available</Text>
          )}
        </MenuList>
      </Menu>
      <Button colorScheme="linkedin">Log out</Button>
    </HStack>
  )
}

export default memo(AdminNavbar)