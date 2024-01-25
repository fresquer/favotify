<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	let baseUrl;

	onMount(() => {
		const generateRandomStringBase64 = () => {
			const array = new Uint32Array(28);
			window.crypto.getRandomValues(array);
			return Array.from(array, (dec) => dec.toString(36)).join('');
		};
		const state = generateRandomStringBase64();

		baseUrl =
			'https://accounts.spotify.com/authorize?client_id=c2459d1692ef4bf596eb281ac80473ac&response_type=code&redirect_uri=https://favotify.fresquer.dev/login/callback&scope=user-library-read&state=' +
			state;
		console.log(baseUrl);
	});
</script>

<div
	class="bg-[url('/background.webp')] bg-cover h-screen w-full flex items-center justify-center flex-col gap-8 p-8"
>
	<div>
		<div class="flex justify-center mb-4">
			<p
				class="text-xs font-semibold p-2 bg-blue-100 border border-blue-500 rounded-lg text-blue-600"
			>
				BETA v1.0
			</p>
		</div>
		<h1 class="text-5xl sm:text-7xl font-bold mb-4 text-center up">Favotify</h1>
		<p class="text-center">Explora tus álbumes favoritos de Spotify de forma sencilla</p>
	</div>

	<div
		class="login bg-[#181818] p-8 rounded-lg w-fit text-white hover:bg-[#282828] transition-all ease-in-out duration-300 cursor-pointer"
	>
		<a href={baseUrl} class="block w-fit">
			<div class="bg-green-500 w-fit gap-2 px-3 py-2 rounded-lg flex items-center justify-center">
				<img src="/spotify-white-icon.svg" alt="icon" class="w-8" />
				<p class="block uppercase font-semibold tracking-wider whitespace-nowrap">
					Conecta spotify
				</p>
			</div>
		</a>
	</div>

	<div class="text-center absolute bottom-0 mb-4">
		<p class="text-sm">
			Hecho con ❤️ por <a href="https://fresquer.dev" target="_blank" class="text-green-500"
				>Fernando Fresquer</a
			>
		</p>
	</div>
</div>
