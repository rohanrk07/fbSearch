if(!fbSearch.model){
	fbSearch.model = (function(){

		/*Storage for all searches and a localstorage for my favouries*/
		function Model(storage){
			this.oStorage = {};
			this.setLocalStorage = function(store){
				localStorage.setItem("fbFavPages", JSON.stringify(store));
			}
			this.getLocalStorage = function(){
				return JSON.parse(localStorage.getItem("fbFavPages"));
			}
		}

		Model.prototype.createStorage = function(data, query){
			var sQuery = query.toLowerCase();
			if(!this.oStorage[sQuery]){
				this.oStorage[sQuery] = data;
			}
		}

		Model.prototype.findStorage = function(query){
			var sQuery = query.toLowerCase();
			if(this.oStorage[sQuery]){
				return this.oStorage[sQuery];
			}else{
				return false;
			}
		}

		Model.prototype.checkFavourite = function(id){
			var store = JSON.parse(localStorage.getItem("fbFavPages"));
			if(store && store.indexOf(id) !== -1){
				return true;
			}else{
				return false;
			}
		}

		Model.prototype.addFavItem = function(id, context){
			var store = JSON.parse(localStorage.getItem("fbFavPages"));
			if(!store){
				localStorage.setItem("fbFavPages", "[]")
			}
			store.push(id);
			this.setLocalStorage(store);
			context.toggleFavState(id, "filled");
		}

		Model.prototype.removeFavItem = function(id, context){
			var store = JSON.parse(localStorage.getItem("fbFavPages"));
			var index = store.indexOf(id);
			store.splice(index, 1);
			this.setLocalStorage(store);
			context.toggleFavState(id, "");
		}

		return Model;
	})(window);
}
