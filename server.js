import express from 'express'
import cors from 'cors'
import pg from 'pg'
import bcrypt from 'bcrypt'
import path from 'path'
import {handleRegister} from './controllers/register.js'
import {handleSignin} from './controllers/signin.js'
import {handleApiCall, handleImage} from './controllers/image.js'
import {handleProfile} from './controllers/profile.js'




const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('build'));
//database 
const Pool = pg.Pool;
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'face',
    password: '1234',
    port: 5432,
  })

// pool.query('select * from users')
// .then(res => console.log(res.rows))
// .catch(err => console.log(err));
//bcrypt


app.get('/',(req,res)=>{
    //res.json(database.users);
})

app.post('/signin',handleSignin(pool , bcrypt));
app.get('/profile/:id', handleProfile(pool));
app.post('/register', handleRegister(pool,bcrypt));
app.put('/image',handleImage(pool));
app.post('/imageUrl',handleApiCall)

app.listen(3000,()=>{
    console.log('app is running');
})