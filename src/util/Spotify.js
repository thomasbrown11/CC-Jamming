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

    }
  }
}

export default Spotify;