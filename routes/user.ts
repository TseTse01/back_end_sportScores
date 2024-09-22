import { Router, Request, Response } from 'express';

import User from "../models/user";

export const router =  Router();

router.get('/user', (req: Request, res: Response) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    
});

newUser.save().then((newDoc) => {
      res.json({ result: true, newDoc});
    });
    // res.json({ result: true, });
});
