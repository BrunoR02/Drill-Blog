const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../models/Post")
const posts = mongoose.model("posts")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const {adminTrue} = require("../helpers/adminTrue")

//Configurar upload de arquivos

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "public/img")
    },filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload = multer({storage})

router.get("/",(req,res)=>{
    res.render("admin/index")
})

router.get("/posts", adminTrue,(req,res)=>{
    posts.find().sort({data: 'desc'}).then((items)=>{
        res.render("admin/listPost",{posts: items})
    }).catch(error =>{
        req.flash("error_msg","Error to show posts")
        res.redirect("/posts")
    })
})

router.get("/posts/form", adminTrue,(req,res)=>{
    res.render("admin/formPost")
}) 

router.post("/posts/sent",upload.single("file"),(req,res)=>{
    
    let errors = []

    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
        errors.push({texto: "Título Inválido"})
    } else if(req.body.title.length < 3){
        errors.push({texto: "Título muito curto"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({texto: "Slug Inválido"})
    } else if(req.body.slug.length < 3){
        errors.push({texto: "Slug muito curto"})
    }
    if(!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null){
        errors.push({texto: "Descrição Inválida"})
    } else if(req.body.desc.length < 10){
        errors.push({texto: "Descrição muito curta"})
    } else if(req.body.desc.length > 200){
        errors.push({texto: "Descrição muito longa!"})
    }
    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        errors.push({texto: "Conteúdo Inválida"})
    } else if(req.body.content.length < 50){
        errors.push({texto: "Conteúdo muito curto"})
    }
    if(errors.length > 0){
        try{
            fs.unlinkSync(path.join(__dirname,"..","public/img", req.file.filename))
        } catch{
            console.log("erro de imagem")
        }
        res.render("admin/formPost",{errors: errors[0]})
    } else{
        const newpost = new posts({
            title: req.body.title,
            slug: req.body.slug,
            filename: req.file.filename,
            img: {
                data: fs.readFileSync(path.join(__dirname,"..", "public/img", req.file.filename)),
                contentType: "image/png"
            },
            desc: req.body.desc,
            content: req.body.content,
            data: Date.now()
        })

        newpost.save().then(()=>{
            req.flash("success_msg", "Post criado com sucesso!")
            res.redirect("/admin/posts")
        }).catch(error =>{
            req.flash("error_msg", "Erro ao criar o Post")
            res.redirect("/admin/posts")
        })
    }
})

router.post("/posts/delete",(req,res)=>{
    posts.deleteOne({_id: req.body.id}).then(()=>{
        fs.unlinkSync(path.join(__dirname, "..", "public/img", req.body.file1))
        req.flash("success_msg", "Post deletado com sucesso!")
        res.redirect("/admin/posts")
    }).catch(error =>{
        console.log(error)
        req.flash("error_msg", "Erro ao deletar o Post")
        res.redirect("/admin/posts")
    })
})

router.get("/posts/edit/:id", adminTrue, (req,res)=>{
    posts.findOne({_id: req.params.id}).then((item)=>{
        res.render("admin/editPost",{post: item})
    }).catch(error=>{
        req.flash("error_msg","Erro Interno")
        res.redirect("/admin/posts")
    })
})

router.post("/posts/edit",upload.single("file"),(req,res,next)=>{
    posts.findOne({_id: req.body.id}).then((item)=>{

        let errors = []
    
        if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
            errors.push({texto: "Titulo Inválido"})
        } else if(req.body.title.length < 3){
            errors.push({texto: "Titúlo muito curto"})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errors.push({texto: "Slug Inválido"})
        } else if(req.body.slug.length < 3){
            errors.push({texto: "Slug muito curto"})
        }
        if(!req.body.desc || typeof req.body.desc == undefined || req.body.desc == null){
            errors.push({texto: "Descrição Inválida"})
        } else if(req.body.desc.length < 10){
            errors.push({texto: "Descrição muito curta"})
        } else if(req.body.desc.length > 200){
            errors.push({texto: "Descrição muito longa!"})
        }
        if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
            errors.push({texto: "Conteúdo Inválida"})
        } else if(req.body.content.length < 50){
            errors.push({texto: "Conteúdo muito curta"})
        }
        if(errors.length > 0){
            try{
                fs.unlinkSync(path.join(__dirname,"..","public/img", req.file.filename))
            } catch{
                console.log("Erro de imagem")
            }
            res.render("admin/editPost",{errors: errors[0], post: item})
        } else{
            function createItem(){
                try{
                    if(item.filename != req.file.filename){
                        fs.unlinkSync(path.join(__dirname,"..","public/img", item.filename))
                        const edit = {
                            title: req.body.title,
                            slug: req.body.slug,
                            filename: req.file.filename,
                            img: {
                                data: fs.readFileSync(path.join(__dirname,"..", "public/img", req.file.filename))
                            },
                            desc: req.body.desc,
                            content: req.body.content
                        }
                        return edit
                    }
                } catch{
                    const edit = {
                        title: req.body.title,
                        slug: req.body.slug,
                        filename: item.filename,
                        desc: req.body.desc,
                        content: req.body.content
                    }
                    return edit
                }
            }
              
            

            posts.updateOne(item, createItem()).then(()=>{
                req.flash("success_msg", "Post Editado com Sucesso!")
                res.redirect("/admin/posts")
            }).catch(error=>{
                console.log(error)
                req.flash("error_msg", "Erro ao editar o post")
                res.redirect("/admin/posts")
            })

        }
    })
})


module.exports = router