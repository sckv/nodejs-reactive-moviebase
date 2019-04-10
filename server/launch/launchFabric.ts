import path from 'path';
import fs from 'fs';
import {api} from '@src/server';
import {logger} from '@src/utils/logger';

const routesPath = path.join(process.cwd(), 'server', 'build', 'routes');

type LaunchSettings = {host: string; port: string | number; routesDir: string; serviceName: string};

export const launchFabric = ({host, port, routesDir, serviceName}: LaunchSettings) => {
  try {
    fs.readdirSync(routesPath).map(file => {
      require(path.join(routesPath, routesDir) + file)(api);
    });
  } catch (error) {
    console.error(`Error loading routes for ${serviceName}`, error);
    process.exit(1);
  }

  return () => {
    return api.listen(+port, host, err => {
      if (err) {
        console.error(err);
        logger.error('Error starting ' + serviceName);
        process.exit(1);
      }
      if (process.env.NODE_ENV !== 'test') console.log(`${serviceName} listening on ${port} port and ${host} host!`);
    });
  };
};
