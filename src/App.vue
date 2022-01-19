<template>
    <div class="main-layout">
        <div class="main-layout__wrap">
            <heading text="Find your music match"></heading>
            <search-form @form-submit="onSearchFormSubmit"></search-form>
            <artist-info v-if="isArtistInfo" v-bind="artistInfo"></artist-info>
            <similar-artists v-if="isSimilarArtists" :artists="similarArtists"></similar-artists>
        </div>
    </div>
</template>

<script>
import Heading from './components/Heading.vue';
import SearchForm from './components/SearchForm.vue';
import ArtistInfo from './components/ArtistInfo.vue';
import SimilarArtists from './components/SimilarArtists.vue';

export default {

    components: {
        Heading,
        SearchForm,
        ArtistInfo,
        SimilarArtists,
    },

    data() {
        return {
            currentArtist: null,
            artistInfo: {},
            similarArtists: [],
        };
    },

    computed: {
        isArtistInfo() {
            return Object.keys(this.artistInfo).length > 0;
        },

        isSimilarArtists() {
            return this.similarArtists.length > 0;
        },
    },

    methods: {
        async onSearchFormSubmit(artist) {
            const artistMatch = await this.searchArtist(artist);

            if ( !artistMatch || artistMatch === this.currentArtist ) {
                return;
            }

            this.currentArtist = artistMatch;

            try {
                const [artistInfo, similarArtists] = await Promise.all([
                    await this.$lastfmService.getArtistInfo(this.currentArtist),
                    await this.$lastfmService.getSimilarArtists(this.currentArtist)
                ]);

                this.artistInfo = artistInfo;
                this.similarArtists = similarArtists;
            } catch(e) {
                console.error(e);
            }
        },

        async searchArtist(artist) {
            try {
                const artistMatches = await this.$lastfmService.searchArtist(artist);

                if ( artistMatches.length === 0 ) {
                    throw new Error('No matches with artist.');
                }

                const artistMatch = artistMatches.find(item => item.toLowerCase() === artist.toLowerCase());

                return artistMatch ? artistMatch : artistMatches[0];
            } catch(e) {
                console.error(e);
            }
        },
    },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

html {
    font-size: .625em;
    box-sizing: border-box;
    text-size-adjust: 100%;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
    box-sizing: inherit;
}

body {
    font-family: 'Roboto', sans-serif;
    font-size: 1.6rem;
    color: rgba(0, 0, 0, 0.87);
    line-height: normal;
    background: #fafafa;
    min-height: 100vh;
    overflow-x: hidden;
    margin: 0;
}

.main-layout {
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 50px;
    
    &__wrap {
        max-widtH: 74rem;
        padding: 0 20px;
        margin: 0 auto;
    }
}

@media only screen and (max-width: 600px) {
    .main-layout {
        padding-top: 50px;
    }
}
</style>
