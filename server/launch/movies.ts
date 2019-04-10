import {launchFabric} from './launchFabric';

const port = process.env.MOVIES_REQUESTING_SERVICE_PORT;

launchFabric({port, routesDir: 'moviesRequesting', serviceName: 'MoviesRequestingWebService'});
