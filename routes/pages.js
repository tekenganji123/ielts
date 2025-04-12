const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const sql = require('mysql')
const bcrypt = require('bcryptjs')

const db = sql.createConnection({
    host:process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
})

router.get('/', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM users WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                console.log(result);
                res.render('dashboard')
                // res.json(result)
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})


router.get('/admindashboard', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM users WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                console.log(result);
                if(result[0].type == 'admin'){
                    res.render('dashboard')
                }else{
                    res.render('home')
                }
                
                // res.json(result)
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})



router.get('/home', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM users WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                console.log(result);
                if(result[0].type == 'admin'){
                    res.render('dashboard')
                }else{
                    res.render('home')
                }
                
                // res.json(result)
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})

router.get('/alluserinfo', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM users WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                db.query('SELECT * FROM test', (e,data)=>{
                    if (!e) {
                        res.json(data)
                    }
                })
                
                // res.json(result)
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})


router.get('/Ahome', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM users WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                console.log(result);
               
                    res.render('Ahome')
                
                
                // res.json(result)
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})


router.post('/result',(req, res) =>{
    
    
    const {email} = req.body
console.log(email);
    db.query('SELECT * FROM test WHERE email = ?', [email], (err,result) =>{
        if(!err){
            console.log(result);
            res.json(result)
        }else{
            console.log(err);
            
        }
    })
})


router.post('/delete', (req,res)=>{
    const {email} = req.body
    console.log(email);
    db.query('DELETE FROM test WHERE email = ?',[email], (err,ress) =>{
        if(!err){
            console.log(ress);
            
            db.query('DELETE FROM users WHERE email = ?',[email], (error,result) =>{
                if(!error){
                    res.json({status:200, msg:'record deleted successfully'})
                }else{
                    console.error(error);
                    
                    res.json({status:400, msg:'something went wrong'})
                }
            })
        }else{
            console.error(err);
            
            res.json({status:401, msg:'something went wrong'})
        }
    })
// res.json(email)
})


router.get('/logout', (req, res) =>{
    req.session.destroy()
    res.clearCookie('auth-token')
    res.render('login')
})



router.post('/me', async(req,res)=>{
    const token = (req.session.authToken)
    // const token = req.cookies['auth-token']
    if(!token){
        console.log('no token found');
        
         res.render('login')
    }else{
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const tel = (decodedToken.phone);
        const query = "SELECT * FROM test WHERE email = ?"
        
        db.query(query, [tel], (err,  result) =>{
            if(!err){
                console.log(result);
               res.json(result)
                
                
            }else{
                res.clearCookie('auth-token')
                res.render('login') 
            }
        })
    }
})

router.post('/change', (req,res)=>{
    console.log(req.body);
    const {oldPassword, newPassword} = req.body
   const user = 'admin'
    db.query('SELECT * FROM users WHERE type = ?',[user], async(err, data) =>{
        if(!err){
            const isMatch = await bcrypt.compare(oldPassword, data[0].password)
            console.log(isMatch);
            
        if (isMatch){
             const hashedpassword =  await bcrypt.hash(newPassword, 8);
            console.log(hashedpassword);
            
             db.query('UPDATE users SET password = ? WHERE type = ?', [hashedpassword,user], (error, result) =>{
                if(!error){
                    res.json({status:201, msg: 'successfull'})
                }else{
                    res.json({status:401, msg:'some thing went wrong'})
                    console.log(error);
                    
                }
             })
             
        }else{
            res.json({status:401, msg:'Invalid old password'})

        }
       
        }else{
            console.log(err);
            
        }
    })
    // res.json(req.body)
    
})

module.exports = router