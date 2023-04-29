class MyMap {
	constructor() {
		this.map = null;
		this.isStartDirection = false;
		this.goongClient = goongSdk({
			accessToken: "fB2uKvZElzJ2NNaJFuGPhwJAlzf3N5RMMZ4sQiif",
		});
		this.CurrLocation = null;
	}

	showMyLocation(lng,lat) {
		$(".myLocation").show();
		$(".myLocation .lng").text(lng);
		$(".myLocation .lat").text(lat);
	}

	init() {
		getLocation((position) => {
			this.map = new goongjs.Map({
				container: "map", // container id
				style: "https://tiles.goong.io/assets/goong_map_web.json", //stylesheet location
				center: [position.coords.longitude, position.coords.latitude], // starting position
				zoom: 15, // starting zoom
			});
			this.map.on("load", () => {
				this.addMarker(position.coords.longitude, position.coords.latitude);
				this.addControl();
			});
			this.showMyLocation(position.coords.longitude, position.coords.latitude);
			this.CurrLocation = [position.coords.longitude, position.coords.latitude]
		});
	}
	addControl() {
		this.map.addControl(new goongjs.ScaleControl(), "bottom-right");
		// Add geolocate control to the map.
		this.map.addControl(
			new goongjs.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			}),
			"bottom-right"
		);
		this.map.addControl(new goongjs.NavigationControl(), "bottom-right");
		this.map.addControl(new goongjs.FullscreenControl());
		// Add the control to the map.

		this.autoComplete = new GoongGeocoder({
			accessToken: "fB2uKvZElzJ2NNaJFuGPhwJAlzf3N5RMMZ4sQiif",
			goongjs: goongjs,
			width: "100%",
		});

		this.map.addControl(this.autoComplete, "top-left");
		this.autoComplete.on("result", (e) => {
			console.log(e);

			$(".display-info .title-header").text(e.result.result.name);
			$(".display-info .addressDetail .address").text(
				e.result.result.formatted_address
			);
			$("input[name='destination']").val(`${e.result.result.geometry.location.lat},${e.result.result.geometry.location.lng}`);
			$(".display-info").show();
		});
		this.autoComplete.on("clear", (e) => {
			if (!e) {
				$(".display-info").hide();
				this.removeSource()
				this.isStartDirection = false;
			}
		});
		this.autoComplete.on("loading", (e) => {
			console.log(e);
		});
		// current location
		this.directions = new MapboxDirections({
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
		});
		this.directions.on("route", (e) => {
			console.log(e);
		});

		this.directions.on("profile", (e) => {
			console.log(e);
		});

		this.directions.on("clear", (e) => {
			console.log(e);
		});

		this.directions.on("loading", (e) => {
			console.log(e);
		});

		this.directions.on("origin", (e) => {
			console.log(e);
		});

		this.directions.on("destination", (e) => {
			console.log(e);
		});

		this.directions.on("error", (e) => {
			console.log(e);
		});
		// add control find location
		this.map.addControl(this.directions, "top-left");
		this.btnDirection()
		getLocation((position) => {
			$("input[name='origin']").val(`${position.coords.latitude},${position.coords.longitude}`)
			console.log(`${position.coords.latitude},${position.coords.longitude}`)
			this.marker.setLngLat([position.coords.longitude, position.coords.latitude])
		});
		this.autoUpdateLocation()

		// add control find location
	}
	addMarker(lng, lat) {
		this.marker = new goongjs.Marker().setLngLat([lng, lat])
		this.marker.addTo(this.map)
	}
	StartDirection(origin,destination) {
		var layers = this.map.getStyle().layers;
		
		// Find the index of the first symbol layer in the map style
		var firstSymbolId;
		for (var i = 0; i < layers.length; i++) {
			if (layers[i].type === "symbol") {
				firstSymbolId = layers[i].id;
				break;
			}
		}
		const MyMapT = this;
		this.goongClient.directions
			.getDirections({
				origin: origin,
				destination: destination,
				vehicle: "car",
			})
			.send()
			.then(function (response) {
				var directions = response.body;
				var route = directions.routes[0];
				var geometry_string = route.overview_polyline.points;
				var geoJSON = polyline.toGeoJSON(geometry_string);
				MyMapT.map.addSource("route", {
					type: "geojson",
					data: geoJSON,
				});
				console.log(geoJSON)
				addDoc(geoJSON)
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
				);
			});
	}

	btnDirection() {
		$(".btn-direction").click(() => {
			this.removeSource()
			var origin = $("input[name='origin']").val();
			var destination = $("input[name='destination']").val();
			this.map.flyTo({center:origin.split(',').reverse(),essential: true})
			$(".display-info").hide();
			this.StartDirection(origin,destination);
			this.isStartDirection = true;
		});
	}

	autoUpdateLocation() {
		setInterval(() => {
			getLocation((position) => {
				$("input[name='origin']").val(`${position.coords.latitude},${position.coords.longitude}`)
				this.showMyLocation(position.coords.latitude,position.coords.longitude)
				console.log(`${position.coords.latitude},${position.coords.longitude}`)
				this.marker.setLngLat([position.coords.longitude, position.coords.latitude])
				var origin = $("input[name='origin']").val();
				var destination = $("input[name='destination']").val();
				console.log(`${this.CurrLocation[0]},${this.CurrLocation[1]}`,origin)
				if(this.isStartDirection && `${this.CurrLocation[1]},${this.CurrLocation[0]}` != origin)
				{
					this.removeSource()
					this.StartDirection(origin,destination);
				}
			});
		}, 5000);
	}

	removeSource(){
		if(this.map.getLayer("route")){
			this.map.removeLayer("route")
		}
		if (this.map.getSource("route")){
			this.map.removeSource("route");
		 }
	}
	
}
