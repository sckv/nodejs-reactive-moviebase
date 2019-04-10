import fs from 'fs';
import spdy from 'spdy';
import path from 'path';
import {api} from '@src/server';

const port = 3000;
const backPath = path.join(process.cwd(), 'server');

const options = {
  key: fs.readFileSync(path.join(backPath, 'cert/server.key')),
  cert: fs.readFileSync(path.join(backPath, 'cert/server.crt')),
};

try {
  fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
    require('./routes/' + file)(api);
  });
} catch (error) {
  console.error('Error loading routes!', error);
  process.exit(1);
}

export const ignite = () => {
  return spdy.createServer(options, api).listen(port, () => {
    if (process.env.NODE_ENV !== 'test') console.log(`Example app listening on ${port} port and host!`);
  });
};
