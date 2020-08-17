import {createMovie, getAll, checkResult, getMovieById, editMovieById, deleteMovie, likeM, getLikes, addLike} from '../data.js'
import {showError, showInfo} from "../notification.js";


export default async function home() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        userHome: await this.load('./templates/userHome.hbs'),
        movie: await this.load('./templates/movie.hbs')

    };
    const context = Object.assign({}, this.app.userData);
    if (this.app.userData.email) {
        context.movies = await (await getAll()).json();
    }


    this.partial('./templates/home.hbs', context);

}

export async function createPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    };
    this.partial('./templates/movies/addMovie.hbs', this.app.userData);

}

export async function postCreate() {
    try {

        if ((this.params.title.trim()).length === 0) {
            throw new Error('Title can not be empty');
        }
        if ((this.params.description.trim()).length === 0) {
            throw new Error('Description can not be empty');
        }
        if ((this.params.imageUrl.trim()).length === 0) {
            throw new Error('Image can not be empty');
        }

        const movie = {
            title: this.params.title,
            description: this.params.description,
            image: this.params.imageUrl,
            creator: this.app.userData.email,
            peopleLiked: 0
        }


        const result = await createMovie(movie);
        checkResult(result);

        showInfo("Recipe created successfully");
        this.redirect('#/home')

    } catch (error) {
        showError(error.message);
    }


}

export async function detailsPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    };



    const movie = await (await getMovieById(this.params.id)).json();

    const context = Object.assign({movie}, this.app.userData);
    movie.canLike = true;
    const likes = await (await getLikes()).json();
    likes.forEach(like=>{
        if (like.movieID === this.params.id && like.UserID === this.app.userData.userId ){
            movie.canLike = false;
        }
    })

    if (movie.creator === this.app.userData.email) {
        movie.canEdit = true;
    }
    this.partial('./templates/movies/details.hbs', context);

}

export async function editPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    };

    const movie = await (await getMovieById(this.params.id)).json();

    const context = Object.assign({movie: movie}, this.app.userData);

    await this.partial('./templates/movies/editMovie.hbs', context);
    console.log(context.movie)


}

export async function editPost() {

    try {
        const movie = await (await getMovieById(this.params.id)).json();
        movie.title = this.params.title;
        movie.description = this.params.description;
        movie.image = this.params.imageUrl;
        //validate like in register user

        const result = await editMovieById(this.params.id, movie);
        checkResult(result);

        showInfo("Edited successfully");
        this.redirect(`#/details/${this.params.id}`)

    } catch (error) {
        showError(error.message);
    }


}


export async function removeMovie() {
    try {
        const id = this.params.id;
        const result = await deleteMovie(id);
        checkResult(result);

        showInfo("Deleted successfully");
        this.redirect('#/home')

    } catch (error) {
        showError(error.message);
    }

}

export async function likeMovie(){

    try {
        const like = {};

    const id = this.params.id;
        like.movieID = id;
        like.UserID = this.app.userData.userId;
        const likeResult = await addLike(like)

        checkResult(likeResult);
        const result = await likeM(id);
    checkResult(result);

    showInfo("Liked successfully");
        this.redirect(`#/details/${this.params.id}`)

}catch (error){
    showError(error.message);
}

}

