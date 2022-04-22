const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/User")
const User = mongoose.model("users")

module.exports = (passport) =>{

    passport.use(new localStrategy({usernameField: "email"}, (email,password,done)=>{
        User.findOne({email: email}).then((user)=>{
            if(!user){
                return done(null, false,{message:"Essa conta não existe"})
            }

            bcrypt.compare(password, user.password,(error, success)=>{
                if(success){
                    return done(null, user)
                } else{
                    return done(null,false,{message: "Senha incorreta"})
                }
            })
        })

        passport.serializeUser((user,done)=>{
            done(null, user.id)
        })
        
        passport.deserializeUser((id,done)=>{
            User.findById(id, (error,user)=>{
                done(error, user)
            })
        })
    }))
}