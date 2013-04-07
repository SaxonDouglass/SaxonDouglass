var cowop = {};

cowop.keyPressListeners = new Array;

document.onkeypress = function (evt) {
    var charCode = evt.which || evt.keyCode;
    var charStr = String.fromCharCode(charCode);
    for (var i in cowop.keyPressListeners) {
        cowop.keyPressListeners[i](charStr);
    }
}
