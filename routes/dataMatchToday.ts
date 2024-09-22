import { Router, Request, Response } from 'express';
import axios from 'axios';
import { log } from 'console';

export const routerDataMatchToday = Router();

function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');  // Les mois commencent à 0
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

routerDataMatchToday.get('/', async (req: Request, res: Response) => {
  try {
    const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP}`, {
      headers: {
        'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY
      },
      params: { 
        date: currentDate,
      }
    });
    const data = response.data.response;

    let frLigue1Data = [];
    let enPremierLeague = [];
    let deBundesliga = [];
    let geErovnuliLiga = [];
    let itSerieA = [];
    let esLaliga = [];

    for (const d of data) {
      let dataObjet = {
        fixture: {
          id: d.fixture.id,
          date: d.fixture.date,
          timestamp: d.fixture.timestamp,
          periods: {
            first: d.fixture.periods.first,
            second: d.fixture.periods.second,
          },
          venue: {
            id: d.fixture.venue.id,
          },
          status: {
            long: d.fixture.status.long,
            short: d.fixture.status.short,
            elapsed: d.fixture.status.elapsed,
          }
        },
        league: {
          id: d.league.id,
          name: d.league.name,
          country: d.league.country,
          logo: d.league.logo,
          flag: d.league.flag,
        },
        teams: {
          home: {
            id: d.teams.home.id,
            name: d.teams.home.name,
            logo: d.teams.home.logo,
            winner: d.teams.home.winner,
          },
          away: {
            id: d.teams.away.id,
            name: d.teams.away.name,
            logo: d.teams.away.logo,
            winner: d.teams.away.winner,
          }
        },
        goals: {
          home: d.goals.home,
          away: d.goals.away,
        },
      };

      // Utilisation de switch pour simplifier la logique
      switch (d.league.name) {
        case "Ligue 1":
            if (d.league.country === "France") frLigue1Data.push(dataObjet);
          break;
        case "Premier League":
          if (d.league.country === "England") enPremierLeague.push(dataObjet);
          break;
        case "Bundesliga":
          if (d.league.country === "Germany") deBundesliga.push(dataObjet);
          break;
        case "Erovnuli Liga":
          if (d.league.country === "Georgia") geErovnuliLiga.push(dataObjet);
          break;
        case "Serie A":
          if (d.league.country === "Italy") itSerieA.push(dataObjet);
          break;
        case "La Liga":
          if (d.league.country === "Spain") esLaliga.push(dataObjet);
          break;
        default:
          break;
      }
    }

    res.json({
      result: true,
      frLigue1Data,
      enPremierLeague,
      deBundesliga,
      geErovnuliLiga,
      itSerieA,
      esLaliga
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch match data' });
  }
});