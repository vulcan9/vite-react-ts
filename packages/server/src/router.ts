/**
 * ---------------------------------------------------------------------
 * Created by (pdi1066@naver.com) on 2022-06-14 0014.
 * ---------------------------------------------------------------------
 */
// const express = require('express');
import express, {NextFunction, Request, Response} from 'express';
import {Router} from "express-serve-static-core";

import hello from '@ss/shared'

const router: Router = express.Router({
    strict: false,
    caseSensitive: false
});

// http://localhost:3001/api/hello ==> {"message":"Hello World!"}
router.get('/hello', async (_req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: hello() + '<-- shared'});
});
router.get('/world', async (_req: Request, res: Response, next: NextFunction) => {

    //import logo from '/images/logo.svg'
    // 동적 import 사용예
    const logo = await import('/images/logo.svg');
    res.status(200).send(`<img src="${logo.default}">`);
    console.log('Sent:', logo);
});
// module.exports = router;
export default router;