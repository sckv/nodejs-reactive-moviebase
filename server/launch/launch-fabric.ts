import path from 'path';
import fs from 'fs';
import spdy from 'spdy';
import {api} from '@src/server';

let backPath;
let routesPath;
if (process.env.NODE_ENV !== 'production') {
  backPath = path.join(process.cwd(), 'server');
  routesPath = path.join(backPath, 'build', 'src', 'routes');
} else {
  backPath = path.join('/app');
  routesPath = path.join(backPath, 'src', 'routes');
}

type LaunchSettings = {port?: string | number; routesDir: string; serviceName: string};

const options = {
  key: fs.readFileSync(path.join(backPath, 'cert/server.key')),
  cert: fs.readFileSync(path.join(backPath, 'cert/server.crt')),
};

export const launchFabric = ({port = 8000, routesDir, serviceName}: LaunchSettings) => {
  try {
    fs.readdirSync(path.join(routesPath, routesDir)).map(file => {
      if (path.extname(file) === '.js') {
        const filePath = path.join(routesPath, routesDir, file);
        require(filePath)(api);
      }
    });
  } catch (error) {
    console.error(`Error loading routes for ${serviceName}`, error);
    process.exit(1);
  }

  return spdy.createServer(options, api).listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`${serviceName} listening on ${port} port!`);
    }
  });
};
