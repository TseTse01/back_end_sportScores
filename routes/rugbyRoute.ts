import { Router, Request, Response } from "express";
import axios from "axios";

export const rugbyRouteMatchs = Router();

rugbyRouteMatchs.get("/", async (req: Request, res: Response) => {
  // res.json({result:true})
  const currentDate = req.params.currentDate;
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_RUGBY}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_RUGBY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        // date: currentDate,
        date: "2024-12-13",
        timezone: "Europe/Paris",
      },
    });
    const data = response.data.response;
// res.json({data})
// console.log(response)

    let top14 = [];
    let proD2 = [];
    let didi10 = [];
    let championship = [];
    let europechampionship = [];
    let worldcup = [];


    for (const d of data) {
      let dataObjet = {
        fixture: {
          id: d.id,
          date: d.date,
          timestamp: d.timestamp,
          time: d.time,
          periods: {
           first: {
            home: d.periods.first.home,
            away: d.periods.first.away,
           },
           second: {
            home: d.periods.second.home,
            away: d.periods.second.away,
           }
          },
          status: {
            long: d.status.long,
            short: d.status.short,
          },
        },
        league: {
         id: d.league.id,
         name: d.league.name,
         logo: d.league.logo,
        },
        country: {
          id: d.country.id,
          name: d.country.name,
          flag: d.country.flag,
        },
        teams: {
          home: {
            id: d.teams.home.id,
            name: d.teams.home.name,
            logo: d.teams.home.logo,
          },
          away: {
            id: d.teams.away.id,
            name: d.teams.away.name,
            logo: d.teams.away.logo,
          },
        },
        scores: {
          home: d.scores.home,
          away: d.scores.away,
        },
      };

    //   Utilisation de switch pour simplifier la logique
      switch (d.league.name) {
        case "Didi 10":
          if (d.country.name === "Georgia") didi10.push(dataObjet);
          break;
        case "Pro D2":
          if (d.country.name === "France") proD2.push(dataObjet);
          break;
        case "European Rugby Champions Cup":
          if (d.country.name === "Europe") europechampionship.push(dataObjet);
          break;
        case "Greene King IPA Championship":
          if (d.country.name === "England") championship.push(dataObjet);
          break;
        case "Top 14":
          if (d.country.name === "France") top14.push(dataObjet);
          break;
        case "European Championship":
          if (d.country.name === "Europe") europechampionship.push(dataObjet);
          break;
        case "World Championship":
          if (d.country.name === "World") worldcup.push(dataObjet);
          break;
        default:
          break;
      }
    }
   const responseData: {[key: string]: any[] } = {};
   if (top14.length > 0) responseData.top14 = top14;
   if (proD2.length > 0)
     responseData.proD2 = proD2;
   if (didi10.length > 0) responseData.didi10 = didi10;
   if (championship.length > 0) responseData.championship = championship;
   if (europechampionship.length > 0) responseData.europechampionship = europechampionship;
   if (worldcup.length > 0) responseData.worldcup = worldcup;
   

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
