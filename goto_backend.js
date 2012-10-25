saved_settings = $.parseJSON(localStorage["settings"]);
url_in_array = false;
var current_tab_url = "";
var current_tab_id = -1;

// go to the backend-URL of current URL
function goto_backend(url) {
    if (saved_settings != null){
        $.each(saved_settings.lines,function(){
            if (this.frontend_url && url.match(this.frontend_url)){
                chrome.tabs.create({url: url.replace(this.frontend_url, this.backend_url)});
            }
        });
    }
}

// fired when page is refreshed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    test_url_and_set_color(tabId)
});

// fired when page tab is activated
chrome.tabs.onActiveChanged.addListener(function(tabId) {
    test_url_and_set_color(tabId)
});

// checks if the URL is in the Frontend-URL-Array
function is_url_in_frontend_array(url){
    url_in_array = false;
    if (saved_settings != null){
        $.each(saved_settings.lines,function(){
            if (this.frontend_url && url.match(this.frontend_url)){
                url_in_array = true;
            }
        });
    }
    return url_in_array;
}

// checks if the URL is in the Backend-URL-Array
function is_url_in_backend_array(url){
    url_in_array = false;
    if (saved_settings != null){
        $.each(saved_settings.lines,function(){
            if (this.backend_url && url.match(this.backend_url)){
                url_in_array = true;
            }
        });
    }
    return url_in_array;
}

// fired when the button is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    // read settings
    saved_settings = $.parseJSON(localStorage["settings"]);
    if (is_url_in_frontend_array(tab.url)){
        goto_backend(tab.url);
    }else{
        //notification.show();
        // open PopUp with Error Message
    }
});

// rules and triggers checks and changes the color of the button eventually
function test_url_and_set_color(tabId){
    // Update settings
    update_settings();
    // get current_tab
    chrome.windows.getCurrent(function(win) {
        chrome.tabs.query( {'windowId': win.id, 'active': true},function(tabArray){
            if (tabArray) {
                var tabID = tabArray[0].id;
                current_tab_url = tabArray[0].url;
                if (current_tab_url!=""){
                    //alert(current_tab_url);
                }
                if(is_url_in_frontend_array(current_tab_url)&&!is_url_in_backend_array(current_tab_url)){
                    colorizeIcon();
                    chrome.browserAction.setPopup({popup: ""});
                    //Button on
                } else {
                    greyOutIcon();
                    chrome.browserAction.setPopup({popup: "error-popup.html"});
                    //Button off
                }
            }
        });
    });  
    // todo Überprüfung und icon setzen und Button an/ausschalten
}

// makes the Button grey
function greyOutIcon() {
    chrome.browserAction.setIcon({path:"go-to-Backend48x48-grey.png"});
}

// makes the Button colorized again
function colorizeIcon() {
    chrome.browserAction.setIcon({path:"go-to-Backend48x48.png"});
}

// updates the settings
function update_settings(){
    saved_settings = $.parseJSON(localStorage["settings"]);
}
/*
var notification = webkitNotifications.createNotification(
    //'red-cross-48',  // icon url - can be relative
    'Please Notice',  // notification title
    'Please notice, that the URL of this page is not known the Backend-Switcher! Go to the options page to add it!'  // notification body text
);
*/