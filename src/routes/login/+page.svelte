<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	let baseUrl;

	if (browser) {
		// clean all local storage
		localStorage.setItem('SpotifyUserAuth', '');
		localStorage.setItem('SpotifyUserAuthToken', '');
		localStorage.setItem('SpotifyUserAuthRefreshToken', '');
		localStorage.setItem('SpotifyUserAuthExpiresIn', '');
	}
	onMount(() => {
		const generateRandomStringBase64 = () => {
			const array = new Uint32Array(28);
			window.crypto.getRandomValues(array);
			return Array.from(array, (dec) => dec.toString(36)).join('');
		};
		const state = generateRandomStringBase64();

		baseUrl =
			'https://accounts.spotify.com/authorize?client_id=c2459d1692ef4bf596eb281ac80473ac&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5174%2Flogin%2Fcallback&scope=user-library-read&state=' +
			state;
		console.log(baseUrl);
	});
</script>

<div class="bg-[#121212] h-screen w-full flex items-center justify-center">
	<div
		class="login bg-[#181818] p-8 rounded-lg min-w-96 text-white hover:bg-[#282828] transition-all ease-in-out duration-300 cursor-pointer flex justify-center"
	>
		<a href={baseUrl}>
			<button class="btn btn-primary bg-green-500 p-2 rounded-lg">
				Login tu cuenta de Spotify
			</button>
		</a>
	</div>
</div>
