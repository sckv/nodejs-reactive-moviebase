import {launchFabric} from './launch-fabric';

const port = process.env.USER_CONTROLLING_SERVICE_PORT;

launchFabric({port, routesDir: 'userControlling', serviceName: 'UserControllingWebService'})();
