import {registerPage, registerPost, loginPage, loginPost, getLogout} from "./controllers/user.js"
import home, {createPage, postCreate, detailsPage, editPage, editPost, removeMovie, likeMovie } from "./controllers/home.js";

window.addEventListener('load', () => {
const app = Sammy('#container', function(){
    this.use('Handlebars', 'hbs');

    this.userData = {
        email : sessionStorage.getItem('email') || '',
        userId: sessionStorage.getItem('userId') || '',

    };

    this.get('/', home);
    this.get('indexExam.html', home);
    this.get('#/home', home);
    this.get('index.html', home);
    this.get('#/register',registerPage);
    this.post('#/register',  (ctx)=> {registerPost.call(ctx)});
    this.get('#/login',loginPage);
    this.post('#/login',  (ctx)=> {loginPost.call(ctx)});
    this.get('#/logout',getLogout);
    this.get('#/create',createPage);
    this.post('#/create',(ctx)=> {postCreate.call(ctx)});
    this.get('#/details/:id',detailsPage);
    this.get('#/edit/:id',editPage);
    this.post('#/edit/:id',(ctx)=> {editPost.call(ctx);});
    this.get('#/delete/:id',removeMovie);
    this.get('#/like/:id',likeMovie);

});
    app.run()
});