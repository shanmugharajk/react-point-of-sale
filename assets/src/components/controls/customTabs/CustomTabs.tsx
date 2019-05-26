import React, { ReactNode } from "react";

import { Tab, AppBar, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./customTabs.style";

interface IProps {
  items: Array<any>;
  value: any;
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
}

const CustomTabs = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const renderTabItems = () =>
    props.items.map((i: string) => (
      <Tab key={i} label={i} className={classes.tabItem} />
    ));

  const { value, onChange } = props;

  return (
    <AppBar position="static" className={classes.tab} color="default">
      <Tabs
        classes={{
          indicator: classes.indicator
        }}
        value={value}
        onChange={onChange}
      >
        {renderTabItems()}
      </Tabs>
    </AppBar>
  );
};

export default CustomTabs;
