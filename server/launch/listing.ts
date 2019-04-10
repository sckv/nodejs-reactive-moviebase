import {launchFabric} from 'launch/launchFabric';

const port = process.env.LISTING_SERVICE_PORT;
const host = process.env.SERVER_HOST;

launchFabric({host, port, routesDir: 'listing', serviceName: 'ListingWebService'});
