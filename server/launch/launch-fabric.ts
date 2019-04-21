import path from 'path';
import fs from 'fs';
import spdy from 'spdy';
import {api} from '@src/server';
import {logger} from '@src/utils/logger';

const backPath = path.join(process.cwd(), 'server');
const routesPath = path.join(backPath, 'build', 'src', 'routes');

type LaunchSettings = {port: string | number; routesDir: string; serviceName: string};

const options = {
  key: fs.readFileSync(path.join(backPath, 'cert/server.key')),
  cert: fs.readFileSync(path.join(backPath, 'cert/server.crt')),
};

export const launchFabric = ({port, routesDir, serviceName}: LaunchSettings) => {
  try {
    fs.readdirSync(path.join(routesPath, routesDir)).map(file => {
      const filePath = path.join(routesPath, routesDir, file);
      require(filePath)(api);
    });
  } catch (error) {
    console.error(`Error loading routes for ${serviceName}`, error);
    // logger.error(`Error loading routes for ${serviceName}`, error);
    process.exit(1);
  }

  return () => {
    return spdy.createServer(options, api).listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.error(`${serviceName} listening on ${port} port!`);
        // logger.error(`${serviceName} listening on ${port} port!`);
      }
    });
    // return api.listen(+port, host, err => {
    //   if (err) {
    //     console.error(err);
    //     logger.error('Error starting ' + serviceName);
    //     process.exit(1);
    //   }
    //   if (process.env.NODE_ENV !== 'test') console.log(`${serviceName} listening on ${port} port and ${host} host!`);
    // });
  };
};
