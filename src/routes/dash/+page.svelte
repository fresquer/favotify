<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/core/services/auth.service.js';
	import { getAlbums, getUserInfo } from '$lib/core/services/spotify.service.js';
	import { formatDate } from '$lib/utils/utils';
	// jsnotations string

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

	function loadAlbum() {
		loading = true;
		getAlbums(offset)
			.then((response) => {
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
				loading = false;
			})
			.catch((err) => console.error(err));
	}

	function loadUserInfo() {
		getUserInfo()
			.then((response) => {
				userInfo = {
					name: response.display_name,
					image: response.images[0].url
				};
			})
			.catch((err) => console.error(err));
	}

	function nextPage() {
		offset += limit;
		loadAlbum();
	}

	function toogleMenu() {
		menuLogout = !menuLogout;
	}

	if (browser) {
		//setTimeout(() => {
		loadAlbum();
		loadUserInfo();
		//}, 200);
	}
</script>

<div class="bg-[#121212] min-h-screen pb-16">
	<main class="container mx-auto pt-8 px-4">
		<div class="flex justify-between items-center mb-8">
			<div class="flex items-end flex-wrap">
				<h1 class="text-white text-4xl md:text-7xl font-extrabold mr-3">Mis discos</h1>
				{#if arrayAlbumns.length > 0}
					<p class="text-lg text-green-500">{total} guardadados</p>
				{/if}
			</div>
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				{#if userInfo.name !== undefined && arrayAlbumns.length > 0}
					<div
						aria-haspopup="true"
						class="flex items-center bg-[#181818] hover:bg-[#282828] transition-all ease-in-out duration-300 cursor-pointer px-2 md:px-4 py-2 rounded-full relative"
						on:click={toogleMenu}
					>
						<img src={userInfo.image} alt={userInfo.name} class="rounded-full w-8 h-8 md:mr-4" />
						<div class="text-right relative hidden md:block">
							<p class="font-bold text-lg">
								{userInfo.name}
							</p>
						</div>
						{#if menuLogout}
							<div
								class="bg-[#282828] absolute top-[55px] right-[5px] px-8 p-2 border border-white"
							>
								<button class="text-xs hover:text-gray-400" on:click={logout}> Logout </button>
							</div>
						{/if}
					</div>
				{/if}
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
			{#if !loading && arrayAlbumns.length < total}
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
