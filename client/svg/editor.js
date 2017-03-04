var request = {
    get: function (url, options) {
        return this._ajax(url, "GET");
    },
    post: function (url, data, options) { 
        return this._ajax(url, "POST", data);
    },
    put: function (url, data, options) { },
    patch: function (url, data, options) { },
    delete: function (url, options) { },
    _ajax: function (url, method, data) {
        var http = this._getHTTPObject();
        http.open(method, url, true);
        var promise = new Promise(function (resolve, reject) {
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
                    if (http.status == 200) {
                        var result = "";
                        if (http.responseText) result = http.responseText;
                        //Give the data to the callback function.
                        resolve(result);
                    } else { //An error occured
                        reject(http);
                    }
                }
            }
        });
        http.send(data);
        return promise;
    },
    _getHTTPObject: function () {
        var http = false;
        //Use IE's ActiveX items to load the file.
        if (typeof ActiveXObject != 'undefined') {
            try { http = new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) {
                try { http = new ActiveXObject("Microsoft.XMLHTTP"); }
                catch (E) { http = false; }
            }
            //If ActiveX is not available, use the XMLHttpRequest of Firefox/Mozilla etc. to load the document.
        } else if (window.XMLHttpRequest) {
            try { http = new XMLHttpRequest(); }
            catch (e) { http = false; }
        }
        return http;
    }
};

var api = {
    update: function (data) {
        data.uid = data.uid || uuid;
        request.post("/api/data/2", data);
    }
};
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
var util = {
    guid: function () {

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

var uuid = util.guid();

module.exports = { request: request, api: api, util: util, uid: uuid };