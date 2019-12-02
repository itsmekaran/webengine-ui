import React, { Component } from "react";
import Axios from "axios";

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            websites: []
        }
        this.loadSearchResults = this.loadSearchResults.bind(this);
    }

    loadSearchResults() {
        Axios.get("/search?key="+this.state.key)
        .then(response => {
            console.log(response);
        }, error => {

        })
    }

    componentDidMount(props) {
        this.setState({
            key: (this.props.location.search.split("?")[1])
        }, () => {
            this.loadSearchResults();
        })
    }
    render() {
        return (
            <div>
                Search Results for: <b>{this.state.key}</b>
            </div>
        );
    }
}

export default SearchResults;