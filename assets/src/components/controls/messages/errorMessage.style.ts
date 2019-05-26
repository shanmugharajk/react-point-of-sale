import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = () => ({
  root: {
    padding: "15px",
    border: "1px solid #e91e639c",
    background: "#f4433612",
    color: "#f44336d6",
    margin: "20px 0px 10px 0px",
    width: "100%",
    fontSize: 14,
    borderRadius: 3
  }
});

export default styles;
