import React from 'react';

import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

import { NotifyActionType } from './action-types';

type variantType = {
  [name: string]: React.ComponentType<SvgIconProps>;
};
const variantIcon: variantType = {
  [NotifyActionType.success]: CheckCircleIcon,
  [NotifyActionType.warning]: WarningIcon,
  [NotifyActionType.error]: ErrorIcon,
  [NotifyActionType.notify]: InfoIcon,
};

type variantString = {
  [name: string]: string;
};

const variantToString: variantString = {
  [NotifyActionType.success]: 'success',
  [NotifyActionType.error]: 'error',
  [NotifyActionType.notify]: 'notify',
  [NotifyActionType.warning]: 'warning',
};

//TODO refactor this to hookstyles
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    success: {
      backgroundColor: green[600],
      margin: spacing.unit,
    },
    error: {
      backgroundColor: palette.error.dark,
      margin: spacing.unit,
    },
    notify: {
      backgroundColor: blue[400],
      color: 'white',
      margin: spacing.unit,
    },
    warning: {
      backgroundColor: amber[700],
      margin: spacing.unit,
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      fontSize: 20,
      marginRight: spacing.unit,
    },
    message: {
      marginRight: spacing.unit,
      display: 'flex',
      alignItems: 'center',
    },
  });

const MySnackbarContent = (props: any) => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  const decode = (toDecode: string) => toDecode.replace(/(\r\n|\n|\r)/gm, '<br />');

  return (
    <SnackbarContent
      className={classes[variantToString[variant]]}
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

export const CustomSnackbar = withStyles(styles)(MySnackbarContent);
