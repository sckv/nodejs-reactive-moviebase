import React from 'react';

import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import { Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';

type variantType = {
  [name: string]: React.ComponentType<SvgIconProps>;
};
const variantIcon: variantType = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  notify: InfoIcon,
};

//TODO refactor this to hookstyles
const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  success: {
    backgroundColor: green[600],
    margin: spacing(1),
  },
  error: {
    backgroundColor: palette.error.dark,
    margin: spacing(1),
  },
  notify: {
    backgroundColor: blue[400],
    color: 'white',
    margin: spacing(1),
  },
  warning: {
    backgroundColor: amber[700],
    margin: spacing(1),
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    fontSize: 20,
    marginRight: spacing(1),
  },
  message: {
    marginRight: spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
}));

const MySnackbarContent = ({ message, onClose, variant, ...other }: any) => {
  const Icon = variantIcon[variant];
  const decode = (toDecode: string) => toDecode.replace(/(\r\n|\n|\r)/gm, '<br />');
  const classes: { [k in keyof ReturnType<typeof useStyles>]: any } & { [k: string]: any } = useStyles();
  return (
    <SnackbarContent
      className={classes[variant]}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classes.iconVariant} />
          <span dangerouslySetInnerHTML={{ __html: decode(message) }} />
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

export const CustomSnackbar = MySnackbarContent;
