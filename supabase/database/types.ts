export interface UserTemplate {
  user_id: string
  template_id: string
}

export interface Template {
  id: string
  name: string
}

export interface Position {
  id: number
  parent_template: string
  name: string
  order: number
  base_salaries: BaseSalary[]
}

export interface BaseSalary {
  id: number
  position: number
  years: number
  salary: number
}

export interface Benefit {
  id: number
  parent_template: string
  name: string
  type: string
  benefit_options: BenefitOption[]
}

export interface BenefitOption {
  id: number
  benefit: number
  type: string
  value: string
  salary: number
}