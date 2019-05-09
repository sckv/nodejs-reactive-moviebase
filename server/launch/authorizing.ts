import {launchFabric} from './launch-fabric';

const port = process.env.AUTH_SERVICE_PORT;

launchFabric({port, routesDir: 'auth', serviceName: 'AuthorizingWebService'});
