import React from "react";
import { withStyles } from "material-ui";
import PropTypes from "prop-types";
import classNames from "classnames";
import axios from "axios";
import * as moment from "moment";

const styled = Component => (style, options) => {
  function StyledComponent(props) {
    const { classes, className, ...other } = props;
    return (
      <Component className={classNames(classes.root, className)} {...other} />
    );
  }
  StyledComponent.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/require-default-props
    className: PropTypes.string
  };
  const styles =
    typeof style === "function"
      ? theme => ({ root: style(theme) })
      : { root: style };
  return withStyles(styles, options)(StyledComponent);
};

const setAuthorizationHeader = (token = null) => {
  if (token) {
    sessionStorage.setItem("token", token);
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  }
};

const isValidDDMMYY = date => moment(date, "DD-MM-YY", true).isValid();

const invertShowHide = val => {
  if (val === "show") return "hide";
  return "show";
};

const isValidDateChange = idate => {
  let date = idate;

  if (
    (date.length === 3 && date[2] !== "-") ||
    (date.length === 6 && date[5] !== "-") ||
    date.length > 8
  )
    return false;

  date = date.replace(/-/g, "");

  // eslint-disable-next-line
  if (isNaN(date)) return false;

  if (idate.length === 8 && !isValidDDMMYY(idate)) return false;

  return true;
};

const isValueExists = (object, keysToIgnore = []) => {
  const keys = Object.keys(object);
  const errors = {};

  const fn = val => {
    if (keysToIgnore.length === 0) return false;

    for (let i = 0; i < keysToIgnore.length; i++) {
      const element = keysToIgnore[i];
      if (element === val) return true;
    }
    return false;
  };

  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    const value = object[key];
    if ((!fn(key) && !value && value !== 0) || (!fn(key) && value === "")) {
      errors[key] = "Required field";
    }
  }

  return errors;
};

const isValidEmail = mail => {
  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};

const getPaginationInfo = linkHeaderString => {
  if (!linkHeaderString) {
    return {};
  }

  const links = linkHeaderString.split(",");

  if (links.length === 0) {
    return {};
  }

  const paginationInfo = {
    next: links[0].split(";")[0],
    prev: links[1].split(";")[0],
    first: links[2].split(";")[0],
    last: links[3].split(";")[0],
    count: links[4].split(";")[0],
    current: links[5].split(";")[0]
  };
  return paginationInfo;
};

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));

export {
  styled,
  setAuthorizationHeader,
  isValidDDMMYY,
  isValidDateChange,
  invertShowHide,
  isValueExists,
  isValidEmail,
  getPaginationInfo,
  sleep
};
