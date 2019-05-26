import React from "react";
import clsx from "clsx";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import { MultiValueProps } from "react-select/lib/components/MultiValue";
import { OptionType } from "../types";

const MultiValue = (props: MultiValueProps<OptionType>) => (
  <Chip
    tabIndex={-1}
    label={props.children}
    className={clsx(props.selectProps.classes.chip, {
      [props.selectProps.classes.chipFocused]: props.isFocused
    })}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon {...props.removeProps} />}
  />
);

export default MultiValue;
