import {beginRequest, endRequest} from "./notification.js";
import API from './api.js';

const endpoints ={
    MOVIES: 'data/movies',
    MOVIE_BY_ID : 'data/movies/',
    LIKES: 'data/movies_likedbyUsers'

};
const api = new API(
    '7240109F-EC22-B5AA-FFE9-8404ABBE6400',
    'C69E6087-B127-46FD-B867-941C50B71727',
    beginRequest,
    endRequest);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getAll(){
    return api.get(endpoints.MOVIES);
}

export async function getLikes(){
    return api.get(endpoints.LIKES);
}
export async function addLike(like){
    return api.post(endpoints.LIKES, like);
}

export async function createMovie(movie){
    return api.post(endpoints.MOVIES, movie);
}

export async function getMovieById(id){
    return api.get(endpoints.MOVIE_BY_ID + id)
}
export async function editMovieById(id, movie){
    return api.put(endpoints.MOVIE_BY_ID + id, movie);
}

export async function deleteMovie(id){
    return api.delete(endpoints.MOVIE_BY_ID + id);
}

export async function likeM(id){
    const movie = await (await getMovieById(id)).json();
    return editMovieById(id, {peopleLiked: Number(movie.peopleLiked) + 1});
}


export function checkResult(result){
    if (result.hasOwnProperty('errorData')) {
        const error = new Error();
        Object.assign(error, result);
        throw error;
    }
}


