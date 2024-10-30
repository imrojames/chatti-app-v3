window.addEventListener("load", function () {
  // =============Chat socket========================
  // Join a chat with another user (user2 in this case)
  const userId2 = document.getElementById("userId2").value;
  const roomIdField = document.getElementById("roomId");

  io.socket.get(`/api/chat/startChat/${userId2}`, function (response) {
    roomIdField.value = response.message;
    loadMessagesForRoom(response.message);
    console.log("Join private message: ", response.message);
  });

  // Scroll to the bottom after loading all messages
  function scrollToBottom() {
    const chatContainer = document.getElementById("directMessage");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Listen to the new message from the other user in the private room
  const currentUserId = document.getElementById("curentUserId").value;
  io.socket.on("privateMessage", function (data) {
    const directMessage = document.getElementById("directMessage");
    const isCurrentUser = data.userId == currentUserId;
    const alignClass = isCurrentUser ? "right" : "left";
    const isYou = isCurrentUser ? "(You)" : "";

    const senderMessage = `
          <div class="direct-chat-msg ${alignClass}">
            <div class="direct-chat-infos clearfix">
              <span class="direct-chat-name float-${alignClass}" id="senderName">${data.userName}${isYou}</span>
               <!--<span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>-->
            </div>
            <!-- /.direct-chat-infos -->
            <img class="direct-chat-img" src="/dist/img/user3-128x128.jpg" alt="message user image">
            <!-- /.direct-chat-img -->
            <div class="direct-chat-text" id="senderMessage">
              ${data.message}
            </div>
            <!-- /.direct-chat-text -->
          </div>
        `;
    directMessage.innerHTML += senderMessage;
    console.log("New Message recieved: ", data.message);

    // Scroll to the bottom after loading all messages
    scrollToBottom();
  });

  // Load all messages from this room
  function loadMessagesForRoom(roomId) {
    io.socket.get(`/api/chat/messages/${roomId}`, function (response) {
      console.log(`roomId: ${roomId}`);
      response.forEach((messages) => {
        const directMessage = document.getElementById("directMessage");
        const isCurrentUser = messages.user.id == currentUserId;
        const alignClass = isCurrentUser ? "right" : "left";
        const isYou = isCurrentUser ? "(You)" : "";

        const senderMessage = `
              <div class="direct-chat-msg ${alignClass}">
                <div class="direct-chat-infos clearfix">
                  <span class="direct-chat-name float-${alignClass}">${messages.user.fname} ${messages.user.lname} ${isYou}</span>
                   <!--<span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>-->
                </div>
                <!-- /.direct-chat-infos -->
                <img class="direct-chat-img" src="/dist/img/user3-128x128.jpg" alt="message user image">
                <!-- /.direct-chat-img -->
                <div class="direct-chat-text">
                  ${messages.message}
                </div>
                <!-- /.direct-chat-text -->
              </div>
            `;
        directMessage.innerHTML += senderMessage;
        console.log("New Message recieved2: ", messages.message);

        // Scroll to the bottom after loading all messages
        scrollToBottom();
      });
    });
  }

  // Send Message
  document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // const userId2 = document.getElementById('userId2').value;
    const message = document.getElementById("messageField").value;
    const roomKey = document.getElementById("roomId").value;
    console.log(`testID: ${roomId}`);

    io.socket.post(
      "/api/chat/sendMessage",
      { message: message, roomKey: roomKey },
      function (response, jwRes) {
        if (jwRes.statusCode === 200) {
          document.getElementById("messageField").value = ""; // Clear input after sending
        }

        console.log(response);
      }
    );
  });
});
