function getLocation(callback){
   let location = localStorage.getItem('location');
	   if(location){
		   callback(JSON.parse(location));
	   }
}
