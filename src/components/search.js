import React, { Component } from "react";
import { orderBy } from "lodash";
import {
  Card,
  CardContent,
  Typography,
  Link
} from "@material-ui/core";
import Axios from "axios";

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      websites: [],
      time: ""
    };
    this.loadSearchResults = this.loadSearchResults.bind(this);
  }

  loadSearchResults() {
    const startTime = Date.now();
    Axios.get("http://localhost:8083/search?key=" + this.state.key).then(
      response => {
        const totalTime = Date.now() - startTime;
        this.setState({
          time: Math.abs(totalTime) + " milliseconds"
        });
        const sortedWebsitesData = orderBy(
          response.data.result,
          ["count"],
          ["desc"]
        );
        console.log(sortedWebsitesData);
        this.setState({
          websites: sortedWebsitesData
        });
      },
      error => {}
    );
  }

    preventDefault = event => {
        event.preventDefault();
    }

  componentDidMount(props) {
    this.setState(
      {
        key: this.props.location.search.split("?")[1].split("=")[1]
      },
      () => {
        this.loadSearchResults();
      }
    );
  }
  render() {
    return (
      <div>
        Search Results for: <b>{this.state.key}</b> <br />
        About {this.state.websites.length} results ({this.state.time})
        <div>
          {this.state.websites.length > 0 ? (
            <>
              {this.state.websites.map(function(website, index) {
                return (
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {index}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {website.name}
                      </Typography>
                      <Typography color="textSecondary">
                        <Link href={website.url}>
                          Link
                        </Link>
                      </Typography>
                      <Typography color="textSecondary">
                        Frequency: {website.count}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          ) : (
            "No Results found"
          )}
        </div>
      </div>
    );
  }
}

export default SearchResults;
