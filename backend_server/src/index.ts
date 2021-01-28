import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {settings} from './config';
import routes from './routes/routes';
import * as path from 'path';
import { SocketIOServer } from './sockets/socketIOServer';
import { StoreService } from './services/store-service';

const app: core.Express = express();
const port: string | number = process.env.PORT || settings.backendPort;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  // for cors
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Set-Cookie');
  next();
});

app.use(express.static(__dirname + '/evm-proj'));
app.get('*', (req, res, next) => {
  if (!req.originalUrl.includes('api')) {
    res.sendFile(path.join(__dirname + '/evm-proj/index.html'));
  } else {
    next();
  }
});
app.use(`/api/${settings.version}`, routes);

const server = app.listen(port);
const socketIOServer = new SocketIOServer(server, new StoreService());
socketIOServer.initServer();
socketIOServer.onConnection();
console.log(`Backend server is listening on port ${port}`);
console.log('NODE_ENV', process.env.NODE_ENV);
