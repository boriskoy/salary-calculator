import { Divider, Grid, Stat, StatLabel, StatNumber, useMediaQuery, VStack } from "@chakra-ui/react"
import React, { FC, ReactElement, useEffect, useMemo, useState } from "react"
import { Template, Position, Benefit } from "../../supabase/database/types"
import { Checkbox, Col, Row, InputNumber, Select, Typography } from "antd"

interface PoliceCalculatorProps {
  template: Template
  positions: Position[]
  benefits: Benefit[]
}


const PoliceCalculator: FC<PoliceCalculatorProps> = ({ template, positions, benefits }: PoliceCalculatorProps): ReactElement => {
  const positionsObject = useMemo(() => Object.fromEntries(positions.map(position => [position.name, position.base_salaries])), [positions])
  const positionNames = useMemo(() => positions.map(position => position.name), [positions])

  const checkboxBenefits = useMemo(() => benefits.filter(benefit => benefit.type === "Checkbox"), [benefits])
  const listBenefits = useMemo(() => benefits.filter(benefit => benefit.type === "List"), [benefits])
  const scaledBenefits = useMemo(() => benefits.filter(benefit => benefit.type === "Scaled"), [benefits])

  const [yearsOptions, setYearsOptions] = useState<number[]>([])

  const [selectedPosition, setSelectedPosition] = useState(positionNames[0])
  const [selectedYear, setSelectedYear] = useState(0)
  const [listBenefitValues, setListBenefitValues] = useState<any>({})
  const [scaledBenefitValues, setScaledBenefitValues] = useState<any>({})
  const [checkboxBenefitValues, setCheckboxBenefitValues] = useState<any>({}) 

  const [annualPay, setAnnualPay] = useState<number | undefined>(undefined)

  const salaryString = useMemo(() => {
    if (annualPay == null) {
      return "N/A"
    }
    return "$" + annualPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }, [annualPay])

  const hourlyWageString = useMemo(() => {
    if (annualPay == null) {
      return "N/A"
    }
    return "$" + (annualPay / 365 / 8).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }, [annualPay])

  const [isSmallSize] = useMediaQuery('(min-width: 560px)')

  useEffect(() => {
    setYearsOptions(positionsObject[selectedPosition].map(baseSalary => baseSalary.years))
  }, [positionsObject, selectedPosition])

  useEffect(() => {
    setSelectedYear(yearsOptions[0])
  }, [yearsOptions])

  useEffect(() => {
    let total = 0
    const baseSalary = positionsObject[selectedPosition].find(baseSalary => baseSalary.years === selectedYear)
    if (baseSalary == null) {
      setAnnualPay(undefined)
      return
    }
    total += baseSalary.salary
    const certificationSalary = listBenefits.find(benefit => benefit.name === "Peace Officer Certification")?.benefit_options.find(option => option.value === listBenefitValues["Peace Officer Certification"])?.salary
    const educationSalary = listBenefits.find(benefit => benefit.name === "Education")?.benefit_options.find(option => option.value === listBenefitValues["Education"])?.salary
    if (certificationSalary != null && educationSalary != null) {
      total += Math.max(certificationSalary, educationSalary)
    } else if (certificationSalary != null && educationSalary == null) {
      total += (certificationSalary)
    } else if (certificationSalary == null && educationSalary != null) {
      total += (educationSalary)
    }

    Object.entries(listBenefitValues).forEach(([name, value]) => {
      if (name !== "Education" && name !== "Peace Officer Certification") {
        const salary = listBenefits.find(b => b.name === name)?.benefit_options.find(option => option.value === value)?.salary || 0
        total += salary
      }
    })
    Object.entries(scaledBenefitValues).forEach(([name, value]) => {
      const salary = scaledBenefits.find(b => b.name === name)?.benefit_options[0].salary || 0
      total += salary * (value as number)
    })
    Object.entries(checkboxBenefitValues).forEach(([name, value]) => {
      if (value) {
        const salary = checkboxBenefits.find(b => b.name === name)?.benefit_options.find(option => option.value === "true")?.salary || 0
        total += salary
      }
    })
    setAnnualPay(total)
  }, [selectedPosition, selectedYear, listBenefitValues, scaledBenefitValues, checkboxBenefitValues])

  return (
    <VStack width="80%" p={10} spacing={10}>
      <Typography.Title level={isSmallSize ? 1 : 3}>Salary Calculator</Typography.Title>
      <VStack width="100%" spacing={isSmallSize ? 3 : 5}>
        <Row style={{ width: "100%" }}>
          <Col span={isSmallSize ? 8 : 24}>
            <Typography.Title level={isSmallSize ? 4 : 5}>Position</Typography.Title>
          </Col>
          <Col span={isSmallSize ? 16 : 24}>
            <Select size="large" value={selectedPosition} onChange={(value) => setSelectedPosition(value)} style={{ width: "100%" }}>
              {positionNames.map(positionName => (
                <Select.Option key={positionName} value={positionName}>{positionName}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={isSmallSize ? 8 : 24}>
            <Typography.Title level={isSmallSize ? 4 : 5}>Years of experience</Typography.Title>
          </Col>
          <Col span={isSmallSize ? 16 : 24}>
            <Select size="large" value={selectedYear} onChange={(value) => setSelectedYear(value)} style={{ width: "100%" }}>
              {yearsOptions.map(yearOption => (
                <Select.Option key={yearOption} defaultValue={undefined} value={yearOption}>{yearOption}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        {listBenefits.map(benefit => (
          <Row key={benefit.id} style={{ width: "100%" }}>
            <Col span={isSmallSize ? 8 : 24}>
              <Typography.Title level={isSmallSize ? 4 : 5}>{benefit.name}</Typography.Title>
            </Col>
            <Col span={isSmallSize ? 16 : 24}>
              <Select size="large" allowClear value={listBenefitValues[benefit.name]} onChange={(value) => setListBenefitValues({ ...listBenefitValues, [benefit.name]: value })} style={{ width: "100%" }}>
                {benefit.benefit_options.map(benefitOption => (
                  <Select.Option key={benefitOption.id} value={benefitOption.value}>{benefitOption.value}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        ))}
        {scaledBenefits.map(benefit => (
          <Row key={benefit.id} style={{ width: "100%" }}>
            <Col span={isSmallSize ? 8 : 24}>
              <Typography.Title level={isSmallSize ? 4 : 5}>{benefit.name}</Typography.Title>
            </Col>
            <Col span={isSmallSize ? 16 : 24}>
              <InputNumber size="large" value={scaledBenefitValues[benefit.name]} min={0} max={31} onChange={(value) => setScaledBenefitValues({ ...scaledBenefitValues, [benefit.name]: value })} />
            </Col>
          </Row>
        ))}
        <Row style={{ width: "100%" }}>
          <Col span={isSmallSize ? 8 : 24}>
            <Typography.Title level={isSmallSize ? 4 : 5}>Incentive Pay</Typography.Title>
          </Col>
          <Col span={isSmallSize ? 16 : 24}>
            {checkboxBenefits.map(benefit => (
              <Checkbox style={isSmallSize ? {} : { marginLeft: 0 }} key={benefit.id} checked={checkboxBenefitValues[benefit.name]} onChange={(e) => setCheckboxBenefitValues({ ...checkboxBenefitValues, [benefit.name]: e.target.checked })}>{benefit.name}</Checkbox>
            ))}
          </Col>
        </Row>
      </VStack>
      <Divider />
      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={3} width="80%">
        <Stat textAlign="center">
          <StatLabel fontSize="2xl" fontWeight="normal">Annual Salary</StatLabel>
          <StatNumber fontSize="6xl" fontWeight="bold">{salaryString}</StatNumber>
        </Stat>
        <Stat textAlign="center">
          <StatLabel fontSize="2xl" fontWeight="normal">Hourly Wage</StatLabel>
          <StatNumber fontSize="6xl" fontWeight="bold">{hourlyWageString}</StatNumber>
        </Stat>
      </Grid>
    </VStack>
  )
}

export default PoliceCalculator