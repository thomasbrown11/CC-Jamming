//import SearchBar from "../Components/SearchBar/SearchBar";

const clientID = '7e08557df599412a819c6c54aae2fb33';
const redirectURI = 'http://localhost:3000/';

let accessToken = '';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }
    //check for access token match 
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    //if accessToken and expiration exists in current URL 
    if (accessTokenMatch && expiresInMatch) {
      //set accessToken to URL match
      accessToken = accessTokenMatch[1];
      //set variable for expiration equal to a number taken from URL string 
      const expiresIn = Number(expiresInMatch[1]);
      //set access token expiration
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      //clear URL parameters so that a new accessToken can be grabbed upon expiration 
      window.history.pushState('Access Token', null, '/');
      return accessToken;

    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken;
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.track) {
        return [];
      } else {
        return jsonResponse.tracks.item.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        })
        );
      }
    })
  },

  savePlaylist(playlist, uriArray) {
    if (!playlist || uriArray) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${accessToken}` }
    const userID = '';

    return fetch('https://api.spotify.com/v1/me', { headers: header })
  }
}

export default Spotify;