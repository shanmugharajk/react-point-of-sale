import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

interface IProps extends NumberFormatProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (v: any) => void;
  error: boolean;
  label: string;
}

const CustomNumberFormat = (props: IProps) => {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
            name
          }
        });
      }}
      thousandSeparator
      prefix=""
    />
  );
};

export default CustomNumberFormat;
