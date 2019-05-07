import {launchFabric} from './launch-fabric';

const port = process.env.MOVIES_REQUESTING_SERVICE_PORT;

launchFabric({port, routesDir: 'moviesRequesting', serviceName: 'MoviesRequestingWebService'});
