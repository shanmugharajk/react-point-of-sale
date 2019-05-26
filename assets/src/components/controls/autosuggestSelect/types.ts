import { BaseTextFieldProps } from "@material-ui/core/TextField";

import { HTMLAttributes } from "react";

export interface OptionType {
  label: string;
  value: string;
}

export type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;
