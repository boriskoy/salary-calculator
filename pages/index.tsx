import { GetServerSideProps } from "next"
import { FC, ReactElement } from "react"
import FiremanCalculator from "../components/public/FiremanCalculator"
import PoliceCalculator from "../components/public/PoliceCalculator"
import { getTemplate, getTemplateBenefits, getTemplatePositions } from "../supabase"
import { Benefit, Position, Template } from "../supabase/database/types"

interface CalculatorProps {
  template?: Template
  positions?: Position[]
  benefits?: Benefit[]
}

const Calculator: FC = ({ template, positions, benefits }: CalculatorProps): ReactElement => {
  if (template == null || positions == null || benefits == null) {
    return <div></div>
  }
  if (template.id === "abee7edf-0f55-4d5c-88fa-8f3bdb81b14c") {
    return <FiremanCalculator template={template} positions={positions} benefits={benefits} />
  } else if (template.id === "a52b4f36-1107-4a32-8dbd-d9f667f26dc9") {
    return <PoliceCalculator template={template} positions={positions} benefits={benefits} />
  } else {
    return <div></div>
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { templateId } = context.query
  if (templateId == null || Array.isArray(templateId)) {
    return {
      props: {}
    }
  }
  const [template, positions, benefits] = await Promise.all([getTemplate({ templateId }), getTemplatePositions({ templateId }), getTemplateBenefits({ templateId })])
  return {
    props: {
      template,
      positions,
      benefits
    }
  }
}

export default Calculator