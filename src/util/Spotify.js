import SearchBar from "../Components/SearchBar/SearchBar";

const clientID = '7e08557df599412a819c6c54aae2fb33';
const redirectURI = 'http://localhost:3000/';

const accessToken = '';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }
    //check for access token match 
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    //if accessToken and expiration exists in current URL 
    if (accessTokenMatch && expiresInMatch) {
      //set accessToken to URL match
      accessToken = accessTokenMatch[1];
      //set variable for expiration equal to a number taken from URL string 
      const expiresIn = Number(expiresInMatch[1]);
      //set access token expiration
      window.setTimeout(() => { accessToken = '', expiresIn * 1000 });
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
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`)
  }
}

export default Spotify;