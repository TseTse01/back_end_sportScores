import { Router, Request, Response } from "express";
import axios from "axios";


export const footballmatch = Router();
export const footballLeague = Router();
export const footballatestMatchLeague = Router();
export const footballStandings = Router();

footballmatch.get("/:currentDate", async (req: Request, res: Response) => {
  const currentDate = req.params.currentDate;  
  // console.log(currentDate);
  
  try {
    // const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP_FOOTBALL}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_FOOTBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        // date: "2024-11-09",
        date: currentDate,
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


footballLeague.get("/:country", async (req, res) => {
  const country = req.params.country;  
  // console.log(country, "country");
  
  try {
 
    const response = await axios.get(`${process.env.LIEN_HTTP_FOOTBALL_LEAGUES}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_FOOTBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        country: country,
        season: "2023",
      },
    });
    
    const data = response.data.response;
// console.log(data, "data");


    let leaguesData = [];
    

    for (const d of data) {
      
      let dataObjet =  {
        id: d.league.id,
        leaguename: d.league.name,
        logo:  d.league.logo,
        seasons: d.seasons[0].year,
        current: d.seasons[0].current,
        country: d.country.name,
        flag: d.country.flag,
        start: d.seasons[0].start,
        end: d.seasons[0].end,
      }
      leaguesData.push(dataObjet)
   
    }
  
    res.json({ result: true, leaguesData });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch match data" });
    }
});


footballatestMatchLeague.get("/:leagueId",async(req,res) => {
  const leagueId = req.params.leagueId; 
  try {
    // const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP_FOOTBALL}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_FOOTBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: leagueId,
        season: "2023",
        timezone: "Europe/Paris",
      },
    });
    const data = response.data.response;  
    let matches = [];
    const getDateUntilT = (dateString: string) => {
      if (!dateString) return "";
      return dateString.split("T")[0];
  };
    for (const d of data ) {
      if (d.fixture.status.long !== "Match Cancelled") {
        let dataObjet = {
          fixture: {
            id: d.fixture.id,
            date: getDateUntilT(d.fixture.date),
            timestamp: d.fixture.timestamp,
            status: {
              long: d.fixture.status.long,
              short: d.fixture.status.short,
            }
           
          },
          league: {
            id: d.league.id,
            name: d.league.name,
            country: d.league.country,
            logo: d.league.logo,
            flag: d.league.flag,
            season: d.league.season,
            standings: d.league.standings,
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



footballStandings.get("/:leagueId/:season", async (req,res) => {
  const leagueId = req.params.leagueId; 
  const season = req.params.season; 
  // console.log("backend", season,leagueId);
  
  try {
    // const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP_FOOTBALL_STANDINGS}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_FOOTBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: leagueId,
        season: season,
        // TEST
        // league: "39",
        // season:"2023",
      },
    });
    const data = response.data.response[0].league.standings[0];  
  
    res.json({result: true, data})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
  
} )