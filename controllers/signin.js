const handleSignin = (pool , bcrypt) => (req,res) => {
    const {email ,password} = req.body;
    const queryLogin = `SELECT * FROM login WHERE email = '${email}'`;
    
    pool.query(queryLogin)
    .then(response =>{
        const hash = response.rows[0].hash;
        bcrypt.compare(password,hash).then(result=>{
            if(result){
                const queryGetUser = `SELECT * FROM users WHERE email = '${response.rows[0].email}'`;
                return pool.query(queryGetUser)
                .then(user =>{
                    res.json(user.rows[0]);
                })
                .catch(err => res.status(400).json(err));
            }
            else{
                res.status(400).json('Wrong password');
            }
        });
    })
    .catch(err => res.status(400).json('No such user'));

}

export {handleSignin};