import path from 'path';
import fs from 'fs';
import spdy from 'spdy';
import { api } from '@src/server';
import { errorsHandler } from '@src/middlewares/error-handler';

let backPath;
let routesPath;
if (process.env.NODE_ENV !== 'production') {
  backPath = path.join(process.cwd(), 'server');
  routesPath = path.join(backPath, 'build', 'src', 'routes');
} else {
  backPath = path.join('/app');
  routesPath = path.join(backPath, 'src', 'routes');
}

type LaunchSettings = { port?: string | number; routesDir: string; serviceName: string };

const options = {
  // key: fs.readFileSync(path.join(backPath, 'cert/server-key.pem')),
  // cert: fs.readFileSync(path.join(backPath, 'cert/server-crt.pem')),
  // ca: fs.readFileSync(path.join(backPath, 'cert/ca-crt.pem')),
  // requestCert: false,
  // rejectUnauthorized: false,
  // allowHTTP1: true,
  key: fs.readFileSync(path.join(backPath, 'cert/server.key')),
  cert: fs.readFileSync(path.join(backPath, 'cert/server.crt')),
  protocols: ['h2', 'http/1.1'],
};

export const launchFabric = ({ port = 443, routesDir, serviceName }: LaunchSettings) => {
  try {
    fs.readdirSync(path.join(routesPath, routesDir)).map(file => {
      if (path.extname(file) === '.js') {
        const filePath = path.join(routesPath, routesDir, file);
        require(filePath)(api);
      }
    });
    api.use(errorsHandler);
  } catch (error) {
    console.error(`Error loading routes for ${serviceName}`, error);
    process.exit(1);
  }

  const createdServer = spdy.createServer(options, api).listen(port, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`${serviceName} listening on ${port} port!`);
    }
  });
  createdServer.setTimeout(0);
  return createdServer;
};
