import React from 'react';
import { connect } from 'react-redux';
import { setOpenChannel, clearOpenChannel, addMessage, clearMessages, clearChannelURL } from '../../actions'
import Participants from './Participants';
import CreateMessage from './CreateMessage';
import DisplayMessages from './DisplayMessages';
import { Button } from 'reactstrap';

class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            participants: '',
            loading: true
        }
    }

    updateParticipantList = (channel) => {
        let participantListQuery = channel.createParticipantListQuery();
        participantListQuery.next((participantList, error) => {
            if (error) return console.log(error);
            // Create an array of userId's to pass to Participants child component
            let list = [];
            participantList.map((participant) => {
                list.push(participant.userId);
            })
            this.setState({ participants: list })
        })
    }

    async componentDidMount() {
        let channelURL = this.props.match.params.channelurl; 
        try {
            await (() => {
                return new Promise(resolve => {
                    this.props.sb.OpenChannel.getChannel(channelURL, (channel, error) => {
                        if (error) return console.log(error);
                        channel.enter((response, error) => {
                            if (error) return console.log(error);
                            // Set state to the channel object to use channel methods
                            this.props.dispatch(setOpenChannel(channel));
                            resolve(this.props.channel);
                        })
                    })
                })
            })();
            this.setState({ loading: false })
            this.updateParticipantList(this.props.channel);

            /* ------ EVENT HANDLERS ------
            https://docs.sendbird.com/javascript/event_handler#3_channel_handler
            Need to change the UNIQUE_ID for the addChannelHandler. UserID + channelID + someNumber*/
            var ChannelHandler = new this.props.sb.ChannelHandler();
            this.props.sb.addChannelHandler(`${this.props.userid}${this.props.channel}`, ChannelHandler);
            this.setState({ channelHandler: ChannelHandler })

            ChannelHandler.onUserEntered = (openChannel, user) => {
                this.updateParticipantList(this.props.channel);
            }

            ChannelHandler.onUserExited = (openChannel, user) => {
                this.updateParticipantList(this.props.channel)
            }

            ChannelHandler.onMessageReceived = (channel, message) => {
                this.props.dispatch(addMessage(`${message._sender.userId}: ${message.message}`))
            }
        } catch (err) {
            console.log(err);
        }

        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            this.props.channel.exit((response, error) => {
                if (error) return;
            })
        })
    }

    handleClick = () => {
        this.props.dispatch(clearMessages());
        this.props.dispatch(clearChannelURL());
        this.props.channel.exit((response, error) => {
            if (error) return;
        })
        this.props.dispatch(clearOpenChannel());
        this.props.history.push('/channels');
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        return (
            <div className='Chat-Wrapper' >
                <Participants participants={this.state.participants} />
                <DisplayMessages messages={this.props.messages} />
                <CreateMessage channel={this.props.channel} />
                <div>
                    <p>Channel: {this.props.channel.name}</p>
                    <Button size="sm" onClick={this.handleClick}>Leave Channel</Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        sb: state.sbsession.sbsession,
        userid: state.userinfo.userid,
        channel: state.channel.openChannel, //currently only accepts openChannels
        messages: state.messages, 
        channelURL: state.channel.channelURL
    }
}

export default connect(mapStateToProps)(Chat);

