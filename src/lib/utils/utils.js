export function storeExpiresTimeSeconds() {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add one hour in milliseconds
    localStorage.setItem('SpotifyUserAuthExpiresIn', expirationTime.toISOString());
}

export function isTokenExpired() {
    const expirationTimeStored = localStorage.getItem('SpotifyUserAuthExpiresIn');
    if (!expirationTimeStored) {
        return true;
    }
    const expirationTime = new Date(expirationTimeStored);
    const currentTime = new Date();
    return currentTime > expirationTime;
}

/**
* @param {Date} dateRaw
*/
export function formatDate(dateRaw) {
    let date = new Date(dateRaw);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let year = date.getFullYear();
    return day + '/' + month + '/' + year;
}