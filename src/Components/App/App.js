import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends
  React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        { name: 'name1', artist: 'artist1', album: 'album1', id: 1 },
        { name: 'name2', artist: 'artist2', album: 'album2', id: 2 },
        { name: 'name3', artist: 'artist3', album: 'album3', id: 3 }
      ],
      playlistName: 'Test Playlist',
      playlistTracks: [
        { name: 'playlist-name1', artist: 'playlist-artist1', album: 'playlist-album1', id: 4 },
        { name: 'playlist-name2', artist: 'playlist-artist2', album: 'playlist-album2', id: 5 },
        { name: 'playlist-name3', artist: 'playlist-artist3', album: 'playlist-album3', id: 6 }
      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  //this may be non-functional.. test it though as no flaw in logic present. May need to just get rid of the else statement.
  //ideally this will do nothing if there's an id match (ie find returns an actual value equating to truthy if it does)
  //the else is the actual execution if there isn't a match. Without the else addTrack will always fire a setState, which may be necessary?
  addTrack(track) {
    if (
      this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id
      )) {
      return;
    } else {
      this.state.playlistTracks.push(track);
      this.setState({ playlistTracks: this.state.playlistTracks })
    }
  }

  removeTrack(track) {
    let updatedPlaylist = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: updatedPlaylist })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
