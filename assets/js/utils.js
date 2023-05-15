
function getLocation(callback){
	// lấy vị trí hiện tại từ localStorage 
   let location = localStorage.getItem('location');
	// nếu có vị trí hiện tại thì gọi hàm callback
	if(location){
		// chuyển vị trí hiện tại từ string sang json
		// và gọi hàm callback truyền vị trí hiện tại vào
		callback(JSON.parse(location));
	}
}
