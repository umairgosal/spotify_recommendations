// we'll have a modular structure of our app
// 1. APIController --> 
// 2. UIController --> 
// 3. InterfaceController --> to control both controllers and establish a link between them



const APIController = (function() {

    const clientId = 'a3b7c318b5164166bc63903b587e274d';
    const clientSecret = 'ada6f4c68ee446089c2753c7c77c028a';

    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: POST,
            headers: {
                'content-type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type = client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async(token) => {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            method: GET,
            headers: {
                'Authorization' : 'Bearer' + token
            }
        });
        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenres = async(token, genreId) => {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: GET,
            headers: {
                'Authorization' : 'Bearer' + token
            }
        });
        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async(token, tracksEndpoint) => {
        const limit = 10;
        const result = await fetch(`${tracksEndpoint}?limit=${limit}`, {
            method: GET,
            headers: {
                'Authorization' : 'Bearer' + token
            }
        });
        const data = await result.json();
        return data.items;
    }

    const _getTrack = async(token, trackEndpoint) => {
        const result = await fetch(`${trackEndpoint}`, { 
        method: GET,
        headers: {
            'Authorization' : 'Bearer' + token
        }
    });
        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres() {
            return _getGenres(token);
        },
        getPlaylistByGenres() {
            return _getPlaylistByGenres(token, genreId);
        },
        getTracks() {
            return _getTracks(token, tracksEndpoint);
        },
        getTrack() {
            return _getTrack(token, trackEndpointk);
        }

    }

})();



//UI Module

const UIController = (function() {



})(); 