//import SearchBar from "../Components/SearchBar/SearchBar";

const clientID = '7e08557df599412a819c6c54aae2fb33';
const redirectURI = 'http://CCjammm.surge.sh';

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
    //call getAccessToken for valid token, new variable here to use within this method specifically
    const accessToken = Spotify.getAccessToken();
    //proper HTTP request detailed by Spotify leveraging fetch promise. 
    //headers is an optional custom add-on which provides authorization
    //this is the actual search query. 
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
      //grab response from the GET request and convert to JSON for usability. 
    }).then(response => {
      return response.json();
      //grab the new JSON object. If track isn't present return empty array, otherwise map a new properly formatted object
    }).then(jsonResponse => {
      //4/13 changed jsonResponse.track to jsonResponse.tracks 
      if (!jsonResponse.tracks) {
        return [];
      } else {
        //4/13 changes jsonResponse.tracks.item.map to jsonReponse.tracks.items.map
        return jsonResponse.tracks.items.map(track => ({
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
    //failsafe, require these parameters are entered checking for the absence of playlist or uriArray 
    //these arguments are pulled from React components within App and are dependent on correct App state changes from Spotify.search()
    if (!playlist || !uriArray) {
      return;
    }
    //leverage above method to get valid token
    const accessToken = Spotify.getAccessToken();
    //set header properly as we'll be using this on all HTTP request to validate
    const header = { Authorization: `Bearer ${accessToken}` }
    //to be filled in by first HTTP (GET) Request's response
    let userID;
    //return a GET request (endpoint provided by spotify), validate with header
    //this specific request is to get a userID to work in a specific account
    return fetch('https://api.spotify.com/v1/me', { headers: header }
      //format reponse to JSON object
    ).then(response => response.json()
      //set userID to parameter in json object
    ).then(jsonResponse => {
      userID = jsonResponse.id;
      //within this return make POST request. This specific endpoint maps to requesting a new playlist be created in user account
      //the body parameter within fetch argument object will name the new 
      //playlist initiated by POST whatever is passed in to savePlaylist().
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: header,
        method: 'POST',
        //must be converted to proper jason string to be read by request 
        body: JSON.stringify({ name: playlist })
        //convert response from the playlist POST request to JSON object 
      }).then(response => response.json()
        //pull id from new JSON response object and assign to the playlistID (URI)
      ).then(jsonResponse => {
        //pull playlistID for next POST request 
        const playlistID = jsonResponse.id;
        //This endpoint is a POST that updates an existing playlist (made in previous POST)
        //by pulling URIs from an array to tell Spotify API to build the list. 201 response if correct returning same playlistID value;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: header,
          method: 'POST',
          body: JSON.stringify({ uris: uriArray })
        })
      })
    })
  }
}

export default Spotify;