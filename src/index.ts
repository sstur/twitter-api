import express from 'express';
import { attachHandlers } from './server';

const PORT = 3000;

const app = express();

attachHandlers(app);

app.get('/', (request, response) => {
  response.send(`<p>Open the <a href="/playground">REST Playground</a></p>`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
