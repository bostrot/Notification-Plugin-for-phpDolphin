
//======================================================================\\
// Notifications - Plugin           			                        \\
// Copyright © Eric Trenkel - Bostrot. All rights reserved.			    \\
//----------------------------------------------------------------------\\
// https://www.bostrot.pro/         	     	                        \\
//======================================================================\\

/*
 * This code checks if SWs are supported.
 * Registers the Service Worker in plugin directory ("sw.js")
 * and reinstalls to make sure notifications are running.
 */

navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
     registration.unregister()
   } 
   
    navigator.serviceWorker.register('plugins/notifications/sw.js?'+token_id) 
        .then(function(registration) {
        var installingWorker = registration.installing;
        console.log('A new service worker is being installed:',
        installingWorker);
        Notification.requestPermission(function(result) {
        if ('serviceWorker' in navigator) {
            if (result === "granted") {
            console.log("OK.")
            }
        } else {
            console.log('Service workers are not supported.');
        }
        });
        })
        .catch(function(error) {
        console.log('Service worker registration failed:', error);
    });
})
