// place files you want to import through the `$lib` alias in this folder.
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
            'Basic YzI0NTlkMTY5MmVmNGJmNTk2ZWIyODFhYzgwNDczYWM6OGU1YzFiYWEyODIwNGY2NDk5ODQyYTdlNjFmZjRhZWU'
    },
    body: new URLSearchParams({
        code: 'AQCz8081Z9WQ6Qt4q0WmgNmrZNd_NaU7U6jfuuMrnGQ6RSAYE9IGNauaLRbyq_oyPW5eCkixlOFAkqmwRmK3CO-rKex6GoMuzwVPBfTo8NSTo8JOvtVyC0XoNcdb2_t0w-LCYksut8k5ylzL2B4r300CI2-o2P3GU0XVajeNURvv6ITgZjqDLpdcYkUbdEwocZcaJ3Ifc8-25SE',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5174/login/callback'
    })
};

fetch('https://accounts.spotify.com/api/token', options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));