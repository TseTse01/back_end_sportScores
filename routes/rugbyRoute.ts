import { Router, Request, Response } from "express";
import axios from "axios";

export const rugbyRouteMatchs = Router();
export const rugbyLeagues = Router();
export const rougbytlatestMatch = Router();
export const rougbyStandings = Router();


rugbyRouteMatchs.get("/:currentDate", async (req: Request, res: Response) => {
  // res.json({result:true})
  const currentDate = req.params.currentDate;
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_RUGBY}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_RUGBY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        date: currentDate,
        // date: "2024-12-13",
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
            },
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
    const responseData: { [key: string]: any[] } = {};
    if (top14.length > 0) responseData.top14 = top14;
    if (proD2.length > 0) responseData.proD2 = proD2;
    if (didi10.length > 0) responseData.didi10 = didi10;
    if (championship.length > 0) responseData.championship = championship;
    if (europechampionship.length > 0)
      responseData.europechampionship = europechampionship;
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

rugbyLeagues.get("/:country", async (req, res) => {
  const country = req.params.country;
  console.log(country, "country");
  
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_RUGBY_LEAGUES}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_RUGBY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        country: country,
        season: "2023",
      },
    });
    const data = response.data.response;

    let leaguesData = [];
    for (const d of data) {
      let dataObjet = {
        id: d.id,
        name: d.name,
        type: d.type,
        logo: d.logo,
        country: {
          id: d.country.id,
          name: d.country.name,
          flag: d.country.flag,
        },
        seasons: {
          season: d.seasons[0].season,
          current: d.seasons[0].current,
          start: d.seasons[0].start,
          end: d.seasons[0].end,
        },
      };
      leaguesData.push(dataObjet);
    }
    res.json({ result: true, leaguesData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
});

rougbytlatestMatch.get("/:leagueId", async (req, res) => {
  const leagueId = req.params.leagueId;
  console.log(leagueId, 'league id route rugbylatestmatch');
  
  try {
    // const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP_RUGBY}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_RUGBY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: leagueId,
        season: "2023",
        timezone: "Europe/Paris",
        // league: "16",
      },
    });
    const data = response.data.response;
    let matches = [];
    const getDateUntilT = (dateString: string) => {
      if (!dateString) return "";
      return dateString.split("T")[0];
    };

    for (const d of data) {
      let dataObjet = {
        id: d.id,
        date: getDateUntilT(d.date),
        time: d.time,
        timestamp: d.timestamp,
        timezone: d.timezone,
        week: d.week,
        status: {
          long: d.status.long,
          short: d.status.short,
        },
        country: {
          id: d.country.id,
          name: d.country.name,
          code: d.country.code,
          flag: d.country.flag,
        },
        league: {
          id: d.league.id,
          name: d.league.name,
          type: d.league.type,
          logo: d.league.logo,
          season: d.league.season,
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
        periods: {
          first: {
            home: d.periods.first.home,
            away: d.periods.first.away,
          },
          second: {
            home: d.periods.second.home,
            away: d.periods.second.away,
          },
          overtime: {
            home: d.periods.overtime.home,
            away: d.periods.overtime.away,
          },
          second_overtime: {
            home: d.periods.second_overtime.home,
            away: d.periods.second_overtime.away,
          },
        },
      };
      matches.push(dataObjet);
    }

    matches.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.json({ result: true, matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
});

rougbyStandings.get("/:leagueId/:season", async(req,res) => {
  const leagueId = req.params.leagueId; 
  const season = req.params.season; 
  // console.log("backend", season,leagueId);
  
  try {
    // const currentDate = getCurrentDate();
    const response = await axios.get(`${process.env.LIEN_HTTP_RUGBY_STANDINGS}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_RUGBY,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: leagueId,
        season: season,
        // TEST
        // league: "16",
        // season:"2023",
      },
    });
    const data = response.data.response[0];  
  
    res.json({result: true, data})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
  
})
