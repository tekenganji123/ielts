const bcrypt = require('bcryptjs')
const sql = require('mysql')
const jwt = require('jsonwebtoken')


const db = sql.createConnection({
    host:process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
})

exports.login = (req, res) =>{
    console.log(req.body);
    const {email, passwold} = req.body
    // res.json(req.body)
    db.query('SELECT * FROM users WHERE email = ?', [email], async(err, result) =>{
        console.log(result);
        
        if(err){
            console.log("ERROR",err);
            res.json({data:{status:401, msg:'Some thing went wrong please try again'}})
        }else{
             console.log(result);
            if(result.length < 1){
                res.json( {data:{status: 401, msg:'Invalid user info!'}})
            }else{

                const isMatch = await bcrypt.compare(passwold,result[0].password)

               console.log(isMatch);
               if(isMatch){
                const user = {phone : email}
                console.log(user);
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                console.log(accessToken);
                
              res.cookie('auth-token', accessToken, {
               httpOnly:true,
               secure: true,
               maxAge:3600000
              })
              req.session.authToken = accessToken
              req.session.user = {user}
                res.json( {data:{status: 201, msg:'good!',type:result[0].type}})
               }else{
                res.json( {data:{status: 401, msg:'Invalid password!'}})
               }
               
            }
        }
    })
    
}

exports.add = (req,res) =>{
    console.log(req.body);
    const {email,password,candidate_name,candidate_number,trf, center_number,test_type,date,listening,reading,writing, speaking, overall} = req.body

    db.query('SELECT * FROM users WHERE email = ?', [email ], (er, re) =>{
        if(!er){
            if (re.length < 1) {
                 db.query("INSERT INTO test SET ?",
                     {
                                email: email,
                                name:candidate_name,
                                number: candidate_number,
                                trf_number: trf,
                                center_number:center_number, 
                                test_type:test_type,
                                listening:listening,
                                reading:reading,
                                writing:writing,
                                speaking:speaking,
                                overall:overall,
                            }, async(err,result) => {
                                if (!err) {
                                    const hashedPassword = await bcrypt.hash(password, 8)
                                    db.query("INSERT INTO users SET ?",{
                                        email: email,
                                        password:hashedPassword
                                    },(error, data) =>{
                                        if (!error) {
                                            console.log('good');
                                            
                                            res.redirect('/admindashboard')
                                        }
                                    }) 
                                }else{
                                    console.error(err);
                                    
                                }
                            })
            }else{
                console.log('already exist');
                
            }
        }else{
            console.error(er);
            
        }
    })

   
    // res.json({msg:'form data recieved'})
}

