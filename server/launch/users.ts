import {launchFabric} from 'launch/launchFabric';

const port = process.env.USER_CONTROLLING_SERVICE_PORT;
const host = process.env.SERVER_HOST;

launchFabric({host, port, routesDir: 'userControlling', serviceName: 'UserControllingWebService'});
