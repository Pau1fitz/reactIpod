var App = React.createClass({

	getInitialState: function(){

		return {
			active: 0,
			artists: ['Michael Jackson', 'Bob Dylan', 'Coldplay', 'Elvis Presley', 'Blur', 'Oasis'],
			songData: [],
			songs: [],
			playing: false,
			homeScreen: true,
			activeSong: 0
		}
	},

	increaseIndex: function() {
	    if(this.state.active === this.state.artists.length - 1) {
	        this.setState({active : 0});
	    }else{
	    	this.setState({active : this.state.active + 1});	
	    }
	},

	decreaseIndex: function() {
		if(this.state.active === 0) {
			this.setState({active : this.state.artists.length - 1});
		}else{
			this.setState({active : this.state.active - 1});
		}
	},

	increaseSongIndex: function() {
	    if(this.state.activeSong === 4) {
	        this.setState({activeSong : 0});
	    }else{
	    	this.setState({activeSong : this.state.activeSong + 1});	
	    }
	},

	decreaseSongIndex: function() {
		if(this.state.activeSong === 0) {
			this.setState({activeSong : 4});
		}else{
			this.setState({activeSong : this.state.activeSong - 1});
		}
	},

	getItunesData: function(){
		var self = this;
		$.ajax({
			url: 'https://itunes.apple.com/search?term=' + this.state.artists[this.state.active] + '&limit=5' ,
			method: 'GET',
			dataType: 'jsonp',
			success: function(data){
				this.setState({songData: data.results, songs: []});
				data.results.map(function(song, index){
					self.state.songs.push(song.previewUrl)
				})	
			}.bind(this)
		})
	},

	musicScreen: function(){
		this.setState({
			homeScreen: false
		})
	},

	homeScreen: function(){
		this.setState({
			homeScreen: true
		})
	},

	audio: new Audio,

	playSong: function(){
		this.setState({playing: true});
		this.audio.src = this.state.songs[this.state.activeSong];
		this.audio.play();
	},

	pauseSong: function() {
		this.audio.pause();
	},

	nextSong: function() {
		this.audio.src = this.state.songs[this.state.activeSong];
		this.audio.play();
	},

	previousSong: function() {
		this.audio.src = this.state.songs[this.state.activeSong];
		this.audio.play();
	},

	componentWillUpdate: function(nextProps, nextState) {
	  if (nextState.activeSong !== this.state.activeSong) {
	    this.audio.src = this.state.songs[nextState.activeSong];
	    this.audio.play();
	  }
	},

	render: function () {
		var screen,
			button;
		if (this.state.homeScreen === true) {
		  	screen = <ArtistList active={this.state.active} artists={this.state.artists} playing={this.state.playing} />
		  	button = <HomeButton active={this.state.active} increment={this.increaseIndex} decrement={this.decreaseIndex} pauseSong={this.pauseSong} playing={this.state.playing} musicScreen={this.musicScreen} getItunesData={this.getItunesData} />
		} else {
		  	screen = <SongList activeSong={this.state.activeSong} songData={this.state.songData} />
		  	button = <MusicListButton active={this.state.active} increment={this.increaseSongIndex} decrement={this.decreaseSongIndex} playSong={this.playSong} pauseSong={this.pauseSong} playing={this.state.playing} homeScreen={this.homeScreen} />
		}
		return(
			<div>
				<div id="screen">
					{screen}
				</div>
					{button}
			</div>
		)
	}

});

var ArtistList = React.createClass({

	render: function() {
		var self = this;
		var listItems = this.props.artists.map(function(value, index){
			return(
				<li
			    	key={value} 
			    	className={self.props.active === index ? 'active' : ''}>
			    	{value}
			  	</li>
			)
		})
		return <ul>{listItems}</ul>
	}

});

var SongList = React.createClass({

	render: function() {
		var self = this;
		var songItems = this.props.songData.map(function(song, index){
				return(
					<li key={index}
						className={self.props.activeSong === index ? 'active' : ''}>
						{song.trackCensoredName}
					</li>
				)
		})
		return <ul>{songItems}</ul>
	}
});

var HomeButton = React.createClass({

	onClick: function() {
		this.props.playSong();
	},

	getMusicAndNavigate: function() {
		this.props.getItunesData();
		this.props.musicScreen();
	},

	render: function() {
		
		return(
			<div className="button">
				<div className='menu'>MENU</div>
				
				<div className="next" onClick={this.props.increment}>
					<i className="fa fa-fast-forward" aria-hidden="true"></i>
				</div>
				
				<div className="pause">
					<i onClick={this.getMusicAndNavigate}className="fa fa-play" aria-hidden="true"></i>
					<i className="fa fa-pause" aria-hidden="true"></i>
				</div>

				<div className="prev" onClick={this.props.decrement}>
					<i className="fa fa-fast-backward" aria-hidden="true"></i>
				</div>
		    	<div onClick={this.getMusicAndNavigate} className='inner-button'></div>
		    </div>
		)
	}
});

var MusicListButton = React.createClass({

	render: function() {
		
		return(
			<div className="button">
				<div onClick={this.props.homeScreen} className='menu'>MENU</div>
				
				<div className="next" onClick={this.props.increment}>
					<i className="fa fa-fast-forward" aria-hidden="true"></i>
				</div>
				
				<div className="pause">
					<i onClick={this.props.playSong} className="fa fa-play" aria-hidden="true"></i>
					<i onClick={this.props.pauseSong} className="fa fa-pause" aria-hidden="true"></i>
				</div>

				<div className="prev" onClick={this.props.decrement}>
					<i className="fa fa-fast-backward" aria-hidden="true"></i>
				</div>
		    	<div onClick={this.props.homeScreen} className='inner-button'></div>
		    </div>
		)
	}
});

ReactDOM.render(<App/>, document.getElementById('app'));