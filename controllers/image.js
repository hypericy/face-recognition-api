import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '1cd03f1ac99042079dd800ec49868432'
  });

const handleApiCall = (req,res) =>{
    const {url} = req.body;
    app.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', url)
    .then(data => res.json(data))
    .catch(console.log);
}

const handleImage = (pool) => (req,res)=>{
    const {id, url} = req.body;
    pool.query(`UPDATE users set entries = entries + 1 WHERE id = '${id}' RETURNING *`)
    .then(response => {
        if(response.rows.length) res.json(response.rows[0].entries);
        else res.status(400).json(`no such user: ${id}`);
    })
    .catch(err => res.status(400).json('error'));
}

export {handleApiCall,handleImage};