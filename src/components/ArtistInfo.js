import React from "react";
import Avatar from 'material-ui/Avatar';
import ImageIcon from 'material-ui-icons/Image';
import Typography from "material-ui/Typography";

const ArtistInfo = props => {
  const {image, name, summary, url} = props.artistInfo;

  const { avatarStyle, imageIconStyle, linkStyle, wrapStyle, headlineMapping } = {
    avatarStyle: {
      width: '280px',
      height: '280px',
      pointerEvents: 'none'
    },

    imageIconStyle: {
      width: '140px',
      height: '140px'
    },

    wrapStyle: {
      display: 'flex',
      flexDirection: 'column',
    },

    linkStyle: {
      alignSelf: 'center',
      marginBottom: '20px',
      borderRadius: '50%',
      outline: 'none'
    },

    headlineMapping: {
      headline: 'h3'
    }
  };
  
  return (
    <div className="artist-info">
      <div className="artist-info__wrap" style={wrapStyle}>
        <a className="artist-info__link" href={url} target="_blank" style={linkStyle}>
          <Avatar className="artist-info__image" src={image} alt={name} style={avatarStyle}>
            {!image &&
              <ImageIcon style={imageIconStyle} />
            }
          </Avatar>
        </a>
        <div className="artist-info__name">
          <Typography align="center" variant="headline" headlineMapping={headlineMapping} gutterBottom>
            {name}
          </Typography>
        </div>
        <div className="artist-info__summary">
          <Typography align="left" paragraph>
            {summary}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;