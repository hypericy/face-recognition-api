const handleRegister = (pool,bcrypt)=>(req,res) => {
    const {name , email , password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    const saltRounds = 10;
    let hashed_password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        hashed_password = hash;
    });
    pool.connect((err,client, done) =>{
        // func for error
        const errorHandle= (err) => {
            if(err){
                res.status(400).json("unable to register");
                console.log('Error in transaction', err.stack)
                client.query('ROLLBACK', err =>{
                    if(err){
                        res.status(400).json("unable to register");  
                        console.error('ERROR rolling back client');
                    } 
                    done();
                })
            }
            return !!err;
        };
        // transaction 
        client.query('BEGIN')
        .then(()=>{
            console.log('hash_password',hashed_password);
            const queryInsertLogin = `INSERT INTO login(hash, email)
            VALUES ('${hashed_password}', '${email}') RETURNING email`;
            return client.query(queryInsertLogin);
        })
        .then((loginEmail) => {
            const queryInsertUser = `INSERT INTO users(name, email, entries) 
    VALUES ( '${name}', '${loginEmail.rows[0].email}', 0) RETURNING *`;
            return client.query(queryInsertUser);
        })
        .then((user)=>{
            client.query('COMMIT');
            res.json(user.rows[0]);
            done();
        })
        .catch(err =>{
            errorHandle(err);
        })
    })
}

export {handleRegister} ;