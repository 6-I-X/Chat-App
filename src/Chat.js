import React, { useEffect } from 'react';
import { useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, name, room }) {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState([]);

	const sendMessage = async () => {
		if (currentMessage !== '') {
			const messageData = {
				room: room,
				author: name,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					new Date(Date.now()).getMinutes(),
			};

			await socket.emit('sendMessage', messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage('');
		}
	};

	useEffect(() => {
		socket.on('recieveMessage', (data) => {
			setMessageList((list) => [...list, data]);
		});
	}, [socket]);

	return (
		<div className="chatWindow">
			<div className="chatHeader">
				<p>Live Chat</p>
			</div>
			<div className="chatBody">
				<ScrollToBottom className="messageContainer">
					{messageList.map((messageContent) => {
						return (
							<div
								className="message"
								id={name === messageContent.author ? 'you' : 'other'}
							>
								<div>
									<div className="messageText">
										<p>{messageContent.message}</p>
									</div>
									<div className="messageMeta">
										<p id="time">{messageContent.time}</p>
										<p id="author">{messageContent.author}</p>
									</div>
								</div>
							</div>
						);
					})}
				</ScrollToBottom>
			</div>
			<div className="chatFooter">
				<input
					type="text"
					value={currentMessage}
					placeholder="Type a message..."
					onChange={(event) => {
						setCurrentMessage(event.target.value);
					}}
					onKeyPress={(event) => {
						event.key === 'Enter' && sendMessage();
					}}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
}

export default Chat;
