import { Router, Request, Response } from "express";
import axios from "axios";

export const basketballRouteMatchs = Router();
export const basketballLeague = Router();
export const basketballLeagueLatestMatch = Router();
export const basketStandings = Router();

basketballRouteMatchs.get(
  "/:currentDate",
  async (req: Request, res: Response) => {
    // res.json({result:true})
    const currentDate = req.params.currentDate;
    try {
      const response = await axios.get(`${process.env.LIEN_HTTP_BASKETBALL}`, {
        headers: {
          "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_BASKETBALL,
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
        params: {
          // date: "2024-12-10",
          timezone: "Europe/Paris",
          date: currentDate,
          // ids: ids,
          //   name: "USA",
        },
      });
      const data = await response.data.response;

      let lnb = [];
      let legaA = [];
      let acb = [];
      let nba = [];
      let euroBasket = [];
      let euroCup = [];
      let euroLeague = [];

      for (const d of data) {
        let dataObjet = {
          fixture: {
            id: d.id,
            date: d.date,
            timestamp: d.timestamp,
            time: d.time,
            status: {
              long: d.status.long,
              short: d.status.short,
              elepsed: d.status.timer,
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
            home: {
              quarter_1: d.scores.home.quarter_1,
              quarter_2: d.scores.home.quarter_2,
              quarter_3: d.scores.home.quarter_3,
              quarter_4: d.scores.home.quarter_4,
              over_time: d.scores.home.over_time,
              total: d.scores.home.total,
            },
            away: {
              quarter_1: d.scores.away.quarter_1,
              quarter_2: d.scores.away.quarter_2,
              quarter_3: d.scores.away.quarter_3,
              quarter_4: d.scores.away.quarter_4,
              over_time: d.scores.away.over_time,
              total: d.scores.away.total,
            },
          },
        };

        //   Utilisation de switch pour simplifier la logique
        switch (d.league.name) {
          case "NBA":
            if (d.country.name === "USA") nba.push(dataObjet);
            break;
          case "Eurocup":
            if (d.country.name === "Europe") euroCup.push(dataObjet);
            break;
          case "LNB":
            if (d.country.name === "France") lnb.push(dataObjet);
            break;
          case "Euroleague":
            if (d.country.name === "Europe") euroLeague.push(dataObjet);
            break;
          case "ACB":
            if (d.country.name === "Spain") legaA.push(dataObjet);
            break;
          case "Lega A":
            if (d.country.name === "Italy") acb.push(dataObjet);
            break;
          case "EuroBasket":
            if (d.country.name === "euroBasket") euroBasket.push(dataObjet);
            break;
          default:
            break;
        }
      }
      const responseData: { [key: string]: any[] } = {};
      if (nba.length > 0) responseData.nba = nba;
      if (euroCup.length > 0) responseData.euroCup = euroCup;
      if (lnb.length > 0) responseData.lnb = lnb;
      if (euroLeague.length > 0) responseData.euroLeague = euroLeague;
      if (acb.length > 0) responseData.acb = acb;
      if (legaA.length > 0) responseData.legaA = legaA;
      if (euroBasket.length > 0) responseData.euroBasket = euroBasket;

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
  }
);

basketballLeague.get("/:country", async (req, res) => {
  const country = req.params.country;
  try {
    const response = await axios.get(
      `${process.env.LIEN_HTTP_BASKETBALL_LEAGUES}`,
      {
        headers: {
          "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_BASKETBALL,
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
        params: {
          // country: "france",
          country: country,
          season: "2023",
        },
      }
    );
    const data = await response.data.response;
    let leaguesData = [];

    for (const d of data) {
      let dataObjet = {
        id: d.id,
        leaguename: d.name,
        logo: d.logo,
        country: {
          countryId: d.country.id,
          countryName: d.country.name,
          countryFlag: d.country.flag,
        },
        season: {
          seasons: d.seasons[0].season,
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

basketballLeagueLatestMatch.get("/:leagueId", async (req, res) => {
  const leagueId = req.params.leagueId; 
  try {
    const response = await axios.get(`${process.env.LIEN_HTTP_BASKETBALL}`, {
      headers: {
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_BASKETBALL,
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      },
      params: {
        league: leagueId,
        season: "2023",
        timezone: "Europe/Paris",
      },
    });
    const data = await response.data.response;
    let matches = [];
    const getDateUntilT = (dateString: string) => {
      if (!dateString) return "";
      return dateString.split("T")[0];
    };
    for (const d of data) {
      if (d.status.long !== "Match Cancelled") {
        let dataObjet = {
          fixture: {
            id: d.id,
            date: getDateUntilT(d.date),
            timestamp: d.timestamp,
            time: d.time,
            status: {
              long: d.status.long,
              short: d.status.short,
              elepsed: d.status.timer,
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
            home: {
              quarter_1: d.scores.home.quarter_1,
              quarter_2: d.scores.home.quarter_2,
              quarter_3: d.scores.home.quarter_3,
              quarter_4: d.scores.home.quarter_4,
              over_time: d.scores.home.over_time,
              total: d.scores.home.total,
            },
            away: {
              quarter_1: d.scores.away.quarter_1,
              quarter_2: d.scores.away.quarter_2,
              quarter_3: d.scores.away.quarter_3,
              quarter_4: d.scores.away.quarter_4,
              over_time: d.scores.away.over_time,
              total: d.scores.away.total,
            },
          },
        };
        matches.push(dataObjet);
      }
    }
    matches.sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()
    );
    res.json({ result: true, matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch match data" });
  }
});

basketStandings.get("/:leagueId/:season", async(req,res) => {
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
        // league: "376",
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