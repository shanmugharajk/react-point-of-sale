import { StyleRules } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  appBar: {
    position: "relative"
  },
  title: {
    flex: 1,
    paddingLeft: "5px",
    fontWeight: 100,
    fontSize: "20px"
  },
  subTitle: {
    paddingLeft: "10px",
    fontWeight: 100,
    fontSize: "16px"
  }
});

export default styles;
