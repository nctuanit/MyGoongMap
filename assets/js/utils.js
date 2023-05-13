function getLocation(callback){
   let location = LocalStorage.getItem('location');
	   if(location){
		   callback(JSON.parse(location));
	   }
}
