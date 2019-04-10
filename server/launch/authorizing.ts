import {launchFabric} from './launchFabric';

const port = process.env.AUTH_SERVICE_PORT;
const host = process.env.SERVER_HOST;

launchFabric({port, routesDir: 'auth', serviceName: 'AuthorizingWebService'});
