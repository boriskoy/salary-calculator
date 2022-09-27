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
  base_salaries: BaseSalary[]
}

export interface BaseSalary {
  id: number
  position: number
  years: number
  salary: number
}