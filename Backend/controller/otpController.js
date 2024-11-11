const nodemailer = require('nodemailer');
const con=require('../config')
const { google } = require('googleapis');
const bcrypt = require('bcrypt')

const { error } = require('console');

let randomNumber = 0;
let expirationTime='';
let currentEmail = '';

const sendEmail = (req, resp) => {
    const { email } = req.body;
    currentEmail = email;    
    con.query('select * from user_registration where email=?', [currentEmail], (err, result) => {
        if (err) {
            resp.status(408).json({ message: 'error in finding email ' })
        }
        else if (result.length < 1) {
            resp.status(409).json({ message: 'User  does not exist' })
        }
        else {
        let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'somanathkuanr12@gmail.com',
            pass: 'wthb ipqm gcgc spig'
        }
    });
    randomNumber = Math.floor(Math.random() * ((999999 - 100000) + 1)) + 100000;
   console.log(randomNumber);
        const currentTime = new Date().getTime();
        expirationTime = currentTime + 2 * 60 * 1000; 
        //console.log(expirationTime);
    
    let mailOptions = {
        from: 'somanathkuanr12@gmail.com',
        to: email,
        subject: 'OTP for Reseting password',
        html: `<h4> otp for reseting  your password is: ${randomNumber} . The otp is valid for 2 minutes</h4><br><br><strong style="color: red;">WARNINGS: Please do not share otp with others...</strong> `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            resp.status(405).json({ message: "otp can not sended" });
        } else {
           // resp.send(true)
            con.query("insert into otpTable (email,otp) values (?,?)",[email,randomNumber],(err,res)=>{
                if(err)
                {
                    resp.status(406).json({ message: "error during storing otp" });
                }
                else
                {
                    // resp.status(200).json({ message: 'otp sent successfully' })
                    //resp.send(true)
                    resp.json({
                        isSent:true,
                        otp:randomNumber
                    });
                }
            })
        }
    });

    
   }
  })
}

const verifyOtp = (req, resp) => {
    const otp = req.params.otp;
    const email=req.params.email;
    

    con.query("select * from otpTable where otp=? and email=?",[otp,email],(err,res)=>{
        if(err)
        {
            resp.status(405).json({ message: "error during finding otp in db" });
        }
        else if(res.length<1)
        {
            resp.status(405).json({ message: "otp does not match" });
        }
        else{
            con.query("Update otpTable set isVerified=TRUE where email=?",[email],(errr,results)=>
            {
                if(errr)
                {
                    resp.status(405).json({ message: "error  in db" });
                }
                if(results){
                   // resp.status(200).json({ message: "otp successfully verified" })
                    resp.send(true);
                }
            })
        }
        
    })
}

const updatePassword = (req, resp) => {
    const { password, email } = req.body;

    console.log(password);
    if (password == '') {
        resp.status(406).json({ message: "Password should not be empty" });
    } else {
        con.beginTransaction((err) => {
            if (err) {
                resp.status(401).json({ message: 'Error in beginning transaction' });
            } else {
                con.query('SELECT * FROM user_registration WHERE email=?', [email, password], (err, result) => {
                    if (err) {
                        con.rollback(() => {
                            resp.status(401).json({ message: 'Error in finding email' });
                        });
                    } else if (result.length < 1) {
                        con.rollback(() => {
                            resp.status(409).json({ message: 'User does not exist' });
                        });
                    } else {
                        bcrypt.hash(password, 6, (err, hash) => {
                            if (err) {
                                con.rollback(() => {
                                    resp.status(402).json({ message: 'Error in bcrypt' });
                                });
                            } else {
                                con.query("UPDATE user_registration SET password=? WHERE email=?", [hash, email], (err, res) => {
                                    if (err) {
                                        con.rollback(() => {
                                            resp.status(403).json({ message: 'Error in registration' });
                                        });
                                    }
                                    con.query("DELETE FROM otpTable WHERE email=?", [email], (err, result) => {
                                        if (err) {
                                            con.rollback(() => {
                                                resp.status(405).json({ message: 'Error in deleting otp' });
                                            });
                                        } else {
                                            con.commit((err) => {
                                                if (err) {
                                                    con.rollback(() => {
                                                        resp.status(405).json({ message: 'Error in commit' });
                                                    });
                                                } else {
                                                    resp.status(200).json({ message: 'Password updated successfully' });
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

module.exports = {
    updatePassword,
    verifyOtp,
    sendEmail
};