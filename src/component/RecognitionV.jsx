import React, { Component } from 'react'
import VoiceRecognition from '../lib/js/VoiceRecognition'

export default class RecognitionV extends Component {
	constructor (props) {
    super(props)
    this.state = {
    	start: false,
    	stop: false,
      icon: 'microphone'
    }
  }

  microphoneBtnClick() {
    console.log(this.state.icon)
  	if (this.state.start === false) {
  		this.setState({
  			start: true,
        icon: 'pause'
  		})
  	} else {
  		this.setState({
  			end: true,
        icon: 'microphone'
  		})
  	}
  }

  onEnd() {
    this.setState({ start: false, stop: false})
    //this.props.action('end')()
  }

  onResult({ finalTranscript }) {
    //const result = finalTranscript

    this.setState({ start: false})
    this.props.voiceResult(finalTranscript);
    //this.props.action('result')(finalTranscript)
  }

  onStart() {
  	console.log("Voice Start")
  }

  render () {
    return (
      <div className="speech-container">
      	<a onClick={this.microphoneBtnClick.bind(this)} className="waves-effect waves-light speech-button"><i className={`fa fa-${this.state.icon} fa-5x icon`}></i></a>

        {this.state.start && (
          <VoiceRecognition
            onStart={this.onStart}
            onEnd={this.onEnd.bind(this)}
            onResult={this.onResult.bind(this)}
            continuous={true}
            lang="en-US"
            stop={this.onEnd.bind(this)}
          />
        )}
      </div>
    )
  }
}