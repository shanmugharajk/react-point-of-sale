import React from "react";
import { ValueContainerProps } from "react-select/lib/components/containers";
import { OptionType } from "../types";

const ValueContainer = (props: ValueContainerProps<OptionType>) => {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
};

export default ValueContainer;
