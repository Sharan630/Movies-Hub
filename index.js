const tmdbApi = require('./utils/tmdbApi');

async function testTMDBAPI() {
    try {
        console.log('Fetching popular movies...');
        const popularMovies = await tmdbApi.getPopularMovies(1);
        console.log('\nPopular Movies:');
        popularMovies.results.slice(0, 5).forEach(movie => {
            console.log(`- ${movie.title} (${movie.release_date})`);
        });

        console.log('\nSearching for "Inception"...');
        const searchResults = await tmdbApi.searchMovies('Inception');
        if (searchResults.results.length > 0) {
            const inception = searchResults.results[0];
            console.log(`Found: ${inception.title} (${inception.release_date})`);
            
            console.log('\nFetching movie details...');
            const movieDetails = await tmdbApi.getMovieDetails(inception.id);
            console.log(`Overview: ${movieDetails.overview}`);
            
            console.log('\nFetching movie credits...');
            const credits = await tmdbApi.getMovieCredits(inception.id);
            console.log('Top 3 Cast Members:');
            credits.cast.slice(0, 3).forEach(actor => {
                console.log(`- ${actor.name} as ${actor.character}`);
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testTMDBAPI(); 