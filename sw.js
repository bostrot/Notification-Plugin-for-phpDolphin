
//======================================================================\\
// Notifications - Plugin           			                        \\
// Copyright © Eric Trenkel - Bostrot. All rights reserved.			    \\
//----------------------------------------------------------------------\\
// https://www.bostrot.pro/         	     	                        \\
//======================================================================\\

var logoLoc = "/themes/dolphin/images/logo.png"; // Change this to your relative logo location

// Here we get our user token which is transmitted over the url (local only!)
var url = self.location.href;
token_id = url.split('?')[1];
var url0 = url.split('/plugins')[0];

// This is a simple function that turns the fetch response into text
function text(response) {
    return response.text();
}

// This is the function that checks if there are any new notifications
function checkNewChromeNotifications(x) {
    fetch(url0 + "/requests/check_notifications.php", {
        credentials: 'include',
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: "for=1&token_id="+token_id
      })
      .then(text)
      .then(function (data) {
        var dataJSON = JSON.parse(data);
        if(token_id !== undefined && data.indexOf("No notifications") == -1 && data !== "" && data !== "0") {
            if(dataJSON.response.global > 0) {
                getNotificationGlobal();
            }
            if(dataJSON.response.friends > 0) {
                getNotificationFriend();
            }
            if(dataJSON.response.messages > 0) {
                getNotificationText();
            }
        }
        stopNotifications = setTimeout(checkNewChromeNotifications, 10000);
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
notificationState = true;
};

// This is the notification response variable, which is undefined until the user gets a notification
// where a friend request can be accepted/denied. It has 3 variables saved. See more at freinds()
var n; 

// This function fires up a notification
function notifyMe(title, body, img, action) {
    if (title !== undefined && body !== undefined && img !== undefined && action === 0) {
        registration.showNotification(title, {
            badge: url0 + logoLoc,
            body: body,
            icon: img,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: 'Test_Network'
        });
    } else if (title !== undefined && body !== undefined && img !== undefined && action !== 1) {
        registration.showNotification(title, {
            badge: url0 + logoLoc,
            actions: [  
                {action: 'accept', title: 'Accept'},  
                {action: 'decline', title: 'Decline'}],
            body: body,
            icon: img,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: 'Test_Network'
        });
    }
}
notifyMe();

// If there is a notification status, fetch the image, info and title from the returned html
function getNotificationGlobal() {
    fetch(url0 + "/requests/check_notifications.php", {
        credentials: 'include',
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: "type=1&for=2&token_id="+token_id
      })
      .then(text)
      .then(function (data) {      
            var title0 = data.match(new RegExp('<div class="notification-text"><a href="' + "(.*?)" + '</a>'))[1];
            var title1 = title0.split('rel="loadpage">')[1];
            var body0 = data.match(new RegExp(title1 + "</a> " + "(.*?)" + '<br>'))[1];
            var body1 = body0.split('rel="loadpage">')[1];
            try {
                var body1 = body1.replace('</a>', '');
            } catch (e) {
            }
            var img0 = data.match(new RegExp('<img class="notifications" src="' + "(.*?)" + '"></a>'))[1];
            var img1 = img0.replace('thumb.php?t=a&w=50&h=50', 'thumb.php?t=a&zc=3');
            if (body1 === undefined) {
                notifyMe(title1, body0, img1, 0);
            } else {
                var body2 = body0.split('<a href="')[0] + body1;
                notifyMe(title1, body2, img1, 0);
            }

    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}

// If there is a notification about friend requests, fetch the image, info and title from the returned html
function getNotificationFriend() {
    fetch(url0 + "/requests/check_notifications.php", {
        credentials: 'include',
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: "type=1&for=3&token_id="+token_id
      })
      .then(text)
      .then(function (data) {
          var title0 = data.match(new RegExp('<div class="notification-text notification-friendships"><a href="' + "(.*?)" + 'rel="loadpage">' + "(.*?)" + "</a>"))[2];
          var body0 = "sent you a friend request.";
          var img0 = data.match(new RegExp('<img class="notifications" src="' + "(.*?)" + '"></a>'))[1];
          var img1 = img0.replace('thumb.php?t=a&w=50&h=50', 'thumb.php?t=a&zc=3');
          var confirmAction0 = data.match(new RegExp('notification-button button-normal"><a onclick="friend' + '(.*?)' + '</a>'))[1];
          var confirmAction1 = confirmAction0.split('>')
          n = confirmAction1[0].replace(/[\"\(\)\']/g, ''); // three numbers as string in array
          notifyMe(title0, body0, img1, 1);

    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}


// If there is a notification about a message, fetch the image, info and title from the returned html
function getNotificationText() {
        fetch(url0 + "/requests/check_notifications.php", {
            credentials: 'include',
            method: 'post',
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            },
            body: "type=1&for=1&token_id="+token_id
          })
          .then(text)
          .then(function (data) {
              var title0 = data.match(new RegExp('<div class="notification-text"><a href="' + "(.*?)" + '</a>'))[1];
              var title1 = title0.split('rel="loadpage">')[1];
              var body0 = data.match(new RegExp('<span class="chat-snippet">' + "(.*?)" + '</span>'))[1];
              var img0 = data.match(new RegExp('<img class="notifications" src="' + "(.*?)" + '"></a>'))[1];
              var img1 = img0.replace('thumb.php?t=a&w=50&h=50', 'thumb.php?t=a&zc=3');
              notifyMe(title1, body0, img1, 0);

        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
}
checkNewChromeNotifications();    
    
// This part accepts, declines the friend request
function friend(id, type, z) {
	// id = unique id of the viewed profile
	// type 1: send, approve or cancel a friend request
	// type 2: approve a friend request from the notifications widget
	// type 3: decline a friend request from the notifications widget
	// z if on, activate the sublist class which sets another margin (friends dedicated profile page)
    fetch(url0 + "/requests/friend.php", {
        credentials: 'include',
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: "id="+id+"&type="+type+"&z="+z+"&token_id="+token_id
      })
      .then(text)
      .then(function (data) {
          console.log(data)
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}

// This is the listener which closes the notification and directs to the webpage
self.onnotificationclick = function(event) {
    event.notification.close();
    var messageId = event.notification.data;
    if (n !== undefined) {
        n = n.replace(/ /g, '');
        n = n.split(',');
      if (event.action === 'accept') {  
        friend(n[0], 2, n[2]);
      }  
      else if (event.action === 'decline') {  
        friend(n[0], n[1], n[2]);
        clients.openWindow("/");  
      }  
      else {  
        clients.openWindow("/");  
      } 
      n = undefined;
    };

    event.waitUntil(self.clients.openWindow(url0));

};