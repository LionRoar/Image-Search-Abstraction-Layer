const express = require('express');
const axios = require('axios');
const app = express();
const url = require('url');
let recent_Search = [];

app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.status(200).sendFile(__dirname+'/views/index.html');
});

app.get('/api/search',(req,res)=>{
  let offset = req.query.offset || 1 ;
  if(req.query.q){
        axios.get('https://www.googleapis.com/customsearch/v1',
          {
              params: {
                key:process.env.KEY,
                searchType:'image',
                cx: process.env.CX,
                start: offset,
                q: req.query.q
              }
            })
          .then(function(r){
            let term = r.data.queries.request[0].searchTerms;
            let when =  new Date();
            if(recent_Search.length >= 10){
                recent_Search.shift();
            }
            recent_Search.push({term , when});
            if(r.data.items){
                let d = r.data.items.map((r)=>{
                  return ({
                  url:r.link,snippet:r.snippet,
                  thumbnail:r.image.thumbnailLink,
                  context:r.image.contextLink
                  });
                });
                res.send(d);
            }else {
              res.send({search404:'OpSs!! , No..ReSuLtS..!'});
            }
          })
          .catch(function (error) {
            console.log(error);
            res.status(400).send({error:'can not preform the requested search'});
           });
    }else {
        res.status(204).send({error:'no search query specified!'});
    }
});

app.get('/api/latest',(req,res)=>{
  let last = [...recent_Search];
  res.status(200).send(last.reverse());
});

app.get('*',(req,res)=>{
  res.status(404).sendFile(__dirname+'/views/404.html');
});

const port = process.env.PORT||3000;

app.listen(port,()=>{
  console.log(`Server is Ready on PORT: ${port}...`);
});
