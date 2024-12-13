import { Router, Request, Response } from "express";
import axios from "axios";

export const handballRouteMatchs = Router();

handballRouteMatchs.get("/:currentDate", async (req: Request, res: Response) => {
  // res.json({result:true})
  const currentDate = req.params.currentDate;
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_HANDBALL}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_HANDBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        date: currentDate,
        timezone: "Europe/Paris",
        // date: "2025-03-12",
      },
    });
    const data = response.data.response;
// res.json({data})
// console.log(response.data.response);

    let starligue = [];
    let ligaAsobal = [];
    let bundesliga = [];
    let hla = [];
    let europeanChampionship = [];
    let worldChampionship = [];


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
        case "HLA":
          if (d.country.name === "Austria") hla.push(dataObjet);
          break;
        case "Bundesliga":
          if (d.country.name === "Germany") bundesliga.push(dataObjet);
          break;
        case "Starligue":
          if (d.country.name === "France") starligue.push(dataObjet);
          break;
        case "Liga ASOBAL":
          if (d.country.name === "Spain") ligaAsobal.push(dataObjet);
          break;
        case "World Championship":
          if (d.country.name === "World") ligaAsobal.push(dataObjet);
          break;
        case "European Championship":
          if (d.country.name === "Europe") europeanChampionship.push(dataObjet);
          break;
        default:
          break;
      }
    }
   const responseData: {[key: string]: any[] } = {};
   if (starligue.length > 0) responseData.starligue = starligue;
   if (ligaAsobal.length > 0)
     responseData.ligaAsobal = ligaAsobal;
   if (bundesliga.length > 0) responseData.bundesliga = bundesliga;
   if (europeanChampionship.length > 0) responseData.europeanChampionship = europeanChampionship;
   if (worldChampionship.length > 0) responseData.worldChampionship = worldChampionship;
   if (hla.length > 0) responseData.hla = hla;
   

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
