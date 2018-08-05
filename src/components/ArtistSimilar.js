import React from "react";
import Avatar from 'material-ui/Avatar';
import ImageIcon from 'material-ui-icons/Image';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText } from 'material-ui/List';

const ArtistSimilarItem = props => {
  const {image, name, match, url} = props;

  const { listItemStyle, avatarStyle, imageIconStyle, linkStyle } = {
    listItemStyle: {
      paddingLeft: 0,
      paddingRight: 0
    },

    avatarStyle: {
      width: '100px',
      height: '100px',
      pointerEvents: 'none'
    },

    imageIconStyle: {
      width: '50px',
      height: '50px'
    },

    linkStyle: {
      borderRadius: '50%',
      outline: 'none'
    },
  }

  const showPercentageMatch = match => {
    return Math.round(parseFloat(match) * 100) + '%';
  }

  return (
    <ListItem className="artist-similar__item" component="div" style={listItemStyle} >
      <a className="artist-similar__link" href={url} target="_blank" style={linkStyle}>
        <Avatar className="artist-similar__image" src={image} alt={name} style={avatarStyle} >
          {!image &&
            <ImageIcon style={imageIconStyle} />
          }
        </Avatar>
      </a>
      <ListItemText primary={name} secondary={'Match ' + showPercentageMatch(match)} />
    </ListItem>
  );
};

const ArtistSimilar = props => {
  const { listStyle, dividerStyle } = {
    listStyle: {
      paddingTop: '16px',
      paddingBottom: '16px'
    },

    dividerStyle: {
      marginLeft: '116px'
    }
  };

  return (
    <div className="artist-similar">
      <div className="artist-similar__wrap">
        <List className="artist-similar__list" component="div" style={listStyle}>
          {props.items.map( (item, index, arr) => {
            let lastItem = arr.length - 1;

            return (
              <div className="artist-similar__list-item" key={item.name}>
                <ArtistSimilarItem {...item} />

                {index !== lastItem &&
                  <Divider className="artist-similar__divider" inset component="div" style={dividerStyle} />
                }
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
};

export default ArtistSimilar;