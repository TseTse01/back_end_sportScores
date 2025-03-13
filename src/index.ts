import * as dotenv from "dotenv";
dotenv.config();
import * as express from 'express';
import {Application, Response, Request} from 'express';
import {router} from '../routes/user';
import {footballmatch} from '../routes/football';
import {footballLeague} from '../routes/football';
import {footballatestMatchLeague} from '../routes/football';
import {footballStandings} from '../routes/football';
import { favorisRouteFootball } from '../routes/favorisRoute';
import { hockeyRouteMatchs } from '../routes/hockey';
import { hockeyLeague } from '../routes/hockey';
import { hockeyLeagueLatestMatch } from '../routes/hockey';
import { hockeyStandings } from '../routes/hockey';
import { basketballRouteMatchs } from '../routes/basketball';
import { basketballLeague } from '../routes/basketball';
import { basketballLeagueLatestMatch } from '../routes/basketball';
import { basketStandings } from '../routes/basketball';
import { handballRouteMatchs } from '../routes/handballRoute';
import { rugbyRouteMatchs } from '../routes/rugbyRoute';
import { rugbyLeagues } from '../routes/rugbyRoute';
import { rougbytlatestMatch } from '../routes/rugbyRoute';
import { rougbyStandings } from '../routes/rugbyRoute';
import {mmaRouteMatchs} from "../routes/mma"
import {mmaLatestMatch} from "../routes/mma"
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
 app.use('/latestMatch', footballatestMatchLeague);
 app.use('/standings', footballStandings);
 app.use('/favoris', favorisRouteFootball);
 app.use('/hockey', hockeyRouteMatchs);
 app.use('/hockeyLeague', hockeyLeague);
 app.use('/latestMatchHockey', hockeyLeagueLatestMatch);
 app.use('/hockeyStandings', hockeyStandings);
 app.use('/basketball', basketballRouteMatchs);
 app.use('/basketballLeague', basketballLeague);
 app.use('/basketballLeagueLatestMatch', basketballLeagueLatestMatch);
 app.use('/basketStandings', basketStandings);
 app.use('/handball', handballRouteMatchs);
 app.use('/rugby', rugbyRouteMatchs);
 app.use('/rugbyLeagues', rugbyLeagues);
 app.use('/rougbytlatestMatch', rougbytlatestMatch);
 app.use('/rugbyStandings', rougbyStandings);
 app.use('/mma', mmaRouteMatchs);
 app.use('/mmaLeagueLatestMatch', mmaLatestMatch);
  
  app.listen(3000, () => {
    console.log('Server Express with Typescript is runing on port 3000');
  });



