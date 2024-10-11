import * as dotenv from "dotenv";
dotenv.config();
import * as express from 'express';
import {Application, Response, Request} from 'express';
import {router} from '../routes/user';
import {routerDataMatchToday} from '../routes/dataMatchToday';
import * as bodyParser from 'body-parser';
import "../models/connection"; 
import { log } from 'console';
const app: Application = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({limit: '50mb', type: 'application/vnd.api+json'}));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello TS');
  });
  
 app.use('/todos', router);
 app.use('/matchToday', routerDataMatchToday);
  
  app.listen(3000, () => {
    console.log('Server Express with Typescript is runing on port 3000');
  });



// back_end_sport_scores