<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	export let data;
	// jsnotations string

	function formatDate(dateRaw) {
		let date = new Date(dateRaw);
		let day = String(date.getDate()).padStart(2, '0');
		let month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
		let year = date.getFullYear();
		return day + '/' + month + '/' + year;
	}
	/**
	 * @type {Array<{Album: string, Artist: string, coverUrl: string, date: string, link: string}>} arrayAlbumns
	 */
	let arrayAlbumns = [];
	/**
	 * @type {Object} userInfo
	 */
	let userInfo = {};
	/**
	 * @type {boolean} loading
	 */
	let loading = true;

	let total = 0;
	let offset = 0;
	const limit = 20;
	let menuLogout = false;

	if (browser) {
		const userCode = localStorage.getItem('SpotifyUserAuth');
		const userToken = localStorage.getItem('SpotifyUserAuthToken');
		console.log('🚀 ~ userToken:', userToken);
		// if access token is expired, get new one
		if (!userToken || userToken === 'undefined') {
			console.log(
				'🚀 ~ localStorage.getItem ~ localStorage.getItem',
				localStorage.getItem('SpotifyUserAuthToken')
			);
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization:
						'Basic YzI0NTlkMTY5MmVmNGJmNTk2ZWIyODFhYzgwNDczYWM6OGU1YzFiYWEyODIwNGY2NDk5ODQyYTdlNjFmZjRhZWU'
				},
				body: new URLSearchParams({
					code: userCode,
					grant_type: 'authorization_code',
					redirect_uri: 'http://localhost:5174/login/callback'
				})
			};
			// if refresh token is expired, get new one
			// if refresh is not expired, get new access token

			fetch('https://accounts.spotify.com/api/token', options)
				.then((response) => response.json())
				.then((response) => {
					console.log(response);
					const { access_token, refresh_token, expires_in } = response;
					localStorage.setItem('SpotifyUserAuthToken', access_token);
					localStorage.setItem('SpotifyUserAuthRefreshToken', refresh_token);
					localStorage.setItem('SpotifyUserAuthExpiresIn', expires_in);
				})
				.catch((err) => console.error(err));
		}

		if (userToken) {
			const refreshToken = localStorage.getItem('SpotifyUserAuthRefreshToken');
			const url = 'https://accounts.spotify.com/api/token';

			const payload = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
					client_id: 'c2459d1692ef4bf596eb281ac80473ac'
				})
			};
			const body = fetch(url, payload)
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					return data;
				})
				.catch((err) => console.log(err));

			loadAlbum();
			loadUserInfo();
		}
	}

	function loadAlbum() {
		loading = true;
		const options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('SpotifyUserAuthToken')
			}
		};

		fetch(`https://api.spotify.com/v1/me/albums?offset=${offset}`, options)
			.then((response) => response.json())
			.then((response) => {
				loading = false;
				total = response.total;
				arrayAlbumns = [
					...arrayAlbumns,
					...response.items.map((item) => {
						return {
							Album: item.album.name,

							Artist: item.album.artists[0].name,
							coverUrl: item.album.images[0].url,
							date: formatDate(item.added_at),
							link: item.album.external_urls.spotify
						};
					})
				];
			})
			.catch((err) => console.error(err));
	}

	function loadUserInfo() {
		const options = {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('SpotifyUserAuthToken')
			}
		};

		fetch('https://api.spotify.com/v1/me', options)
			.then((response) => response.json())
			.then((response) => {
				userInfo = {
					name: response.display_name,
					image: response.images[0].url
				};
			})
			.catch((err) => console.error(err));
	}
	function logout() {
		localStorage.setItem('SpotifyUserAuth', '');
		localStorage.setItem('SpotifyUserAuthToken', '');
		localStorage.setItem('SpotifyUserAuthRefreshToken', '');
		localStorage.setItem('SpotifyUserAuthExpiresIn', '');
		goto('/login');
	}
	function nextPage() {
		offset += limit;
		loadAlbum();
	}

	function toogleMenu() {
		menuLogout = !menuLogout;
	}
</script>

<div class="bg-[#121212] min-h-screen pb-16">
	<main class="container mx-auto pt-8 px-4">
		<div class="flex justify-between items-center mb-8">
			<div class="flex items-end">
				<h1 class="text-white text-4xl md:text-7xl font-extrabold mr-3">Mis discos</h1>
				{#if arrayAlbumns.length > 0}
					<p class="text-lg text-green-500">{total} guardadados</p>
				{/if}
			</div>
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex items-center bg-[#181818] hover:bg-[#282828] transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full relative"
					on:click={toogleMenu}
				>
					<img src={userInfo.image} alt={userInfo.name} class="rounded-full w-8 h-8 mr-4" />
					<div class="text-right relative">
						<p class="font-bold text-lg">{userInfo.name}</p>
					</div>
					{#if menuLogout}
						<div class="bg-[#282828] absolute top-[55px] right-[5px] px-8 p-2 border border-white">
							<button class="text-xs hover:text-gray-400" on:click={logout}> Logout </button>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<!-- <div class="mb-4">
			<p class="font-bold text-lg">{new Date().getFullYear()}</p>
		</div> -->
		{#if arrayAlbumns.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
				{#each arrayAlbumns as post}
					<div
						class="p-4 rounded-xl bg-[#181818] text-white hover:bg-[#282828] transition-all ease-in-out duration-300 cursor-pointer"
					>
						<a href={post.link} target="_blank">
							<img src={post.coverUrl} alt={post.Album} class="rounded mb-2" />
							<p class="font-bold">
								{post.Album}
							</p>
							<p>
								- {post.Artist}
							</p>
							<p class="text-sm text-gray-600 mt-2">
								{post.date}
							</p>
						</a>
					</div>
				{/each}
			</div>
			{#if !loading && arrayAlbumns.length < total }
				<div class="flex justify-center mt-4">
					<button
						class="btn btn-primary bg-green-500 hover:bg-green-400 p-2 rounded-lg px-4 text-[#181818]"
						on:click={nextPage}>Cargar más</button
					>
				</div>
			{/if}
		{/if}
		{#if loading}
			<div class="flex justify-center items-center mt-8">
				<div class="animate-spin h-6 w-6 border-t-2 border-b-2 border-gray-900 bg-green-500"></div>
			</div>
		{/if}
	</main>
</div>
