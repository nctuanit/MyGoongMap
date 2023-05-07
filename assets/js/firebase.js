const firebaseConfig = {
    apiKey: "AIzaSyBeeYZDz5JXuUbdoRlbOBYamx8CZ_ijR2w",
    authDomain: "server-api-eb7b4.firebaseapp.com",
    databaseURL: "https://server-api-eb7b4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "server-api-eb7b4",
    storageBucket: "server-api-eb7b4.appspot.com",
    messagingSenderId: "256226070261",
    appId: "1:256226070261:web:93d44d355543ccb0113fbc",
    measurementId: "G-RFE8Z0BVF1"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function addDoc(geoJSON){

	if(geoJSON){
		geoJSON.coordinates = geoJSON.coordinates.map(e => `${e[1]}|${e[0]}`)
	}
	db.collection("data").add(geoJSON)
}
