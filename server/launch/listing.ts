import {launchFabric} from './launch-fabric';

const port = process.env.LISTING_SERVICE_PORT;

launchFabric({port, routesDir: 'listing', serviceName: 'ListingWebService'})();
