import path from 'path';
import express from 'express';
const app = express();

import connectDB from './db/connect.ts';

import ErrorHandlerMiddleware from './middleware/error-handler.ts';

import accountRouter from './routes/accounts.ts';
import setRouter from './routes/sets.ts';

app.use(express.json());
app.use(express.static('./public'));

app.use('/api/accounts', accountRouter);
app.use('/api/sets', setRouter);

app.use(ErrorHandlerMiddleware);

app.use((_req, res) => {
    res.sendFile(path.join(process.cwd(), './public/index.html'))
});

const port: number = Number(process.env.PORT) || 3_000;
async function start() {
    try {
        await connectDB(process.env.MONGO_URI!);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}.`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();