import {launchFabric} from './launch-fabric';

const port = process.env.MOVIES_REQUESTING_SERVICE_PORT;

launchFabric({port: 2555, routesDir: 'moviesRequesting', serviceName: 'MoviesRequestingWebService'})();
