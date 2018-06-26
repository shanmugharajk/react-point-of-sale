import React from "react";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import DateRange from "material-ui-icons/DateRange";
import { withStyles } from "material-ui";

// eslint-disable-next-line
const styles = theme => ({
  textField: {
    [theme.breakpoints.up("xs")]: {
      width: 250
    },
    [theme.breakpoints.up("sm")]: {
      width: 300
    },
    [theme.breakpoints.up("md")]: {
      width: 500
    },
    marginRight: 10,
    marginTop: 20
  },
  textFieldFormLabel: {
    fontSize: "1.05rem"
  }
});

const CustomDatePicker = props => {
  const { handleDateChange, classes, name, ...rest } = props;

  const onDateChange = date => {
    const target = {};
    target.name = name;
    // eslint-disable-next-line  no-underscore-dangle
    target.value = date._d;
    handleDateChange({ target });
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        placeholder="dd/mm/yyyy"
        format="DD/MM/YYYY"
        keyboard
        mask={value =>
          value
            ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
            : []
        }
        leftArrowIcon={<KeyboardArrowLeft />}
        rightArrowIcon={<KeyboardArrowRight />}
        InputLabelProps={{
          shrink: true,
          className: classes.textFieldFormLabel
        }}
        keyboardIcon={<DateRange />}
        {...rest}
        className={classes.textField}
        onChange={onDateChange}
        disableOpenOnEnter
        animateYearScrolling={false}
      />
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles, { withTheme: true })(CustomDatePicker);
