import {launchFabric} from './launchFabric';

const port = process.env.LISTING_SERVICE_PORT;

launchFabric({port, routesDir: 'listing', serviceName: 'ListingWebService'});
