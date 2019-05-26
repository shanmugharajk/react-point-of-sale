import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import { makeStyles } from "@material-ui/styles";

import Header from "../../components/home/header/Header";
import Sidebar from "../../components/home/sidebar/Sidebar";
import styles from "./home.style";
import Container from "../../components/home/container/Container";
import Routes from "../routes/Routes";

const Home = () => {
  const drawerWidth = 200;

  const useStyles = makeStyles(styles(drawerWidth));
  const classes = useStyles();

  const handleDrawerToggle = () => {};

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Container>
        <Routes />
      </Container>
    </div>
  );
};

export default Home;
