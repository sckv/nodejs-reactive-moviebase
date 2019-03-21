import fs from 'fs';
import spdy from 'spdy';
import {app} from '@src/server';

const port = 3000;

const options = {
  key: fs.readFileSync(__dirname + '../cert/server.key'),
  cert: fs.readFileSync(__dirname + '../cert/server.crt'),
};

spdy.createServer(options, app).listen(port, error => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log('Listening on port: ' + port + '.');
  }
});
