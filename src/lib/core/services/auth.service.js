import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { isTokenExpired, storeExpiresTimeSeconds } from "$lib/utils/utils";
import { PUBLIC_SPOTIFY_AUTH } from '$env/static/public';

const url = 'https://accounts.spotify.com/api/token';

function getOptions(grant_type, code) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' + PUBLIC_SPOTIFY_AUTH
        },
        body: new URLSearchParams({
            code,
            refresh_token: code,
            grant_type: grant_type,
            redirect_uri: 'http://localhost:5174/login/callback'
        })
    };
}

export async function getToken() {
    if (browser) {
        if (isTokenExpired()) {
            await getRefreshToken()
        } else {
            const token = localStorage.getItem('SpotifyUserAuthToken');
            return token;
        }
    }
}

export async function getRefreshToken() {
    const userRefreshToken = localStorage.getItem('SpotifyUserAuthRefreshToken');
    if (userRefreshToken) {
        const options = getOptions('refresh_token', userRefreshToken);
        const api = await fetch(url, options)
        const response = await api.json();
        setNewTokens(response);

    } else {
        const userCode = localStorage.getItem('SpotifyUserAuth');
        const options = getOptions('authorization_code', userCode);
        const api = await fetch(url, options)
        const response = await api.json();
        setNewTokens(response);
    }
}

function setNewTokens(response) {
    const { access_token, refresh_token } = response;
    if (access_token) {
        localStorage.setItem('SpotifyUserAuthToken', access_token);
        localStorage.setItem('SpotifyUserAuthRefreshToken', refresh_token);
        storeExpiresTimeSeconds();
    }
}

export function logout() {
    localStorage.setItem('SpotifyUserAuth', '');
    localStorage.setItem('SpotifyUserAuthToken', '');
    localStorage.setItem('SpotifyUserAuthRefreshToken', '');
    localStorage.setItem('SpotifyUserAuthExpiresIn', '');
    goto('/');
}