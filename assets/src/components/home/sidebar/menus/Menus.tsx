import React from "react";
import ShoppingCart from "@material-ui/icons/ShoppingCart";

import { Divider, List } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { withRouter, RouteComponentProps } from "react-router";

import classNames from "classnames";

import styles from "./menus.style";
import MenuHeading from "./MenuHeading";
import MenuItem from "./MenuItem";
import menuService from "./menuService";

interface IProps extends RouteComponentProps<any> {}

const Menus = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const isSelected = (paths: Array<string>) => {
    for (const idx in paths) {
      if (
        props.history.location.pathname === `${paths[idx]}` ||
        props.history.location.pathname.includes(`/${paths[idx]}/`)
      ) {
        return true;
      }
    }
    return false;
  };

  const onMenuClick = (route: string) => {
    props.history.push(route);
  };

  const menus = menuService.fetchMenus();

  const renderMenu = ({
    name,
    paths,
    route,
    icon
  }: {
    name: string;
    paths: Array<string>;
    route: string;
    icon: any;
  }) => (
    <MenuItem
      key={name}
      isSelected={isSelected(paths || [route])}
      onClick={() => onMenuClick(route)}
      text={name}
      icon={icon}
    />
  );

  const renderSubMenu = (menus: Array<any>, title: string) => (
    <div key={title}>
      <MenuHeading title={title} />
      {menus.map(o => renderMenu(o))}
    </div>
  );

  const renderMenus = () => {
    const toRender = [];

    for (const key in menus) {
      if (Array.isArray(menus[key]) === false) {
        toRender.push(renderMenu(menus[key]));
      } else {
        toRender.push(renderSubMenu(menus[key], key));
      }
    }

    return toRender;
  };

  return (
    <div>
      <div className={classNames(classes.toolbar, classes.logo)}>
        <ShoppingCart />
        <span>Point Of Sale</span>
      </div>
      <Divider />

      <List>{renderMenus()}</List>
    </div>
  );
};

export default withRouter(Menus);
