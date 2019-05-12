import React, {ErrorInfo} from 'react';

import {ErrorExpansion} from './error-expansion';
import {ErrorMessage} from '@src/ui/error-handler/error-message';
import {env} from '@src/global/env';

const initialState = {hasError: false, error: undefined, info: undefined};

type State = {
  hasError: boolean;
  error?: Error;
  info?: React.ErrorInfo;
};

export class ErrorHandler extends React.Component<{}, State> {
  readonly state: State = initialState;

  static contextTypes = {
    router: () => true,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState(() => ({hasError: true, info, error}));
  }

  render() {
    const {info, error} = this.state;
    if (this.state.hasError && info && error) {
      if (env !== 'development') return <ErrorMessage />;
      return <ErrorExpansion error={error} info={info} />;
    }
    return this.props.children;
  }
}
