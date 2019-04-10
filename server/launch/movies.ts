import {launchFabric} from 'launch/launchFabric';

const port = process.env.MOVIES_REQUESTING_SERVICE_PORT;
const host = process.env.SERVER_HOST;

launchFabric({host, port, routesDir: 'moviesRequesting', serviceName: 'MoviesRequestingWebService'});
