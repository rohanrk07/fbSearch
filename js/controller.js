if(!fbSearch.controller){
	fbSearch.controller = (function(){

		function Controller(model, view){
			this.model = model;
			this.view = view;
			view.bind("submitSearch", this.handleSearch, this);
			view.bind("onLoad", this.fireSearchOnLoad, this);
			view.bind("showFav", this.showFavourites, this);
			view.bind("sortResults", this.sortResults, this);
			this.sQuery = "";
			this.checkFavourite = function(id){
				return this.model.checkFavourite(id);
			}
		}

		Controller.prototype.handleSearch = function(query, context, bPageId, sortObj){
			context.sQuery = query;
			var store = context.model.findStorage(query);
			if(store){
				context.handleSearchResults(store, sortObj);
			}else{
				fbSearch.utils.FBPageSearch(query, context.handleSearchResults, context, bPageId);
			}			
		}

		Controller.prototype.handleSearchResults = function(data, sortObj){
			if(data && data.data && data.data.length){
				var len = data.data.length;
				//for(var j = 0 ; j < len ; j++){
					//fbSearch.utils.FBPageDetails();
				var sortField = sortObj ? sortObj.field : "likes";
				var sortOrder = sortObj ? sortObj.sortOrder : "desc";
				fbSearch.utils.sortData(sortField, data.data, sortOrder);
				this.view.showResults(data.data, this);
				this.model.createStorage(data, this.sQuery);
				//}
			}else if(data && data.hasOwnProperty("link")){
				this.view.showResults(data, this);
				this.model.createStorage(data, this.sQuery);
			}else{
				this.view.showEmptyResults();
			}
		}

		Controller.prototype.fireSearchOnLoad = function(context){
			context.sQuery = "Projectplace";
			fbSearch.utils.FBPageSearch("Projectplace", context.handleSearchResults, context);
		}

		Controller.prototype.toggleFavIcon = function(id, context){
			if(context.model.checkFavourite(id)){
				context.model.removeFavItem(id, context);
			}else{
				context.model.addFavItem(id, context);
			}
		}

		Controller.prototype.toggleFavState = function(id, state){
			this.view.toggleFavState(id, state);
		}

		Controller.prototype.showFavourites = function(state, context){
			if(state){
				var store = context.model.getLocalStorage();
				if(store && store.length){
					var len = store.length;
					for(var i = 0; i < len ; i++){
						fbSearch.utils.FBPageSearch(store[i], context.handleSearchResults, context, true);
					}
					context.view.toggleContainer(state);
				}else{
					context.view.toggleContainer(state);
					context.view.showEmptyFavourites();
				}
			}else{
				context.view.toggleContainer(state);
			}
		}

		Controller.prototype.sortResults = function(sQuery, sortObj, context,bPageId){
			context.handleSearch(sQuery, context, bPageId, sortObj);
		}

		return Controller;
	})(window);
}
