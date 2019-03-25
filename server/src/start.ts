import fs from 'fs';
import spdy from 'spdy';
import path from 'path';
import {app} from '@src/server';

const port = 3000;
const backPath = path.join(process.cwd(), 'server');

const options = {
  key: fs.readFileSync(path.join(backPath, 'cert/server.key')),
  cert: fs.readFileSync(path.join(backPath, 'cert/server.crt')),
};

spdy.createServer(options, app).listen(port, error => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log('Listening on port: ' + port + '.');
  }
});
