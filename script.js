// we'll have a modular structure of our app
// 1. APIController --> 
// 2. UIController --> 
// 3. InterfaceController --> to control both controllers and establish a link between them



// APIController
const APIController = (function() {
    const clientId = 'a3b7c318b5164166bc63903b587e274d';
    const clientSecret = 'ada6f4c68ee446089c2753c7c77c028a';

    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    };

    const _getGenres = async (token) => {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await result.json();
        return data.categories.items;
    };

    const _getPlaylistByGenres = async (token, genreId) => {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await result.json();
        return data.playlists.items;
    };

    const _getTracks = async (token, tracksEndpoint) => {
        const limit = 10;
        const result = await fetch(`${tracksEndpoint}?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await result.json();
        return data.items;
    };

    const _getTrack = async (token, trackEndpoint) => {
        const result = await fetch(`${trackEndpoint}`, { 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await result.json();
        return data;
    };

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenres(token, genreId) {
            return _getPlaylistByGenres(token, genreId);
        },
        getTracks(token, tracksEndpoint) {
            return _getTracks(token, tracksEndpoint);
        },
        getTrack(token, trackEndpoint) {
            return _getTrack(token, trackEndpoint);
        }
    };
})();

// UIController
const UIController = (function() {
    const DOMElements = {
        selectGenre: '#dropdown_1',
        selectPlaylist: '#dropdown_2',
        buttonSubmit: '#submitBtn',
        divSongDetail: '#song_details',
        hfToken: '#hidden_token',
        divSongList: '#item_list',
    };

    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                songs: document.querySelector(DOMElements.divSongList),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            };
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        createTrack(id, name) {
            const html = `<a href="#" id="${id}">${name}</a><br>`;
            document.querySelector(DOMElements.divSongList).insertAdjacentHTML('beforeend', html);
        },

        createSongDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = '';
            // debugging
            console.log("hello world")
            const html = `
                <div class="row col">
                    <img src="${img}" alt=""/>
                </div>
                <div class="row col">
                    <label for="title" class="form-label col">${title}</label>
                </div>
                <div class="row col">
                    <label for="artist" class="form-label col">${artist}</label>
                </div>
            `;
            detailDiv.insertAdjacentHTML('beforeend', html);
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().songs.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            };
        },
        addSongClickEvent(handler) {
            const songs = document.querySelectorAll(`${DOMElements.divSongList} a`);
            songs.forEach(song => {
                song.addEventListener('click', (e) => {
                    e.preventDefault();
                    handler(song.id);
                });
            });
        }
    };
})();

// APPController
const APPController = (function(UICntrl, APICntrl) {
    const DOMInputs = UICntrl.inputField();

    const loadGenres = async () => {
        const token = await APICntrl.getToken();
        UICntrl.storeToken(token);
        const genres = await APICntrl.getGenres(token);
        genres.forEach(element => UICntrl.createGenre(element.name, element.id));
    };

     const loadTracks = async (token, tracksEndpoint) => {
        const tracks = await APICntrl.getTracks(token, tracksEndpoint);
        tracks.forEach(track => UICntrl.createTrack(track.track.id, track.track.name));
        UICntrl.addSongClickEvent(showSongDetail);
    };

    const showSongDetail = async (trackId) => {
        const token = UICntrl.getStoredToken().token;
        const trackEndpoint = `https://api.spotify.com/v1/tracks/${trackId}`;
        const track = await APICntrl.getTrack(token, trackEndpoint);
        UICntrl.createSongDetail(track.album.images[0].url, track.name, track.artists[0].name);
    };

    DOMInputs.genre.addEventListener('change', async () => {
        UICntrl.resetPlaylist();
        const token = UICntrl.getStoredToken().token;
        const genreSelect = UICntrl.inputField().genre;
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        const playlists = await APICntrl.getPlaylistByGenres(token, genreId);
        playlists.forEach(playlist => UICntrl.createPlaylist(playlist.name, playlist.id));
    });

    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        UICntrl.resetTracks();
        const token = UICntrl.getStoredToken().token;
        const playlistSelect = UICntrl.inputField().playlist;
        const playlistId = playlistSelect.options[playlistSelect.selectedIndex].value;
        const tracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        await loadTracks(token, tracksEndpoint);
    });

    return {
        init() {
            loadGenres();
        }
    };
})(UIController, APIController);

APPController.init();
