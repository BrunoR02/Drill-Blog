//-------------- Ajax -------------



(function readyJS(win,doc){
    
    const loginLink = doc.getElementById('login-link')
    const registerLink = doc.getElementById('register-link')
    const menuHomeLink = doc.getElementById('menu-home-link')
    const menuSobreLink = doc.getElementById("menu-sobre-link")
    const homeLink = doc.getElementById('header-title')
    const postsLink = doc.getElementById('posts-link')
    const postagensLink = doc.getElementsByClassName('postagem')
    const loadingSpinner = doc.getElementById('loading-spinner')

    const content = doc.querySelector('.content')

    const urlMain = 'https://drill-blog.herokuapp.com' // "http://localhost:8081" || 'https://drill-blog.herokuapp.com'
    
    let clicado = false

    function PostRefresh(){
        for(var i=0;i<postagensLink.length;i++){
            let item = postagensLink[i]
            item.addEventListener('click',(e)=>{
                e.preventDefault()
                
                let ajax = new XMLHttpRequest()
                let link = item.href
                let route = link.replace(`${urlMain}`, '')

                ajax.open('GET', link)
                ajax.onreadystatechange = ()=>{
                    if(ajax.readyState ===4){
                        loadingSpinner.classList.remove("loading-active")
                        let cortar = ajax.responseText.split('cortar-->')
                        history.pushState(null,null, route)
                        sessionStorage['oldURL'] = link
                        content.innerHTML = cortar[1]
                        win.scrollTo({
                            top: 180,
                            behavior: 'smooth'
                        })
                        CommentRefresh()
                        DeleteRefresh()
                        if(screen.width < 768){
                            let menu = doc.querySelector('.header-menu')
                            menu.style.transform = 'translate(-100%, 130px)'
                            doc.querySelector('.hamburguer-lines').classList.remove('active')
                            doc.querySelector('.line1').classList.remove('one')
                            doc.querySelector('.line2').classList.remove('second')
                            doc.querySelector('.line3').classList.remove('third')
                            clicado = false
                        }
                    }
                }  
                ajax.send()
                loadingSpinner.classList.add("loading-active")
            })
        }
    }


    function CommentRefresh(){
        let item = doc.getElementById('comment-post')
        if(item != null){
            item.addEventListener('submit',(e)=>{
                e.preventDefault()
                let ajax = new XMLHttpRequest()
                let link = location.href + "/sent"
                let route = location.href.replace(`${urlMain}`,"")
                let comentario = doc.getElementById('comment-text').value
                
                ajax.open('POST', link)
                ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                ajax.send(`texto=${comentario}`)

                loadingSpinner.classList.add("loading-active")

                ajax.onreadystatechange = ()=>{
                    if(ajax.readyState ===4){
                        loadingSpinner.classList.remove("loading-active")
                        let cortar = ajax.responseText.split('cortar-->')
                        history.pushState(null,null, route)
                        sessionStorage['oldURL'] = location.href
                        content.innerHTML = cortar[1]
                        win.scrollTo({
                            top: 120
                        })
                        CommentRefresh()
                        DeleteRefresh()
                    }
                }   
                
            })
        }
    }

    function RegisterRefresh(){
        let item = doc.getElementById('register-post')
        if(item != null){
            item.addEventListener('submit',(e)=>{
                e.preventDefault()
                let ajax = new XMLHttpRequest()
                let name = doc.getElementById('name').value
                let emailAddress = doc.getElementById('email').value
                let passwordAddress = doc.getElementById('password').value
                let passwordAddress2 = doc.getElementById('password2').value

                let isValid = validation(name,emailAddress,passwordAddress,passwordAddress2)
    
                ajax.open('POST', `${urlMain}/register`)
                ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                ajax.send(`name=${name}&email=${emailAddress}&password=${passwordAddress}&password2=${passwordAddress2}`)

                loadingSpinner.classList.add("loading-active")

                ajax.onreadystatechange = ()=>{
                    if(ajax.readyState ===4){
                        loadingSpinner.classList.remove("loading-active")
                        let cortar = ajax.responseText.split('cortar-->')
                        if(isValid){
                            history.pushState(null,null, "/register")
                        } else {
                            history.pushState(null,null, "/")
                        }
                        sessionStorage['oldURL'] = location.href
                        content.innerHTML = cortar[1]
                        PostRefresh()
                    }
                }   
            })
        }
    }

    function DeleteRefresh(){
        let deletePost = doc.getElementsByClassName('delete-post')
        if(deletePost != null){
            for(var i=0;i<deletePost.length;i++){
                let item = deletePost[i]
                item.addEventListener('submit',(e)=>{
                    e.preventDefault()
                    let ajax = new XMLHttpRequest()
                    let commentID = item.children[0].value
                    let route = location.href.replace(`${urlMain}`,"")
        
                    ajax.open('POST', `${urlMain}/post/comment/delete`)
                    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                    ajax.send(`id=${commentID}`)

                    loadingSpinner.classList.add("loading-active")

                    ajax.onreadystatechange = ()=>{
                        if(ajax.readyState ===4){
                            loadingSpinner.classList.remove("loading-active")
                            let cortar = ajax.responseText.split('cortar-->')
                            history.pushState(null,null, route)
                            sessionStorage['oldURL'] = location.href
                            content.innerHTML = cortar[1]
                            win.scrollTo({
                                top: 120
                            })
                            CommentRefresh()
                            DeleteRefresh()
                        }
                    }   
                })
            }
        }
    }

    function ListRefresh(){
        if(screen.width < 768){
            let postList = doc.querySelectorAll('.list-post')
            for (let i = 0; postList.length; i++){
                let item = postList[i]
                item.classList.remove('grid-4')
                item.classList.add('grid-12')
            }
        }
    }

    function handleMenu(){
        let menu = doc.querySelector('.header-menu')
        menu.style.transform = 'translate(-100%, 130px)'
        doc.querySelector('.hamburguer-lines').classList.remove('active')
        doc.querySelector('.line1').classList.remove('one')
        doc.querySelector('.line2').classList.remove('second')
        doc.querySelector('.line3').classList.remove('third')
        clicado = false
    }

    doc.addEventListener('DOMContentLoaded', ()=>{PostRefresh(); ListRefresh();})

    homeLink.addEventListener('click', (e)=>{
        e.preventDefault()
        let ajax = new XMLHttpRequest()
        
        if(location.href === `${urlMain}/`){ //Evitar request desnecessário
            return null
        }

        ajax.open('GET', `${urlMain}/`)
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState ===4){
                loadingSpinner.classList.remove("loading-active")
                let cortar = ajax.responseText.split('cortar-->')
                history.pushState(null,null, '/')
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                PostRefresh()
                if(screen.width < 768){
                    handleMenu()
                }
            }
        }   
        ajax.send()
        loadingSpinner.classList.add("loading-active")
    })  

    menuHomeLink.addEventListener('click', (e)=>{
        e.preventDefault()
        let ajax = new XMLHttpRequest()
        
        if(location.href === `${urlMain}/`){ //Evitar request desnecessário
            return null
        }

        ajax.open('GET', `${urlMain}/`)
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState ===4){
                loadingSpinner.classList.remove("loading-active")
                let cortar = ajax.responseText.split('cortar-->')
                history.pushState(null,null, '/')
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                PostRefresh()
                if(screen.width < 768){
                    handleMenu()
                }
            }
        }   
        ajax.send()
        loadingSpinner.classList.add("loading-active")
    }) 

    menuSobreLink.addEventListener('click', (e)=>{
        e.preventDefault()
        let ajax = new XMLHttpRequest()
        
        if(location.href === `${urlMain}/sobre`){ //Evitar request desnecessário
            return null
        }

        ajax.open('GET', `${urlMain}/sobre`)
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState ===4){
                loadingSpinner.classList.remove("loading-active")
                let cortar = ajax.responseText.split('cortar-->')
                history.pushState(null,null, '/sobre')
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                PostRefresh()
                if(screen.width < 768){
                    handleMenu()
                }
            }
        }   
        ajax.send()
        loadingSpinner.classList.add("loading-active")
    }) 

    if(loginLink != null){
        loginLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()

            if(location.href === `${urlMain}/login`){ //Evitar request desnecessário
                return null
            }
            
            ajax.open('GET', `${urlMain}/login`)
            ajax.onreadystatechange = ()=>{
                if(ajax.readyState ===4){
                    loadingSpinner.classList.remove("loading-active")
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,'Login', '/login')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
                    RegisterRefresh()
                    if(screen.width < 768){
                        handleMenu()
                    }
                }
            }   
            ajax.send()
            loadingSpinner.classList.add("loading-active")
        })  
    }

    

    if(registerLink != null){
        registerLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()

            if(location.href === `${urlMain}/register`){ //Evitar request desnecessário
                return null
            }
            
            ajax.open('GET', `${urlMain}/register`)
            ajax.onreadystatechange = ()=>{
                if(ajax.readyState ===4){
                    loadingSpinner.classList.remove("loading-active")
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,null, '/register')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
                    RegisterRefresh()
                    if(screen.width < 768){
                        handleMenu()
                    }
                }
            }   
            ajax.send()
            loadingSpinner.classList.add("loading-active")
        })  
    }

    if(postsLink != null){
        postsLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()

            if(location.href === `${urlMain}/admin/posts`){ //Evitar request desnecessário
                return null
            }
            
            ajax.open('GET', `${urlMain}/admin/posts`)
            ajax.onreadystatechange = ()=>{
                if(ajax.readyState ===4){
                    loadingSpinner.classList.remove("loading-active")
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,null, '/admin/posts')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
                    if(screen.width < 768){
                        handleMenu()
                    }
                    ListRefresh()
                }
            }   
            ajax.send()
            loadingSpinner.classList.add("loading-active")
        })  
    }


    //History Back
    window.addEventListener('popstate',()=>{
        let ajax = new XMLHttpRequest()
        let route = location.href.replace(`${urlMain}`, "")
            
        ajax.open('GET', location.href)
        ajax.onreadystatechange = ()=>{
            if(ajax.readyState ===4){
                loadingSpinner.classList.remove("loading-active")
                let cortar = ajax.responseText.split('cortar-->')
                history.replaceState(null,null, route)
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                if(route.includes('post')){
                    win.scrollTo({
                        top: 180,
                        behavior: 'smooth'
                    })
                } else {
                    win.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }
                PostRefresh()
                if(screen.width < 768){
                    handleMenu()
                }
            }
        }   
        ajax.send()
        loadingSpinner.classList.add("loading-active")
    })
    
    
    const hamburguer = doc.querySelector('.hamburguer-lines')
    hamburguer.addEventListener('click',function (){
        if(clicado == false){
            let menu = document.querySelector('.header-menu')
            menu.style.transform = 'translate(0, 130px)'
            document.querySelector('.hamburguer-lines').classList.add('active')
            document.querySelector('.line1').classList.add('one')
            document.querySelector('.line2').classList.add('second')
            document.querySelector('.line3').classList.add('third')
            clicado = true
        } else {
            let menu = document.querySelector('.header-menu')
            menu.style.transform = 'translate(-100%, 130px)'
            document.querySelector('.hamburguer-lines').classList.remove('active')
            document.querySelector('.line1').classList.remove('one')
            document.querySelector('.line2').classList.remove('second')
            document.querySelector('.line3').classList.remove('third')
            clicado = false
        }
    })

    //Validaçao do Register
    
    function validation(name,email,password,password2){
        if(!name || typeof name == undefined || name == null){
            return false
        } else if(name.length < 3){
            return false
        }
        if(!email || typeof email == undefined || email == null){
            return false
        } else if(email.length < 5){
            return false
        }
        if(!password || typeof password == undefined || password == null){
            return false
        } else if(password.length < 5){
            return false
        } else if(password != password2){
            return false
        }
        return true
    }
    
    
})(window,document)