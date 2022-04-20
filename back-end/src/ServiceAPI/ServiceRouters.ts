import express from 'express'
import { jwtClient } from './ServiceAccount'
import ServiceAcount from './ServiceAccount'

import ToolsGd from '../../tools/ToolsGd';
import { app } from '../..';

app.post('/loginServiceApi', async (req: any, res: any) => {
    try {
        ServiceAcount.main(req)
        res.send(req.session);
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send(error.message);
        console.log(error);
    };
})
