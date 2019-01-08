import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { login } from '../api/sb_api';

const styles = {
    root: {
        height: '100vh',
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            loading: false
        }
    }

    handleChange = (event) => {
        this.setState({ username: event.target.value })
    }

    // ------------------------ BEGIN TEMP CODE --------------------------- // 
    async componentDidMount() {
        await login('test');
        this.props.history.push('/channels');
    };
    // ------------------------ END TEMP CODE ----------------------------- // 

    handleClick = async () => {
        if (!this.state.username) return;
        await login(this.state.username);
        this.props.history.push('/channels');
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid
                container
                className={classes.root}
                direction="column"
                justify="center"
                alignItems="center"
            >
                <TextField
                    placeholder="Enter a username"
                    margin="normal"
                    label="Username"
                    InputLabelProps={{ shrink: true, }}
                    value={this.state.username}
                    onChange={this.handleChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClick}>
                    Submit
                </Button>
            </Grid>
        )
    };
};

export default withStyles(styles)(Login);
