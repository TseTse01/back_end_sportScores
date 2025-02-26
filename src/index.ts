import * as dotenv from "dotenv";
dotenv.config();
import * as express from 'express';
import {Application, Response, Request} from 'express';
import {router} from '../routes/user';
import {footballmatch} from '../routes/football';
import {footballLeague} from '../routes/football';
import {latestMatchLeague} from '../routes/football';
import {standings} from '../routes/football';
import { favorisRouteFootball } from '../routes/favorisRoute';
import { hockeyRouteMatchs } from '../routes/hockey';
import { hockeyLeague } from '../routes/hockey';
import { hockeyLeagueLatestMatch } from '../routes/hockey';
import { basketballRouteMatchs } from '../routes/basketball';
import { handballRouteMatchs } from '../routes/handballRoute';
import { rugbyRouteMatchs } from '../routes/rugbyRoute';
import {mmaRouteMatchs} from "../routes/mma"
import * as bodyParser from 'body-parser';
import "../models/connection"; 

const app: Application = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({limit: '50mb', type: 'application/vnd.api+json'}));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello TS');
  });
  
 app.use('/todos', router);
 app.use('/matchToday', footballmatch);
 app.use('/leagues', footballLeague);
 app.use('/latestMatch', latestMatchLeague);
 app.use('/standings', standings);
 app.use('/favoris', favorisRouteFootball);
 app.use('/hockey', hockeyRouteMatchs);
 app.use('/hockeyLeague', hockeyLeague);
 app.use('/latestMatchHockey', hockeyLeagueLatestMatch);
 app.use('/basketball', basketballRouteMatchs);
 app.use('/handball', handballRouteMatchs);
 app.use('/rugby', rugbyRouteMatchs);
 app.use('/mma', mmaRouteMatchs);
  
  app.listen(3000, () => {
    console.log('Server Express with Typescript is runing on port 3000');
  });



// back_end_sport_scores