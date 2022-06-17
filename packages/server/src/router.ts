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

    // 1. import 사용예 (상단 import 영역에 작성 후 사용)
    //import logo from '/images/logo.svg'
    //res.status(200).send(`<img src="${logo}">`);
    
    // 2. url 사용
    res.status(200).send(`<img src="/images/logo.svg">`);

    // 3. await: 동적 import 사용 테스트
    //const logo = await import('/images/logo.svg');
    //res.status(200).send(`<img src="${logo.default}">`);
    //console.log('Sent:', logo);

    // 4. promise: 동적 import 사용 테스트
    //import('/images/logo.svg').then((logo) => {
    //    res.status(200).send(`<img src="${logo.default}">`);
    //    console.log('Sent:', logo);
    //});

    //res.sendFile('/uploads/' + uid + '/' + file)
});

// module.exports = router;
export default router;