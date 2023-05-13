
let isStart = false;
window.addEventListener('message', event => {
	console.log(event.data);
	
	localStorage.setItem('location', JSON.stringify(event.data));
	if(!isStart){
		isStart = true;
		goongjs.accessToken = 'ZDxB8PiJAYaRkOfxfpg6D3flfT0d2c61Dd5Ehro6'; // key goong map
		var myMap = new MyMap(); // khởi tạo map
		myMap.init(); // gọi hàm init
	}
})
