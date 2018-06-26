import { withStyles } from "material-ui/styles";
import { TableCell } from "material-ui/Table";

const CustomTableCell = withStyles(() => ({
  head: {
    backgroundColor: "#f5f5f5",
    color: "black",
    fontSize: 14
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

export default CustomTableCell;
