
// biến kiểm tra xem app gửi tọa độ lên chưa
let isStart = false;
// lắng nghe sự kiện gửi tọa độ lên từ app
window.addEventListener('message', event => {

	// lưu tọa độ vào localStorage
	localStorage.setItem('location', JSON.stringify(event.data));

	// nếu chưa khởi tạo map thì khởi tạo
	if(!isStart){
		isStart = true;

		// khởi tạo map và gán key goong map vào biến goongjs 
		goongjs.accessToken = 'ZDxB8PiJAYaRkOfxfpg6D3flfT0d2c61Dd5Ehro6'; // key goong map
		var myMap = new MyMap(); // khởi tạo map
		myMap.init(); // gọi hàm init nếu nhận được tin nhắn đầu tiên từ app
	}
})
// Path: assets\js\map.js hàm chính của chương trình 