import React from "react";
import { ControlProps } from "react-select/lib/components/Control";
import { InputComponentProps, OptionType } from "../types";
import CustomTextField from "../../textfields/CustomTextField";

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

const Control = (props: ControlProps<OptionType>) => {
  return (
    <CustomTextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
};

export default Control;
