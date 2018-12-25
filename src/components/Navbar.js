import React from 'react';
import { connect } from 'react-redux';
import { setUserID } from '../actions';
import { Navbar, NavbarBrand, NavItem, Nav } from 'reactstrap';
import { NavLink } from 'react-router-dom';

//https://stackoverflow.com/questions/49195684/set-color-to-reactsrap-navlink
const Navigation = (props) => {

    let logout = () => {
        console.log(props.channel);
        if (props.channel) {
            props.channel.exit((response, error) => {
                if (error) console.log(error);
                console.log('exited channel via logout');
            })
        }
        props.sb.disconnect(() => {
            console.log("You are disconnected from SendBird.");
        })
        props.dispatch(setUserID(''));
    }

    var channelURL;
    if (!props.channelURL) {
        channelURL = "/chat";
    } else {
        channelURL = `chat/${props.channelURL}`;
    }

    return (
        <div className="navbar-wrapper">
            <Navbar color="light" light expand="md">
                <NavbarBrand>react.chat</NavbarBrand>
                <Nav className="ml-auto">
                    <NavItem>
                        <NavLink className="navlink" to={channelURL}>Chat</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="navlink" to='/channels'>Channels</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="navlink" to="/login" onClick={logout}>Logout</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        sb: state.sbsession.sbsession,
        channel: state.channel.channel,
        channelURL: state.channel.channelURL
    }
}


export default connect(mapStateToProps)(Navigation);