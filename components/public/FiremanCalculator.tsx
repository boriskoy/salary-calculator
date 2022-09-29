import { Divider, Grid, Stat, StatLabel, StatNumber, VStack } from "@chakra-ui/react"
import React, { FC, ReactElement, useEffect, useMemo, useState } from "react"
import { Template, Position, Benefit } from "../../supabase/database/types"
import { Checkbox, Col, Row, InputNumber, Select, Typography } from "antd"

interface FiremanCalculatorProps {
  template: Template
  positions: Position[]
  benefits: Benefit[]
}


const FiremanCalculator: FC<FiremanCalculatorProps> = ({ template, positions, benefits }: FiremanCalculatorProps): ReactElement => {
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
    const certificationSalary = listBenefits.find(benefit => benefit.name === "Certification")?.benefit_options.find(option => option.value === listBenefitValues.Certification)?.salary
    const educationSalary = listBenefits.find(benefit => benefit.name === "Highest Education")?.benefit_options.find(option => option.value === listBenefitValues["Highest Education"])?.salary
    if (certificationSalary != null && educationSalary != null) {
      total += Math.max(certificationSalary * 12, educationSalary * 12)
    } else if (certificationSalary != null && educationSalary == null) {
      total += (certificationSalary * 12)
    } else if (certificationSalary == null && educationSalary != null) {
      total += (educationSalary * 12)
    }
    Object.entries(scaledBenefitValues).forEach(([name, value]) => {
      const salary = scaledBenefits.find(b => b.name === name)?.benefit_options[0].salary || 0
      total += salary * (value as number) * 12
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
      <Typography.Title level={1}>Salary Calculator</Typography.Title>
      <VStack width="100%" spacing={3}>
        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <Typography.Title level={4}>Position</Typography.Title>
          </Col>
          <Col span={16}>
            <Select size="large" value={selectedPosition} onChange={(value) => setSelectedPosition(value)} style={{ width: "100%" }}>
              {positionNames.map(positionName => (
                <Select.Option key={positionName} value={positionName}>{positionName}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <Typography.Title level={4}>Years of experience</Typography.Title>
          </Col>
          <Col span={16}>
            <Select size="large" value={selectedYear} onChange={(value) => setSelectedYear(value)} style={{ width: "100%" }}>
              {yearsOptions.map(yearOption => (
                <Select.Option key={yearOption} defaultValue={undefined} value={yearOption}>{yearOption}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        {listBenefits.map(benefit => (
          <Row key={benefit.id} style={{ width: "100%" }}>
            <Col span={8}>
              <Typography.Title level={4}>{benefit.name}</Typography.Title>
            </Col>
            <Col span={16}>
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
            <Col span={8}>
              <Typography.Title level={4}>{benefit.name}</Typography.Title>
            </Col>
            <Col span={16}>
              <InputNumber size="large" value={scaledBenefitValues[benefit.name]} min={0} max={31} onChange={(value) => setScaledBenefitValues({ ...scaledBenefitValues, [benefit.name]: value })} />
            </Col>
          </Row>
        ))}
        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <Typography.Title level={4}>Incentive Pay</Typography.Title>
          </Col>
          <Col span={16}>
            {checkboxBenefits.map(benefit => (
              <Checkbox key={benefit.id} checked={checkboxBenefitValues[benefit.name]} onChange={(e) => setCheckboxBenefitValues({ ...checkboxBenefitValues, [benefit.name]: e.target.checked })}>{benefit.name}</Checkbox>
            ))}
          </Col>
        </Row>
      </VStack>
      <Divider />
      <Grid templateColumns="repeat(2, 1fr)" gap={3} width="80%">
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

export default FiremanCalculator