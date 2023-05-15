// biến lưu trữ config kết nối firebase
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
// khởi tạo firebase app
firebase.initializeApp(firebaseConfig);

// khởi tạo firestore
var db = firebase.firestore();


/**
 * hàm thực hiện thêm document vào collection data trong firestore
 * @param {JSON} geoJSON 
 */
function addDoc(geoJSON){

	if(geoJSON){
		// chuyển đổi tọa độ sang dạng string để lưu trữ vào firestore (lưu ý: firestore không hỗ trợ lưu trữ array)
		geoJSON.coordinates = geoJSON.coordinates.map(e => `${e[1]}|${e[0]}`)
	}
	db.collection("data").add(geoJSON)
}
