function getLocation(callback){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
