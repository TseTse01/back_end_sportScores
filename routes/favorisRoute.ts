import { Router, Request, Response } from "express";
import axios from "axios";

export const favorisRouteFootball = Router();

favorisRouteFootball.get('/:ids', async (req: Request, res: Response) => {
  console.log("back end" + req.params.ids);
  
    const ids = req.params.ids;
    // const ids = "1208123-1208126-1208131";
    try {
        const response = await axios.get(`${process.env.LIEN_HTTP_FOOTBALL}`, {
            headers: {
                "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_FOOTBALL,
                "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
            },
            params: {
                // date: "2024-11-09",
                ids: ids,
                timezone: "Europe/Paris",
            },
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
              },
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
              },
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
    
        // Crée un objet pour stocker uniquement les tableaux non vides
        const responseData: { [key: string]: any[] } = {};
    
        if (frLigue1Data.length > 0) responseData.frLigue1Data = frLigue1Data;
        if (enPremierLeague.length > 0)
          responseData.enPremierLeague = enPremierLeague;
        if (deBundesliga.length > 0) responseData.deBundesliga = deBundesliga;
        if (geErovnuliLiga.length > 0) responseData.geErovnuliLiga = geErovnuliLiga;
        if (itSerieA.length > 0) responseData.itSerieA = itSerieA;
        if (esLaliga.length > 0) responseData.esLaliga = esLaliga;
    
        // Vérifie si responseData a des propriétés
        if (Object.keys(responseData).length > 0) {
          res.json({
            result: true,
            ...responseData, // Récupère tous les tableaux non vides
          });
        } else {
          // Si aucun tableau n'a de données
          // console.log(responseData);
          res.json({ result: false, message: "Aucune donnée disponible." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch match data" });
    }
});