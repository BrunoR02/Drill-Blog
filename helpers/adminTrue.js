module.exports = {
    adminTrue: (req,res,next)=>{
        if(req.isAuthenticated() && req.user.adminTrue == 1){
            return next()
        }
        req.flash("error_msg", "Você precisa ser admin para acessar essa página!")
        res.redirect("/")
    }
}