import { browser } from "$app/environment";
import { getToken } from "./auth.service";

const baseUrl = 'https://api.spotify.com/v1';

function getOptions() {
    if (browser) {
        const token = localStorage.getItem('SpotifyUserAuthToken');
        return {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    }
}


export async function getUserInfo() {
    await getToken();
    const call = await fetch(baseUrl + '/me', getOptions())
    return await call.json();
}

/**
 * @param {number} offset 
 */
export async function getAlbums(offset) {
    await getToken();
    const call = await fetch(baseUrl + '/me/albums?offset=' + offset, getOptions())
    return await call.json();
}