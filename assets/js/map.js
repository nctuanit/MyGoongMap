class MyMap {
	constructor() {
		this.map = null; // biến lưu trữ map
		this.isStartDirection = false; // biến kiểm tra trạng thái bắt đầu tìm đường
		this.goongClient = goongSdk({
			accessToken: "fB2uKvZElzJ2NNaJFuGPhwJAlzf3N5RMMZ4sQiif", // key goong map
		});
		this.CurrLocation = null; // biến lưu trữ vị trí hiện tại
	}

	showMyLocation(lng, lat) {
		$(".myLocation").show(); // hiển thị vị trí hiện tại
		$(".myLocation .lng").text(lng); // hiển thị kinh độ
		$(".myLocation .lat").text(lat); // hiển thị vĩ độ
	}

	init() {
		getLocation((position) => {
			this.map = new goongjs.Map({
				container: "map", // id của thành phần chứa map
				style: "https://tiles.goong.io/assets/goong_map_web.json", // link json style
				center: [position.coords.longitude, position.coords.latitude], // vị trí hiện tại
				zoom: 15, // level zoom hiện tại
			});
			this.map.on("load", () => { // sự kiện load map
				this.addMarker(
					position.coords.longitude,
					position.coords.latitude
				); // thêm marker vị trí hiện tại
				this.addControl(); // thêm control
			});
			this.showMyLocation(
				position.coords.longitude, // hiển thị vị trí hiện tại
				position.coords.latitude
			);
			this.CurrLocation = [
				position.coords.longitude,
				position.coords.latitude,
			]; // lưu trữ vị trí hiện tại
		});
	}
	addControl() {
		this.map.addControl(new goongjs.ScaleControl(), "bottom-right"); // thêm control scale
		// Add geolocate control to the map.
		this.map.addControl(
			new goongjs.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			}),
			"bottom-right"
		); // thêm control vị trí hiện tại
		this.map.addControl(new goongjs.NavigationControl(), "bottom-right"); // thêm control điều hướng
		this.map.addControl(new goongjs.FullscreenControl()); // thêm control full màn hình
		// Add the control to the map.

		this.autoComplete = new GoongGeocoder({
			accessToken: "fB2uKvZElzJ2NNaJFuGPhwJAlzf3N5RMMZ4sQiif", // key goong map
			goongjs: goongjs,
			width: "100%",
		}); // tạo biến tìm kiếm địa chỉ với key goong map

		this.map.addControl(this.autoComplete, "top-left"); // thêm control tìm kiếm địa chỉ
		this.autoComplete.on("result", (e) => { // sự kiện tìm kiếm địa chỉ
			console.log(e);

			$(".display-info .title-header").text(e.result.result.name); // hiển thị tên địa chỉ
			$(".display-info .addressDetail .address").text(
				e.result.result.formatted_address
			); // hiển thị địa chỉ
			$("input[name='destination']").val(
				`${e.result.result.geometry.location.lat},${e.result.result.geometry.location.lng}`
			); // lưu trữ vị trí địa chỉ
			$(".display-info").show(); // hiển thị thông tin địa chỉ
		});
		this.autoComplete.on("clear", (e) => { // sự kiện xóa tìm kiếm địa chỉ
			if (!e) { // nếu không có sự kiện
				$(".display-info").hide(); // ẩn thông tin địa chỉ
				this.removeSource(); // xóa source
				this.isStartDirection = false; // trạng thái tìm đường = false
			}
		});
		this.autoComplete.on("loading", (e) => { // sự kiện tìm kiếm địa chỉ
			console.log(e);
		});
		// current location
		this.directions = new MapboxDirections({ // tạo biến tìm đường
			goongjs: goongjs,
			accessToken: goongjs.accessToken,
			unit: "metric",
			profile: "mapbox/driving",
			controls: {
				inputs: false,
				instructions: false,
				profileSwitcher: false,
			},
			placeholderOrigin: "Chọn điểm đi",
			placeholderDestination: "Chọn điểm đến",
		}); // tạo biến tìm đường
		// add control find location
		this.map.addControl(this.directions, "top-left"); // thêm control tìm đường
		this.btnDirection(); // gán sự kiện cho nút nhấn tìm đường
		getLocation((position) => {
			$("input[name='origin']").val(
				`${position.coords.latitude},${position.coords.longitude}`
			); // lưu trữ vị trí hiện tại
			console.log(
				`${position.coords.latitude},${position.coords.longitude}`
			); // log vị trí hiện tại
			this.marker.setLngLat([
				position.coords.longitude,
				position.coords.latitude,
			]); // thêm marker vị trí hiện tại
		});
		this.autoUpdateLocation(); // tự động cập nhật vị trí hiện tại

		// add control find location
	}
	addMarker(lng, lat) {
		this.marker = new goongjs.Marker().setLngLat([lng, lat]); // tạo marker
		this.marker.addTo(this.map); // thêm marker vào map
	}
	StartDirection(origin, destination) {
		var layers = this.map.getStyle().layers;

		// Find the index of the first symbol layer in the map style
		var firstSymbolId;
		for (var i = 0; i < layers.length; i++) {
			if (layers[i].type === "symbol") {
				firstSymbolId = layers[i].id;
				break;
			}
		}
		const MyMapT = this; // gán this cho biến khác
		this.goongClient.directions // tìm đường
			.getDirections({
				origin: origin,
				destination: destination,
				vehicle: "car",
			}) // tìm đường
			.send() // gửi yêu cầu
			.then(function (response) { // trả về kết quả
				var directions = response.body; // lấy kết quả
				var route = directions.routes[0]; // lấy kết quả
				var geometry_string = route.overview_polyline.points; // lấy kết quả
				var geoJSON = polyline.toGeoJSON(geometry_string); // tạo geojson
				MyMapT.map.addSource("route", { // thêm source
					type: "geojson",
					data: geoJSON,
				});
				console.log(geoJSON); // log kết quả
				addDoc(geoJSON); // thêm vào firestore
				// Add route layer below symbol layers
				MyMapT.map.addLayer(
					{
						id: "route",
						type: "line",
						source: "route",
						layout: {
							"line-join": "round",
							"line-cap": "round",
						},
						paint: {
							"line-color": "#1e88e5",
							"line-width": 8,
						},
					},
					firstSymbolId
				); // thêm layer
			});
	}

	btnDirection() {
		$(".btn-direction").click(() => { // sự kiện nhấn nút tìm đường
			this.removeSource(); // xóa source
			var origin = $("input[name='origin']").val(); // lấy vị trí hiện tại
			var destination = $("input[name='destination']").val(); // lấy vị trí đích
			this.map.flyTo({ // di chuyển đến vị trí đích
				center: origin.split(",").reverse(), // tọa độ
				essential: true, // nếu false thì sẽ không có hiệu ứng
			});
			$(".display-info").hide(); // ẩn thông tin địa chỉ
			this.StartDirection(origin, destination); // tìm đường
			this.isStartDirection = true; // trạng thái tìm đường = true
		});
	}

	autoUpdateLocation() {
		setInterval(() => {
			getLocation((position) => {
				$("input[name='origin']").val(
					`${position.coords.latitude},${position.coords.longitude}`
				); // lưu trữ vị trí hiện tại
				this.showMyLocation(
					position.coords.latitude,
					position.coords.longitude
				); // câp nhật vị trí hiện tại
				console.log(
					`${position.coords.latitude},${position.coords.longitude}`
				); // log vị trí hiện tại
				this.marker.setLngLat([
					position.coords.longitude,
					position.coords.latitude,
				]); // thêm marker vị trí hiện tại
				var origin = $("input[name='origin']").val(); // lấy vị trí hiện tại
				var destination = $("input[name='destination']").val(); // lấy vị trí đích
				console.log(
					`${this.CurrLocation[0]},${this.CurrLocation[1]}`,
					origin
				); // log vị trí hiện tại
				if (
					this.isStartDirection &&
					`${this.CurrLocation[1]},${this.CurrLocation[0]}` != origin
				) { // nếu đang tìm đường và vị trí hiện tại khác vị trí hiện tại
					this.removeSource(); // xóa đường
					this.StartDirection(origin, destination); // tìm đường mới
				}
			});
		}, 5000); // thời gian cập nhật vị trí hiện tại (ms) mỗi 5 giây cập nhật 1 lần
	}

	removeSource() {
		if (this.map.getLayer("route")) { // nếu có layer route
			this.map.removeLayer("route"); // xóa layer route
		}
		if (this.map.getSource("route")) { // nếu có source route
			this.map.removeSource("route"); // xóa source route
		}
	}
}
