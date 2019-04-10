import {launchFabric} from 'launch/launchFabric';

const port = process.env.AUTH_SERVICE_PORT;
const host = process.env.SERVER_HOST;

launchFabric({host, port, routesDir: 'auth', serviceName: 'AuthorizingWebService'});
