import React, { Component } from "react";
import "./App.css";

// Components
import SearchForm from './components/SearchForm';
import ArtistInfo from './components/ArtistInfo';
import ArtistSimilar from './components/ArtistSimilar';

// Material-UI
import Reboot from 'material-ui/Reboot';
import Typography from "material-ui/Typography";
import TextField from 'material-ui/TextField';
import Fade from 'material-ui/transitions/Fade';
import { CircularProgress } from 'material-ui/Progress';
import Snackbar from "material-ui/Snackbar";
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

// Google Analytics 
import ReactGA from 'react-ga';
ReactGA.initialize('UA-114293789-1');
ReactGA.pageview(window.location.pathname + window.location.search);


class App extends Component {
  constructor(props) {
    super(props);

    this.apiUrl = "https://ws.audioscrobbler.com/2.0/";
    this.apiKey = "76a26a314266bbf8e99b1ae0bb9fa348";
    this.apiFormat = "json";
    
    this.initialState = {
      isLoading: false,
      error: null,
      openSnackbar: false
    };

    this.state = {
      artist: '',
      artistCurrent: '',
      artistInfo: {},
      artistSimilar: []
    };

    Object.assign(this.state, this.initialState);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Create api url with params
   * @returns {string} - URL for api call
   */
  createApiUrl(params = {}) {
    params.api_key = this.apiKey;
    params.format = this.apiFormat;

    const paramsArr = [];

    for (let param in params) {
      paramsArr.push(
        encodeURIComponent(param) + "=" + encodeURIComponent(params[param])
      );
    }

    return this.apiUrl + "?" + paramsArr.join("&").replace(/%20/g, "+");
  }

  /**
   * https://www.last.fm/api/show/artist.search
   * @returns {Promise}
   */
  async searchArtist(artist) {
    const url = this.createApiUrl({
      artist,
      method: "artist.search"
    });

    try {
      const response = await fetch(url);
      const data = await response.json();
      const artistMatches = data.results.artistmatches.artist; // array of matches
      
      if (artistMatches.length === 0) {
        throw new Error("No matches with the artist");
      }

      let artistMatch;

      artistMatches.forEach(artist => {
        if (artist.name.toLowerCase() === this.state.artist.toLowerCase()) {
          artistMatch = artist.name;
        }
      });

      // if not 100% match, then return the first match from the array of matches
      return artistMatch ? artistMatch : artistMatches[0].name;
    } catch(error) {
      this.setState({
        error,
        openSnackbar: true
      });
      // console.log(error);
    }
  }

  /**
   * https://www.last.fm/api/show/artist.getInfo
   * @returns {Promise}
   */
  async getArtistInfo(artist) {
    const url = this.createApiUrl({
      artist,
      method: "artist.getinfo",
      autocorrect: 1, // optional
      lang: "en" // optional
    });

    try {
      const response = await fetch(url);
      const data = await response.json();
      const artist = data.artist;

      const parseSummary = (summary) => {
        return summary.replace(/\s+?<a .*?>Read more on Last\.fm<\/a>.*$/, '');
      }

      const artistInfo = {
        name: artist.name,
        url: artist.url,
        image: artist.image[3]["#text"],
        summary: parseSummary(artist.bio.summary)
      }

      return artistInfo;
    } catch (error) {
      this.setState({
        error,
        openSnackbar: true
      });
      // console.error(error);
    }
  }

  /**
   * https://www.last.fm/api/show/artist.getSimilar
   * @returns {Promise}
   */
  async getArtistSimilar(artist) {
    const url = this.createApiUrl({
      method: "artist.getsimilar",
      artist,
      autocorrect: 1, // optional
      limit: 100 // optional, TODO add method to choose limit
    });

    try {
      const response = await fetch(url);
      const data = await response.json();

      const artistSimilar = data.similarartists.artist.map(artist => {
        return {
          name: artist.name,
          url: artist.url,
          image: artist.image[2]["#text"],
          match: artist.match
        }
      });

      return artistSimilar;
    } catch (error) {
      this.setState({
        error,
        openSnackbar: true
      });
      // console.error(error);
    }
  }

  async makeRequest() {
    this.setState({
      isLoading: true
    });

    const artist = await this.searchArtist(this.state.artist);
    const artistCurrent = this.state.artistCurrent;

    // if there is no artist or it's equal to the current one, then don't do other requests
    if ( !artist || artist === artistCurrent ) {
      this.setState({ isLoading: false });
      return;
    } else {
      this.setState({ artistCurrent: artist });
    }

    ReactGA.event({
      category: 'Search Form',
      action: 'Search',
      label: 'Search ' + artist
    });
    
    const [artistInfo, artistSimilar] = await Promise.all([
      this.getArtistInfo(artist), 
      this.getArtistSimilar(artist)
    ]);
    
    this.setState({
      artistInfo,
      artistSimilar,
      isLoading: false
    });
  }

  resetState() {
    this.setState(this.initialState); // this.setState({ ...this.initialState });
  }

  handleChange(event) {
    this.setState({ artist: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.resetState();
    this.makeRequest();
  }

  handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  render() {
    const { artistCurrent, artistInfo, artistSimilar, isLoading, error, openSnackbar } = this.state;

    const isError = error ? true : false;

    const progressStyle = {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)'
    }

    return (
      <div className="bandmatch-app">
        <div className="bandmatch-app__wrap wrap">
          <Reboot />

          <Typography variant="display3" gutterBottom>
            Find your music match
          </Typography>

          <SearchForm onSubmit={this.handleSubmit}>
            <TextField
              error={isError}
              className="search-form__input"
              value={this.state.artist}
              onChange={this.handleChange}
              label="Type artist name"
              type="search"
              fullWidth
              required
            />

            {isLoading &&
            <Fade
              in={isLoading}
              style={{
                transitionDelay: isLoading ? '800ms' : '0ms',
              }}
              unmountOnExit >
              <CircularProgress style={progressStyle} />
            </Fade>
            }
          </SearchForm>

          {artistCurrent && artistInfo.name && // double check to avoid displaying an empty image
          <div className="artist">
            <ArtistInfo artistInfo={artistInfo} />
            <ArtistSimilar items={artistSimilar} />
          </div>
          }

          {openSnackbar &&
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
            SnackbarContentProps={{
              'aria-describedby': 'snackbar-message',
            }}
            message={<span id="snackbar-message">Something went wrong... Try again :)</span>}
            action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
          />}
      
        </div>
      </div>
    );
  }
}

export default App;