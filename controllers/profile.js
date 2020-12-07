const handleProfile = (pool) => (req,res)=>{
    const {id} = req.params;
    // const find = database.users.find( user => user.id===id);
    pool.query(`SELECT * FROM users WHERE id= '${id}'`)
    .then(response =>{
        if(response.rows.length>0) res.json(response.rows[0]);
        else res.status(400).json(`no such user: ${id}`)
    })
    .catch(err=> res.status(404).json(`error`))
    
}

export {handleProfile};