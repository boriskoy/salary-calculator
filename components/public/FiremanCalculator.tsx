import { Heading, HStack, Select, VStack } from "@chakra-ui/react"
import React, { FC, ReactElement, useEffect, useMemo, useState } from "react"
import { Template, Position, Benefit } from "../../supabase/database/types"

interface FiremanCalculatorProps {
  template: Template
  positions: Position[]
  benefits: Benefit[]
}


const FiremanCalculator: FC<FiremanCalculatorProps> = ({ template, positions, benefits }: FiremanCalculatorProps): ReactElement => {
  const positionsObject = useMemo(() => Object.fromEntries(positions.map(position => [position.name.toUpperCase(), position.base_salaries])), [positions])
  const positionNames = useMemo(() => positions.map(position => position.name.toUpperCase()), [positions])

  const [selectedPosition, setSelectedPosition] = useState(positionNames[0])
  const [selectedYears, setSelectedYears] = useState(0)
  const [yearsOptions, setYearsOptions] = useState<number[]>([])

  useEffect(() => {
    setYearsOptions(positionsObject[selectedPosition].map(baseSalary => baseSalary.years))
  }, [positionsObject, selectedPosition])

  useEffect(() => {
    setSelectedYears(yearsOptions[0])
  }, [yearsOptions])

  return (
    <VStack width="100%" p={10} spacing={10}>
      <Heading size="lg">{template.name}</Heading>
      <VStack width="100%" spacing={3}>
        <HStack width="100%">
          <Heading flex={1} size="md">POSITION</Heading>
          <Select flex={4} value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
            {positionNames.map(positionName => (
              <option key={positionName} value={positionName}>{positionName}</option>
            ))}
          </Select>
        </HStack>
        <HStack width="100%">
          <Heading flex={1} size="md">YEARS OF EXPERIENCE</Heading>
          <Select flex={4} value={selectedYears} onChange={(e) => setSelectedYears(parseInt(e.target.value))}>
            {yearsOptions.map(yearOption => (
              <option key={yearOption} value={yearOption}>{yearOption}</option>
            ))}
          </Select>
        </HStack>
      </VStack>
    </VStack>
  )
}

export default FiremanCalculator