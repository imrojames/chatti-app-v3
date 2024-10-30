// import "/js/chatSocket.js";
window.addEventListener("load", function () {
  io.socket.get("/api/user/join", function () {
    console.log("Join onlineUser room");
  });

  // Listen for "active" broadcast
  io.socket.on("active", function (response) {
    const displayActiveUser = document.getElementById("displayActiveUser");
    const currentUserId = document.getElementById("userId").value;
    const isCurrentUser = currentUserId == response.id;
    const isYou = isCurrentUser ? " (You)" : "";

    const activeUsers = `
          <a href="/${response.fname} ${response.lname}/${response.id}" class="nav-link" id="user-${response.id}">
            <i class="far fa-circle nav-icon" style="color: green;"></i>
            <p>${response.fname} ${response.lname}${isYou}</p>
          </a>
      `;
    displayActiveUser.innerHTML += activeUsers;
  });

  // Listen for inActive user broadcast
  io.socket.on("inActive", function (response) {
    const userElement = document.getElementById(`user-${response.id}`);
    if (userElement) {
      userElement.remove();
    }
  });

  // Load all active users
  io.socket.get("/api/user/active", function (response) {
    response.forEach((data) => {
      const displayActiveUser = document.getElementById("displayActiveUser");
      const currentUserId = document.getElementById("userId").value;
      const isCurrentUser = currentUserId == data.id;
      const isYou = isCurrentUser ? " (You)" : "";

      const activeUsers = `
        <a href="/${data.fname} ${data.lname}/${data.id}" class="nav-link" id="user-${data.id}">
          <i class="far fa-circle nav-icon" style="color: green;"></i>
          <p>${data.fname} ${data.lname} ${isYou}</p>
        </a>
        `;
      displayActiveUser.innerHTML += activeUsers;
    });
  });
});

function logout(userId) {
  // First, update the user's active status in the database
  io.socket.patch(`/api/user/updateIsActive/${userId}`, function (response) {
    if (response.error) {
      console.log(response.error);
    } else {
      console.log("Successfully updated active status to false.");

      // Then, proceed with the logout and redirect
      io.socket.post("/api/user/logout", function () {
        // Inform the user has logged out and redirect to login page
        history.replaceState(null, null, "/login");
        window.location.href = "/login";
      });
    }
  });
}
