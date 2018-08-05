import React from "react";

const SearchForm = props => {
  const searchFormStyle = {
    paddingBottom: '60px',
    marginBottom: '20px',
    position: 'relative'
  };

  return (
    <div className="search-form" style={searchFormStyle}>
      <div className="search-form__wrap">
        <form className="search-form__form" onSubmit={props.onSubmit}>
            {props.children}
          </form>
      </div>
     </div>
  );
}

export default SearchForm;