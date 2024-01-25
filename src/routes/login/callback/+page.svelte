<script>
	import { goto } from '$app/navigation';
	import { getRefreshToken, getToken } from '$lib/core/services/auth.service';
	import { onMount } from 'svelte';

	onMount(() => {
		const code = window.location.search.split('=')[1];
		if (code === 'access_denied') {
			localStorage.setItem('SpotifyUserAuth', '');
			goto('/');
		}
		localStorage.setItem('SpotifyUserAuth', code.split('&')[0]);
		getRefreshToken();
		goto('/dash');
	});
</script>

<div class="bg-[#121212] h-screen w-full"></div>
