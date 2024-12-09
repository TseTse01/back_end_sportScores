import { Router, Request, Response } from "express";
import axios from "axios";

export const hockeyRouteMatchs = Router();

hockeyRouteMatchs.get("/:currentDate", async (req: Request, res: Response) => {
  // res.json({result:true})
  const currentDate = req.params.currentDate;
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_HOCKEY}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_HOCKEY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        // date: "2024-11-17",
        date: currentDate,
        timezone: "Europe/Paris",
        // ids: ids,
      },
    });
    const data = response.data.response;
// res.json({data})
// console.log(data);

    let usaNhl = [];
    let finlandLiga1 = [];
    let swedenShl = [];
    let germanyDel = [];
    let czechExtraliga = [];

    for (const d of data) {
      let dataObjet = {
        fixture: {
          id: d.id,
          date: d.date,
          timestamp: d.timestamp,
          time: d.time,
          periods: {
            first: d.periods.first,
            second: d.periods.second,
            third: d.periods.third,
            overtime: d.periods.overtime,
            penalties: d.periods.penalties,
          },
          status: {
            long: d.status.long,
            short: d.status.short,
            elepsed: d.timer,
          },
        },
        league: {
          id: d.league.id,
          country: d.country.name,
          logo: d.league.logo,
          flag: d.country.flag,
          season: d.league.season,
          name: d.league.name,
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
        case "DEL":
          if (d.country.name === "Germany") germanyDel.push(dataObjet);

          break;
        case "SHL":
          if (d.country.name === "Sweden") swedenShl.push(dataObjet);
          break;
        case "Liiga":
          if (d.country.name === "Finland") finlandLiga1.push(dataObjet);
          break;
        case "Extraliga":
          if (d.country.name === "Czech-Republic") czechExtraliga.push(dataObjet);
          break;
        case "NHL":
          if (d.country.name === "USA") usaNhl.push(dataObjet);
          break;
        default:
          break;
      }
    }
   const responseData: {[key: string]: any[] } = {};
   if (usaNhl.length > 0) responseData.usaNhl = usaNhl;
   if (finlandLiga1.length > 0)
     responseData.finlandLiga1 = finlandLiga1;
   if (swedenShl.length > 0) responseData.swedenShl = swedenShl;
   if (germanyDel.length > 0) responseData.germanyDel = germanyDel;
   if (czechExtraliga.length > 0) responseData.czechExtraliga = czechExtraliga;
   

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
