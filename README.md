# Reactive Nodejs-MongoDB Movies

[![Build Status](https://travis-ci.org/sckv/nodejs-reactive-moviebase.svg?branch=master)](https://travis-ci.org/sckv/nodejs-reactive-moviebase)
[![codebeat badge](https://codebeat.co/badges/3684d439-e8c5-41ef-8d08-36afe1303a1f)](https://codebeat.co/projects/github-com-sckv-nodejs-reactive-moviebase-master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)


## Introduction

A simple Movie database with ratings and comments with limited social functionality, registration options and private lists control.

## Design and architecture

For this project, although it has very limited functional requirements, there will be developed a variety of services with a main layer strongly influenced by DDD and microservices distributed architectures. 
Microservices pretend to determine an exact context boundaries to the DDD model of all project, accordingly divided by local models, aggregates and pass messages through Redis to delegate tasks and information flow.

## Technologies

- Node.js LTS
- React
- MongoDB
- Redis
- Typescript
- Gulp
- Webpack
- Variety of other tools

## Infrastructure

Whole application is dockerized and managed through `docker-compose`, node process manager is `pm2`

## Application structure

- It is divided by two subdirectories, `client` and `server`.
- `@types` is for the project typings, to be able reuse them across front/back
- `configs` are jest, babel configs
- `docker` docker configuration

#### Server

- `launch` contains server launching fabric for different microservices what are going to be executed.
- `services` contain external / independent services
- `handlers` contain all controllers to which the routes will claim for
- `routes` files with routing for express
- `pkg` it is the main directory for the application services/repositories
- `pkg/storage` different repositories for each different DB motor we implement
- `pkg/{verbose}` self-explainable services

## Installation

### Requirements

- `docker`
- `Node LTS`

### Launch

- `yarn install`
- cd `docker` && `docker-compose build`
- cd `docker` && `docker-compose up`
- if mongo did't start in replicaSet -> `docker-compose exec -T mongo mongo rs.initiate()`
- `yarn serve:dev:client`

