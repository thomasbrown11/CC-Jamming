import React from 'react';
import './Track.css';

export class Track extends
  React.Component {

  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    let actionSign;
    if (this.props.isRemoval === true) { actionSign = '-' } else { actionSign = '+' };
    return (<button className='Track-action' onClick={actionSign === '+' ? this.addTrack : this.removeTrack}>{actionSign}</button>)
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist}</p>
          <p>{this.props.track.album}</p>
        </div>
        {this.renderAction()};
      </div>
    )
  }
}

export default Track;