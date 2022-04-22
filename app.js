const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const Handlebars = require("handlebars")
const mongoose = require("mongoose")
const path = require("path")
const admin = require("./routes/admin")
const session = require("express-session")
const flash = require("connect-flash")
const fs = require('fs')
const db = require("./configs/db")

require("./models/Post")
const posts = mongoose.model("posts")
require("./models/User")
const users = mongoose.model("users")
require("./models/Comments")
const comments = mongoose.model("comments")

const passport = require("passport")
const bcrypt = require("bcryptjs")
require("./configs/auth")(passport)


//Configs
    //Session
        app.use(session({
            secret: "drillapp",
            resave: true,
            saveUninitialized: true
        }))
    //Passport
        app.use(passport.initialize())
        app.use(passport.session())
    //Flash
        app.use(flash())
        app.use((req,res,next)=>{
            //Declarar variaveis globais
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null 
            next()
        })
    //Express
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
    //Handlebars
        app.engine("handlebars", handlebars.engine({defaultLayout: 'main', 
        runtimeOptions:{
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsbyDefault: true
        }}))
        app.set("view engine", 'handlebars')
    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then(()=>{
        console.log('Connected to MongoDB!')
    }).catch((error)=>{
        console.log("Fail to connect to mongodb:", error)
    })
    //Usar Css e imagens
        app.use(express.static("public"))

app.get("/", (req,res)=>{
    posts.findOne().sort({data: 'desc'}).then(RecentItem=>{
        posts.find().skip(1).sort({data: 'desc'}).limit(8).then((items)=>{
            res.render("home",{RecentPost: RecentItem, posts: items})
            
        }).catch(error =>{
            req.flash("error_msg","Error to show posts")
            res.redirect("/")
        })
    })
    
})

//Post page

app.get("/post/:slug", (req,res)=>{
    posts.findOne({slug: req.params.slug}).then(postagem=>{
        comments.find({postRef: postagem._id}).sort({data: "desc"}).populate("usuario").then((comentarios)=>{
            res.render("pagePost", {post: postagem, comments: comentarios})

        })
    }).catch(error=>{
        req.flash("error_msg", "Esse post não existe!")
        res.redirect("/")
    })
})

//Comentario
app.post("/post/:slug/sent",(req,res)=>{
    posts.findOne({slug: req.params.slug}).then(item=>{
        comments.find({postRef: item._id}).sort({data: "desc"}).populate("usuario").then((comentarios)=>{
           
            let errors = []

            if(!req.body.texto || typeof req.body.texto == undefined || req.body.texto == null){
                errors.push({texto: "Texto Inválido"})
            } else if(req.body.texto.length < 3) {
                errors.push({texto: "Comentário muito curto para postar"})
            }

            if(errors.length > 0){
                res.render("pagePost", {errors: errors[0], post: item, comments: comentarios})
            } else{
                const newComment = new comments({
                    postRef: item._id,
                    usuario: req.user,
                    content: req.body.texto,
                    data: Date.now()
                })
                comments.create(newComment).then(()=>{
                    req.flash("success_msg","Comentário Postado!")
                    res.redirect("/post/"+req.params.slug)
                }).catch(error =>{
                    req.flash("error_msg","Erro ao criar o comentário")
                    res.redirect("/post/"+req.params.slug)
                })

            }
            
        })
    })
})

//Handlebars Helper para comparar valores:

Handlebars.registerHelper("ifEqual", function (value1,value2,option){
    if(value1 == value2){
        return option.fn(this)
    } else{
        return option.inverse(this)
    }
})

app.post("/post/comment/delete",(req,res)=>{
    comments.findOne({_id: req.body.id}).then(comment=>{
        posts.findOne({_id: comment.postRef}).then(postItem=>{
            comments.deleteOne({_id: req.body.id}).then(()=>{
                req.flash("success_msg", "Comentário deletado com sucesso!")
                res.redirect("/post/"+postItem.slug)
            }).catch(error=>{
                req.flash("error_msg", "Erro ao deletar o comentário")
                res.redirect("/post/"+postItem.slug)
            })
        })
    })
})



//Login, Registro

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{

    let errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({texto: "Nome Inválido"})
    } else if(req.body.name.length < 3){
        errors.push({texto: "Nome muito curto"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({texto: "Email Inválido"})
    } else if(req.body.email.length < 5){
        errors.push({texto: "Email muito curto"})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({texto: "Senha Inválida"})
    } else if(req.body.password.length < 5){
        errors.push({texto: "Senha muito curta"})
    } else if(req.body.password != req.body.password2){
        errors.push({texto: "As senhas não batem! Tente novamente"})
    }

    if(errors.length > 0){
        res.render("register",{errors: errors[0]})
    } else{
        users.findOne({email: req.body.email}).then((item)=>{
            if(item){//Se ja existir um email
                req.flash("error_msg", "Esse email já foi registrado em nosso banco! Use outro")
                res.redirect("/register")
            } else{
                const newUser = new users({
                    name: req.body.name,
                    email: req.body.email,
                    adminTrue: 0,
                    password: req.body.password
                })
        
                bcrypt.genSalt(10,(error,salt)=>{
                    bcrypt.hash(newUser.password,salt,(error,hash)=>{
                        if(error){
                            req.flash("error_msg", "Erro ao salvar o usuario")
                            res.redirect("/")
                        } else{
                            newUser.password = hash
        
        
                            users.create(newUser).then(()=>{
                                req.flash("success_msg", "Usuario Registrado com Sucesso!")
                                res.redirect("/")
                            }).catch(error =>{
                                req.flash("error_msg", "Erro ao criar usuario. Tente Novamente")
                                res.redirect("/")
                            })
                        }
                    })
                })
            }
        }).catch((error)=>{
            req.flash("error_msg", "Erro Interno")
            res.redirect("/")
        })

        
    }
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res,next)=>{
    console.log(req.body.email)
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req,res,next)
})

app.get("/logout",(req,res)=>{
    req.logout()
    req.flash("success_msg","Deslogado")
    res.redirect("/")
})

app.use("/admin", admin)

//Outros
const PORT = process.env.PORT || 8081

app.listen(PORT, ()=>{
    console.log("Running")
})

