import { Theme } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";

const styles: (theme: Theme) => StyleRules<any, any> = theme => ({
  root: {
    fontSize: theme.typography.pxToRem(12),
    // Increase the specificity to override TableCell.
    "&:last-child": {
      padding: 0
    }
  },
  toolbar: {
    height: 56,
    minHeight: 56,
    paddingRight: 2
  },
  spacer: {
    flex: "1 1 100%"
  },
  caption: {
    flexShrink: 0
  },
  input: {
    fontSize: "inherit",
    flexShrink: 0
  },
  selectRoot: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  select: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2)
  },
  selectIcon: {
    top: 1
  },
  actions: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5)
  }
});

export default styles;
