import {memo, ReactNode} from "react";
import FormConfigContext from './context'
import {FormValue} from "@type/detail";

type FormProps = {
  onChange?: (values: FormValue) => void
  children?: ReactNode
}

const FormContainer = (props: FormProps) => {
  const {children, onChange} = props

  return (
    // <FormConfigContext.Provider
    //
    // >
    <>
      {/* form.item 组件集合*/}
      {children}
    </>
    // </FormConfigContext.Provider>
  )
}

export default memo(FormContainer)