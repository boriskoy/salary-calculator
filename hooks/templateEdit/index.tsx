import React, { FC, PropsWithChildren, ReactElement, useContext } from "react"

const TemplateEditContext = React.createContext({
  loading: false,
  editing: false
})

interface TemplateEditContextProviderProps extends PropsWithChildren {
  loading: boolean
  editing: boolean
}

export const useTemplateEditContext = () => {
  return useContext(TemplateEditContext)
}

export const TemplateEditContextProvider: FC<TemplateEditContextProviderProps> = ({ children, ...props }: TemplateEditContextProviderProps): ReactElement => {
  return (
    <TemplateEditContext.Provider value={props}>{children}</TemplateEditContext.Provider>
  )
}