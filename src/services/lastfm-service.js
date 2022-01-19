export default {
    _apiBase: 'http://ws.audioscrobbler.com/2.0/',
    _apiKey: 'YOUR_API_KEY',
    _apiFormat: 'json',

    async getResource(params) {
        const qs = this._convertToQueryString({
            ...params,
            api_key: this._apiKey,
            format: this._apiFormat,
        });

        const res = await fetch(`${this._apiBase}?${qs}`);

        if ( !res.ok ) {
            throw new Error(`Could not fetch, status ${res.status}`);
        }

        return res.json();
    },

    async getArtistInfo(artist) {
        const params = {
            artist,
            method: 'artist.getInfo',
            autocorrect: 1,
            lang: 'en',
        };

        const data = await this.getResource(params);

        return this._transformArtistInfo(data.artist);
    },

    async getSimilarArtists(artist) {
        const params = {
            artist,
            method: 'artist.getSimilar',
            autocorrect: 1,
            limit: 100,
        };

        const data = await this.getResource(params);

        return this._transformSimilarArtists(data.similarartists.artist);
    },

    async searchArtist(artist) {
        const params = {
            artist,
            method: 'artist.search',
        };

        const data = await this.getResource(params);

        return this._transformArtistMatches(data.results.artistmatches.artist);
    },

    _transformArtistInfo(artist) {
        return {
            name: artist.name,
            summary: artist.bio.summary,
            tags: this._transformTags(artist.tags.tag)
        };
    },

    _transformSimilarArtists(similarArtists) {
        return similarArtists.map(artist => ({
            name: artist.name,
            match: this._convertMatch(artist.match),
            url: artist.url
        }))
    },

    _transformArtistMatches(artistMatches) {
        return artistMatches.map(artist => artist.name);
    },

    _transformTags(tags) {
        return tags.map(tag => tag.name);
    },

    _convertMatch(match) {
        return Math.round(parseFloat(match) * 100) + '%';
    },

    _convertToQueryString(params) {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    },
};
