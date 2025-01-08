import { Router, Request, Response } from "express";
import axios from "axios";

export const mmaRouteMatchs = Router();

mmaRouteMatchs.get("/", async (req:Request,res: Response) => {
    const currentDate = req.params.currentDate;
    try {
      const response = await axios.get(`${process.env.LIEN_HTTP_MMA}`, {
        headers: {
          "x-rapidapi-host": process.env.X_RAPIDAPI_HOST_MMA,
          "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        },
        params: {
        //   date: currentDate,
          timezone: "Europe/Paris",
          date: "2025-01-18",
        },
      });
      const data = response.data.response;
      // res.json({data})
      // console.log(response.data.response);
      
          let Bantamweight = [];
          let Flyweight = [];
          let Lightweight = [];
          let Womens_Bantamweight = [];
          let Middleweight = [];
          let Heavyweight = [];
          let Light_Heavyweight = [];
      
      
          for (const d of data) {
            let dataObjet = {
              fixture: {
                id: d.id,
                date: d.date,
                time: d.time,
                is_main: d.is_main,
                category: d.category,
                slug: d.slug,
                timestamp: d.timestamp,
              },
              status: {
                long: d.status.long,
                short: d.status.short,
              },
              fighters: {
                first:{
                    id: d.fighters.first.id,
                    name: d.fighters.first.name,
                    logo: d.fighters.first.logo,
                    winner: d.fighters.first.winner,
                },
                second:{
                    id: d.fighters.second.id,
                    name: d.fighters.second.name,
                    logo: d.fighters.second.logo,
                    winner: d.fighters.second.winner,
                },
              }
            };
      
          //   Utilisation de switch pour simplifier la logique
            switch (d.category) {
              case "Bantamweight":
                 Bantamweight.push(dataObjet);
                break;
              case "Flyweight":
                 Flyweight.push(dataObjet);
                break;
              case "Lightweigh":
                 Lightweight.push(dataObjet);
                break;
              case "Women's Bantamweight":
                Womens_Bantamweight.push(dataObjet);
                break;
              case "Middleweight":
                 Middleweight.push(dataObjet);
                break;
              case "Heavyweight":
                 Heavyweight.push(dataObjet);
                break;
              case "Light Heavyweight":
                Light_Heavyweight.push(dataObjet);
                break;
              default:
                break;
            }
          }
         const responseData: {[key: string]: any[] } = {};
         if (Bantamweight.length > 0) responseData.Bantamweight = Bantamweight;
         if (Flyweight.length > 0)
           responseData.Flyweight = Flyweight;
         if (Lightweight.length > 0) responseData.Lightweight = Lightweight;
         if (Womens_Bantamweight.length > 0) responseData.Womens_Bantamweight = Womens_Bantamweight;
         if (Middleweight.length > 0) responseData.Middleweight = Middleweight;
         if (Heavyweight.length > 0) responseData.Heavyweight = Heavyweight;
         if (Light_Heavyweight.length > 0) responseData.Light_Heavyweight = Light_Heavyweight;
         
      
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
})