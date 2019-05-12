import * as React from 'react';
import styled from '@emotion/styled';

// import {Button} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type Props = {
  error: Error;
  info: React.ErrorInfo;
};

export const ErrorExpansion: React.FunctionComponent<Props> = props => {
  const {error, info} = props;
  const decode = (toDecode: string) => toDecode.replace(/(\r\n|\n|\r)/gm, '<br />');
  const transformedErrorStack = decode(error.stack!);
  const transformedComponentStack = decode(info.componentStack!);

  const htmlErrorStack = {__html: `${transformedErrorStack}`};
  const htmlComponentStack = {__html: `${transformedComponentStack}`};
  return (
    <Div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h3">
            Error:
            <Typography variant="h5" component="span">
              {error.message}
            </Typography>
            <br />
            Error Stack Trace
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography component="div">
            <div dangerouslySetInnerHTML={htmlErrorStack} />
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h3">Error React Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography component="div">
            <div dangerouslySetInnerHTML={htmlComponentStack} />
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Div>
  );
};

const Div = styled.div`
  margin: auto;
  width: 900px;
  height: 500px;
`;
