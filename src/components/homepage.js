import React, { Component } from 'react';
import { Container, TextField, Button, Typography } from '@material-ui/core';

class HomePage extends Component {

    render() {
        return (
            <Container>
                <Typography variant="h1" component="h2">
                    UWindsor Search
                </Typography>
                <TextField id="standard-basic" label="Enter search" />
                <Button variant="contained">Search</Button>
            </Container>
        )
    }
}

export default HomePage;