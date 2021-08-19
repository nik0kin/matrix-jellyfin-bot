import express from 'express';
// import bodyParser from 'body-parser';

export function startWebhookServer(port: number, callback: (n: any) => void) {
  const app = express();

  app.use(express.json());

  app.post('/webhook', function (request, response) {
    console.log('POST /webhook');
    console.dir(request.body);
    // console.log(request)
    callback(request.body);
    response.status(200).send();
  });

  app.listen(port);
}
