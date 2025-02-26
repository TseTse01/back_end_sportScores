import { Router, Request, Response } from "express";
import axios from "axios";
import { timeStamp } from "console";

export const hockeyRouteMatchs = Router();
export const hockeyLeague = Router();
export const hockeyLeagueLatestMatch = Router();

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

hockeyLeague.get("/:country", async(req,res) => {
  const country = req.params.country;  
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_HOCKEY_LEAGUES}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_HOCKEY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
         country: country,
         season: "2023",
         // country: "france",
        // timezone: "Europe/Paris",
        
      },
    });
    const data = response.data.response;

let leaguesData = [];
   
   
for (const d of data) {
      
  let dataObjet =  {
    id: d.id,
    leaguename: d.name,
    logo:  d.logo,
    country: {
      countryId: d.country.id,
      countryName: d.country.name,
      countryFlag: d.country.flag
    },
    season: {
      seasons: d.seasons[0].season,
      current: d.seasons[0].current,
      start: d.seasons[0].start,
      end: d.seasons[0].end,
    },
  }
  leaguesData.push(dataObjet)

}


res.json({ result: true, leaguesData });

 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
})

hockeyLeagueLatestMatch.get("/:leagueId", async(req,res) => {
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_HOCKEY}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_HOCKEY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: "81",
        season: "2023",
        timezone: "Europe/Paris",
        // ids: ids,
      },
    });
    const data = response.data.response;

    let matches = [];
    const getDateUntilT = (dateString: string) => {
      if (!dateString) return "";
      return dateString.split("T")[0];
  };
  for(const d of data) {
    if(d.status.long !== "Match Cancelled") {
      let dataObjet = {
        fixture: {
          id: d.id,
          date: getDateUntilT(d.date),
          timeStamp: d.timestamp,
          time: d.time,
          status: {
            long: d.status.long,
            short: d.status.short,
          }
        },
        country: {
          id: d.country.id,
          name: d.country.name,
          flag: d.country.flag,
        },
        league: {
          id: d.league.id,
          name: d.league.name,
          logo: d.league.logo,
          season: d.league.season
        },
        teams:{
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
        periods: {
        first: d.periods.first,
        second: d.periods.second,
        third: d.periods.third,
        overtime: d.periods.overtime,
        penalties: d.periods.penalties,
      },
      }
      
      matches.push(dataObjet)
    }
  }




  matches.sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
  res.json({result: true, matches})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
})
