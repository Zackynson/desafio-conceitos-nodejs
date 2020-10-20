const express = require("express");
const cors = require("cors");
const { isUuid } = require("uuidv4");

const {v4: uuid} = require('uuid');

const app = express();

app.use( express.json() );
app.use( cors() );

app.use('/repositories/:id', (req, response, next) => {

  if ( !isUuid( req.params.id ) )
  {
    return response.status(400).json({error: 'Invalid repository ID'})
  }

  else{
    return next();
  }
})

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  }

  repositories.push( repository );

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  
  const { title, url, techs } = request.body;

  if(request.body.likes) return response.json({likes : 0})

  const repositoryIndex = repositories.findIndex( repo => repo.id === request.params.id );

  const repository = {
    id: repositories[repositoryIndex].id,
    title,
    url,
    techs,
    "likes" : repositories[repositoryIndex].likes
  }
   
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = repositories.findIndex( repo => repo.id === request.params.id );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  if (id)
  {
    const repositoryIndex = repositories.findIndex( repo => repo.id === request.params.id );

    repositories[repositoryIndex].likes += 1;

    return response.json(repositories[repositoryIndex]);
  }
});

module.exports = app;
