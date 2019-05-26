import React from 'react';

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const PageNotFound = () => (
  <Container>
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
        </div>
        <h2>404 - Page not found</h2>
        <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link to="/">Go To Homepage</Link>
      </div>
    </div>
  </Container>
);

const Container = styled.div`
  * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
  }

  #notfound {
    position: relative;
    height: calc(100vh - 48px);
    background: rgba(182, 207, 236, 1);
    background: -moz-linear-gradient(
      -45deg,
      rgba(182, 207, 236, 1) 0%,
      rgba(114, 174, 238, 1) 0%,
      rgba(182, 207, 236, 1) 100%
    );
    background: -webkit-gradient(
      left top,
      right bottom,
      color-stop(0%, rgba(182, 207, 236, 1)),
      color-stop(0%, rgba(114, 174, 238, 1)),
      color-stop(100%, rgba(182, 207, 236, 1))
    );
    background: -webkit-linear-gradient(
      -45deg,
      rgba(182, 207, 236, 1) 0%,
      rgba(114, 174, 238, 1) 0%,
      rgba(182, 207, 236, 1) 100%
    );
    background: -o-linear-gradient(
      -45deg,
      rgba(182, 207, 236, 1) 0%,
      rgba(114, 174, 238, 1) 0%,
      rgba(182, 207, 236, 1) 100%
    );
    background: -ms-linear-gradient(
      -45deg,
      rgba(182, 207, 236, 1) 0%,
      rgba(114, 174, 238, 1) 0%,
      rgba(182, 207, 236, 1) 100%
    );
    background: linear-gradient(
      135deg,
      rgba(182, 207, 236, 1) 0%,
      rgba(114, 174, 238, 1) 0%,
      rgba(182, 207, 236, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#b6cfec', endColorstr='#b6cfec', GradientType=1
      );
  }

  #notfound .notfound {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .notfound {
    max-width: 410px;
    width: 100%;
    text-align: center;
  }

  .notfound .notfound-404 {
    height: 280px;
    position: relative;
    z-index: -1;
  }

  .notfound .notfound-404 h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 230px;
    margin: 0px;
    font-weight: 900;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background: url('../assets/404bg.jpg') no-repeat;
    -webkit-text-fill-color: transparent;
    background-size: cover;
    background-position: center;
  }

  .notfound h2 {
    font-family: 'Montserrat', sans-serif;
    color: #000;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 0;
  }

  .notfound p {
    font-family: 'Montserrat', sans-serif;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 20px;
    margin-top: 0px;
  }

  .notfound a {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    text-decoration: none;
    text-transform: uppercase;
    background: #0046d5;
    display: inline-block;
    padding: 15px 30px;
    border-radius: 40px;
    color: #fff;
    font-weight: 700;
    -webkit-box-shadow: 0px 4px 15px -5px #0046d5;
    box-shadow: 0px 4px 15px -5px #0046d5;
  }

  @media only screen and (max-width: 767px) {
    .notfound .notfound-404 {
      height: 142px;
    }
    .notfound .notfound-404 h1 {
      font-size: 112px;
    }
  }
`;
