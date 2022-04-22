//-------------- Ajax -------------



(function readyJS(win,doc){
    
    const loginLink = doc.getElementById('login-link')
    const registerLink = doc.getElementById('register-link')
    const menuHomeLink = doc.getElementById('menu-home-link')
    const homeLink = doc.getElementById('header-title')
    const postsLink = doc.getElementById('posts-link')
    const postagensLink = doc.getElementsByClassName('postagem')

    const content = doc.querySelector('.content')
    
    let clicado = false

    function PostRefresh(){
        for(var i=0;i<postagensLink.length;i++){
            let item = postagensLink[i]
            item.addEventListener('click',(e)=>{
                e.preventDefault()
                
                let ajax = new XMLHttpRequest()
                let link = item.href
                let route = link.replace('https://drill-blog.herokuapp.com', '')

                ajax.open('GET', link)
                ajax.onreadystatechange = ()=>{
                    if(ajax.status === 200 && ajax.readyState ===4){
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
                let route = location.href.replace("https://drill-blog.herokuapp.com","")
                let comentario = doc.getElementById('comment-text').value
                
                ajax.open('POST', link)
                ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                ajax.send(`texto=${comentario}`)
                ajax.onreadystatechange = ()=>{
                    if(ajax.status === 200 && ajax.readyState ===4){
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
    
                ajax.open('POST', 'https://drill-blog.herokuapp.com/register')
                ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                ajax.send(`name=${name}&email=${emailAddress}&password=${passwordAddress}&password2=${passwordAddress2}`)
                ajax.onreadystatechange = ()=>{
                    if(ajax.status === 200 && ajax.readyState ===4){
                        let cortar = ajax.responseText.split('cortar-->')
                        history.pushState(null,null, "/")
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
                    let route = location.href.replace("https://drill-blog.herokuapp.com","")
                    console.log(commentID)
        
                    ajax.open('POST', 'https://drill-blog.herokuapp.com/post/comment/delete')
                    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                    ajax.send(`id=${commentID}`)
                    ajax.onreadystatechange = ()=>{
                        if(ajax.status === 200 && ajax.readyState ===4){
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

    doc.addEventListener('DOMContentLoaded', ()=>{PostRefresh(); ListRefresh();})

    homeLink.addEventListener('click', (e)=>{
        e.preventDefault()
        let ajax = new XMLHttpRequest()
        
        ajax.open('GET', 'https://drill-blog.herokuapp.com/')
        ajax.onreadystatechange = ()=>{
            if(ajax.status === 200 && ajax.readyState ===4){
                let cortar = ajax.responseText.split('cortar-->')
                history.pushState(null,null, '/')
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                PostRefresh()
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
    })  

    menuHomeLink.addEventListener('click', (e)=>{
        e.preventDefault()
        let ajax = new XMLHttpRequest()
        
        ajax.open('GET', 'https://drill-blog.herokuapp.com/')
        ajax.onreadystatechange = ()=>{
            if(ajax.status === 200 && ajax.readyState ===4){
                let cortar = ajax.responseText.split('cortar-->')
                history.pushState(null,null, '/')
                sessionStorage['oldURL'] = location.href
                content.innerHTML = cortar[1]
                PostRefresh()
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
    }) 

    if(loginLink != null){
        loginLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()
            
            ajax.open('GET', 'https://drill-blog.herokuapp.com/login')
            ajax.onreadystatechange = ()=>{
                if(ajax.status === 200 && ajax.readyState ===4){
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,'Login', '/login')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
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
        })  
    }

    

    if(registerLink != null){
        registerLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()
            
            ajax.open('GET', 'https://drill-blog.herokuapp.com/register')
            ajax.onreadystatechange = ()=>{
                if(ajax.status === 200 && ajax.readyState ===4){
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,null, '/register')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
                    RegisterRefresh()
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
        })  
    }

    if(postsLink != null){
        postsLink.addEventListener('click', (e)=>{
            e.preventDefault()
            let ajax = new XMLHttpRequest()
            
            ajax.open('GET', 'https://drill-blog.herokuapp.com/admin/posts')
            ajax.onreadystatechange = ()=>{
                if(ajax.status === 200 && ajax.readyState ===4){
                    let cortar = ajax.responseText.split('cortar-->')
                    history.pushState(null,null, '/admin/posts')
                    sessionStorage['oldURL'] = location.href
                    content.innerHTML = cortar[1]
                    if(screen.width < 768){
                        let menu = doc.querySelector('.header-menu')
                        menu.style.transform = 'translate(-100%, 130px)'
                        doc.querySelector('.hamburguer-lines').classList.remove('active')
                        doc.querySelector('.line1').classList.remove('one')
                        doc.querySelector('.line2').classList.remove('second')
                        doc.querySelector('.line3').classList.remove('third')
                        clicado = false
                    }
                    ListRefresh()
                }
            }   
            ajax.send()
        })  
    }


    //History Back
    window.addEventListener('popstate',()=>{
        let ajax = new XMLHttpRequest()
        let route = location.href.replace('https://drill-blog.herokuapp.com', "")
            
        ajax.open('GET', location.href)
        ajax.onreadystatechange = ()=>{
            if(ajax.status === 200 && ajax.readyState ===4){
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
    
    
    
})(window,document)