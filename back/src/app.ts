import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

const port: number = Number(process.env.PORT) || 3_000;
const start = () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}.`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();