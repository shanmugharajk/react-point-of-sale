import React from "react";
import Typography from "@material-ui/core/Typography";
import { SingleValueProps } from "react-select/lib/components/SingleValue";
import { OptionType } from "../types";

const SingleValue = (props: SingleValueProps<OptionType>) => (
  <Typography
    className={props.selectProps.classes.singleValue}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

export default SingleValue;
