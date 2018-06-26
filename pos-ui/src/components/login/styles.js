// eslint-disable-next-line
const styles = theme => ({
  root: {
    background: "#efefef",
    height: "100vh"
  },
  paper: {
    minWidth: 300,
    display: "flex",
    flexDirection: "column",
    width: "350px",
    minHeight: "230px",
    margin: "auto",
    alignItems: "center",
    padding: "20px 30px 30px 30px"
  },
  loginContainer: {
    display: "flex",
    height: "calc(90vh)"
  },
  errorMessage: {
    width: "90%",
    marginTop: 20
  },
  wrapper: {
    marginTop: 20,
    position: "relative"
  },
  buttonProgress: {
    color: "black",
    position: "absolute",
    top: "50%",
    left: "40px",
    marginTop: -12,
    marginLeft: -12
  }
});

export default styles;
