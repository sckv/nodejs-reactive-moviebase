import { CircularProgress } from '@material-ui/core';
import { styled as muiStyle } from '@material-ui/styles';
import styled from '@emotion/styled';
import css from '@emotion/css';

export const AppLoadingWrapper = styled.div`
  width: 100vw;
  height: 95vh;
  display: flex;
`;

export const AppLoadingSquare = styled.div`
  align-content: center;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

export const ThemedCircular = muiStyle(CircularProgress)({
  alignContent: 'center',
  margin: 'auto',
  marginBottom: 10,
});

export const globalStyles = css`
  html,
  body {
    width: 100%;
    height: calc(100% - 50px);
    margin: 0;
    padding: 0;
    font: 15px Roboto, sans-serif;
  }

  .container {
    margin-top: 48px;
  }
  .background-wrapper {
    height: 100%;
    width: 100%;
    z-index: -1;
    background-image: linear-gradient(
      to left top,
      #ff6f91,
      #ff7689,
      #ff7d81,
      #ff847b,
      #ff8c76,
      #ff9372,
      #ff9a6e,
      #ffa16b,
      #ffaa67,
      #ffb363,
      #ffbd61,
      #ffc75f
    );
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: fixed;
  }
  *::-webkit-scrollbar {
    width: 0.4em;
    height: 0.4em;
  }
  *::-webkit-scrollbar-track {
    /* webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.00); */
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    outline: 1px solid slategrey;
  }
`;
