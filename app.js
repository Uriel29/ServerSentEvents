const express = require('express');
const app = express();




const user = require('./user')
const {urlbd } = require('./bd')

const routeUser = require('./routerUser')


const mongoose = require('mongoose');

mongoose.connect(urlbd, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => { app.emit('pronto');})
  .catch(e => console.log(e));




app.set('view engine', 'ejs')

app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}));






//https://masteringjs.io/tutorials/express/server-sent-events
//https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js

app.get('/eventos', (req, res) => {

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    
  });
  


res.write('retry: 10000\n\n');

  //https://docs.mongodb.com/manual/changeStreams
  //usando o mongo que emite uma mudança na coleção
user.SenhaUSer.watch().on('change', (mudanca)=>{


  const {operationType} = mudanca; 
 
 
 res.write(`data:${operationType}\n\n`)

 res.flushHeaders()

});
})





app.on('pronto', () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});




