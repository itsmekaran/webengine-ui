import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { debounce, isString, isObject, isEmpty, sortBy, replace } from "lodash";
import Axios from "axios";
import { Redirect } from 'react-router-dom';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            searchKey: "",
            showSuggestions: false,
            suggestions: [],
            searchClicked: false
        }
        this.handleInput = this.handleInput.bind(this);
        this.debouncedFunction = debounce(this.debouncedFunction, 1000);
        this.createInputText = this.createInputText.bind(this);
        this.showSuggestions = this.showSuggestions.bind(this);
        this.renderSearchRedirect = this.renderSearchRedirect.bind(this);
        this.gotoSearch = this.gotoSearch.bind(this);
    }

    renderSearchRedirect = () => {
      if (this.state.searchClicked) {
        const data = this.state.searchKey;
        const url = "/search"+"?k="+data;
        return <Redirect to={url} />
      }
    }

    gotoSearch() {
      this.setState({
        searchClicked: true
      })
    }

    handleInput = (name) => (event) => {
        let value = event.currentTarget.textContent;
        this.setState({
            searchKey: value
        }, () => {
            this.checkSuggestion(this.state.searchKey.trim());
        })
    }
    showSuggestions(event) {
      const key =  event.target.textContent;
      const color = event.target.style.color;
      if (color === 'red') {
        console.log(this.state);
        this.setState({
          showSuggestions: true
        })
      }
    }

    debouncedFunction = (value) => { 
        Axios.get("http://localhost:8083/getsuggestions?key="+value)
        .then( response => {
          let data = response.data.result;
          let userInput = value;
          if (isString(data)) {
            // matches make it green
            this.inputRef.current.innerHTML = this.createInputText(this.state.searchKey, userInput, 'black');
            this.inputRef.current.focus();
            this.setState({
              showSuggestions: false
            })
          } else if (isObject(data) && !isEmpty(data)) {
            // does not match and make it red
            let map = sortBy(data, ['distance']);
            this.setState({
              suggestions: map
            }, () => {
              this.inputRef.current.innerHTML = this.createInputText(this.state.searchKey, userInput, 'red');
              // let range = document.createRange();
              // let sel = window.getSelection();
              // range.setStart(this.inputRef.current.childNodes[0], this.state.searchKey.length);
              // range.collapse(true);
              // sel.removeAllRanges();
              // sel.addRange(range);
              this.inputRef.current.focus();
            });
          }
        }, (error) => {});
    }

    createInputText(text, searchedKey, color) {
      text = replace(text, searchedKey, `<span style="color: ${color}">${searchedKey}</span>`);
      return text;
    }

    checkSuggestion(value) {
        if(value) {
            let lastWord = value.split(" ")[value.split(" ").length-1];
            this.debouncedFunction(lastWord.trim());
        }
    }

  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={6}>
          <Typography variant="h1" component="h2">
            LookUp
          </Typography>
          <div contentEditable="true" onClick={this.showSuggestions} ref={this.inputRef} onInput={this.handleInput('searchKey')} style={{textAlign:"left", width:"200px", display:"inline-block", border: "1px solid blue"}} suppressContentEditableWarning={true}></div>
          <Button onClick={this.gotoSearch} variant="contained">Search</Button>
          {this.renderSearchRedirect()}
          {this.state.showSuggestions?<div style={{textAlign:"left", width:"200px", border: "1px solid gray"}}>
            Suggestions are: 
            {this.state.suggestions.map((suggestion, index) => <div key={index}>{suggestion.word}</div>)}
          </div>: ''}
        </Grid>
      </Grid>
    );
  }
}

export default HomePage;
