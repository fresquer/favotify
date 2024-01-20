<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const code = window.location.search.split('=')[1];
		if (code === 'access_denied') {
			localStorage.setItem('SpotifyUserAuth', '');
			goto('login');
		}
		goto('/dash');
		localStorage.setItem('SpotifyUserAuth', code.split('&')[0]);
		console.log('🚀 ~ onMount ~ code:', code);
	});
</script>

<div class="bg-[#121212] h-screen w-full"></div>
