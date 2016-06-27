if(!fbSearch.view){
    fbSearch.view = (function () {
        /*reflects the UI*/
        function View(oTemplate) {
            this.oTemplate = oTemplate;
            /* Constants */
            this.ENTER_KEYCODE = 13;
            this.showFav = false;
            /* DOM References */
            this.$searchInput = window.document.querySelector("input.search-input");
            this.$searchButton = window.document.querySelector("button.search-button");
            this.$searchResultContainer = window.document.querySelector(".search-results");
            this.$showfavourite = window.document.querySelector("input.show-fav");
            this.$favContainer = window.document.querySelector(".fav-container");
            this.$sortSelect = window.document.querySelector(".sort-results");
        }
        
        View.prototype.setSearchInput = function (sQuery) {
            this.$searchInput.value = sQuery;
        };
        
        View.prototype.getQueryString = function () {
            return this.$searchInput.value;
        };
        
        /*bind events*/
        View.prototype.bind = function (sEvent, fnHandler, context, $el) {
            var self = this;
            switch (sEvent) {
                case "submitSearch":
                    this.$searchButton.addEventListener("click", function () {
                        var sQuery = self.$searchInput.value.trim();
                        if(!sQuery){
                            return;
                        }
                        self.$showfavourite.checked = false;
                        self.showFav = false;
                        if(sQuery.match(/^\d+$/)){
                            fnHandler(sQuery, context, true);
                        }else{
                            fnHandler(sQuery, context);
                        }
                        self.toggleContainer(false);
                        self.setSearchInput(sQuery);
                        
                    });
                    this.$searchInput.addEventListener("keypress", function (oEvt) {
                        if (oEvt.keyCode === self.ENTER_KEYCODE) {
                            var sQuery = self.$searchInput.value.trim();
                            if(!sQuery){
                                return;
                            }
                            self.$showfavourite.checked = false;
                            self.showFav = false;
                            if(sQuery.match(/^\d+$/)){
                                fnHandler(sQuery, context, true);
                            }else{
                                fnHandler(sQuery, context);
                            }
                            self.toggleContainer(false);
                            self.setSearchInput(sQuery);
                        }
                    });
                    break;
                case "onLoad":
                    window.onload = function() {
                        fnHandler(context);
                    }
                    break;
                case "favIconClick":
                    $el.addEventListener("click", function () {
                        var pageId = this.getAttribute("data-id");
                        fnHandler(pageId, context);
                    });
                    break;
                case "showFav":
                    this.$showfavourite.addEventListener("change", function(){
                        var prop = this.checked;
                        self.showFav = prop;
                        self.$favContainer.innerHTML = "";
                        fnHandler(prop, context);
                    });
                    break;
                case "sortResults":
                    this.$sortSelect.addEventListener("change", function() {
                        var field = this.value;
                        var sortOrder = this.options[this.selectedIndex].getAttribute("data-attr");
                        var sQuery = self.$searchInput.value.trim();
                        var sortObj = {"field" : field, "sortOrder" : sortOrder};
                        if(!sQuery){
                            fnHandler("projectplace", sortObj, context);
                        }else{
                            if(sQuery.match(/^\d+$/)){
                                fnHandler(sQuery, sortObj, context, true);
                            }else{
                                fnHandler(sQuery, sortObj, context);
                            }
                        }
                    });
                    break;
            }
        };

        View.prototype.showEmptyResults = function(data){
            this.$searchResultContainer.innerHTML = "";
            this.$searchResultContainer.innerHTML = "No Search Reults.";
        }

        View.prototype.showEmptyFavourites = function(data){
            this.$favContainer.innerHTML = "";
            this.$favContainer.innerHTML = "No Favourites.";
        }

        View.prototype.showResults = function(data, context){
            if(!this.showFav){
                this.$searchResultContainer.innerHTML = "";
            }
            if(!data.length){
                this.getPageHTML(data, true, context);
                return;
            }
            var len = data.length;
            var sHtml = "";
            
            for(var j = 0 ; j < len ; j++){
                this.getPageHTML(data[j], "", context);
            }
            //this.$searchResultContainer.innerHTML = sHtml;
        }

        /*Display results*/
        View.prototype.getPageHTML = function(data, bPageId, context){
            var template = this.oTemplate.pageTemplate;
            var brandName = data.global_brand_page_name;
            var query = this.getQueryString().toLowerCase();
            
            var imgSrc = data.cover  && data.cover.source? data.cover.source: "img/no-preview.jpeg";
            var category = data.category;
            var website = data.website && data.website.indexOf("www.") != -1 ? data.website : "";
            if(website && website.indexOf("http") == -1){
                website = "http://" + website;
            }
            var location = data.location;
            var fblink = data.link;
            var likes = data.likes;
            var abt = data.about;
            var id = data.id;
            //check for favourites
            if(context.checkFavourite(id)){
                template = template.replace("{{favIcon}}", "heart-filled.png");
            }else{
                template = template.replace("{{favIcon}}", "heart.png");
            }
            template = template.replace(/{{pageId}}/g, id);
            if(location){
                var loc = location.city && location.country ? location.city + " , " + location.country : location.country;
            }
            template = template.replace("{{brandName}}", brandName);
            loc ? template = template.replace("{{location}}", loc) : template = template.replace("{{location}}", "") ;
            template = template.replace("{{imgSrc}}", imgSrc);
            template = template.replace("{{category}}", category);
            if(website){
                template = template.replace("{{website}}", website);
                template = template.replace("{{websiteClass}}", "");
                template = template.replace("{{dividerClass}}", "");
            }else{
                template = template.replace("{{websiteClass}}", "hide");
                template = template.replace("{{dividerClass}}", "hide");
            }
            
            template = template.replace("{{fblink}}", fblink);
            template = template.replace("{{likeCount}}", likes);
            abt ? template = template.replace("{{about}}", abt) : template = template.replace("{{about}}", "");;
            var div = window.document.createElement('div');
            div.innerHTML = template;
            div.className = "page-block";
            if(this.showFav){
                this.$favContainer.appendChild(div);
            }else{
                this.$searchResultContainer.appendChild(div);
            }
            var $favIcon = window.document.querySelector("span[data-id='"+id+"']");
            this.bind("favIconClick", context.toggleFavIcon, context, $favIcon);
        }

        View.prototype.toggleFavState = function(id, state){
            var $el = window.document.querySelector("span[data-id='"+id+"'] img");
            if(state){
                $el.setAttribute("src" , "img/heart-"+state+".png");
            }else{
                $el.setAttribute("src", "img/heart.png");
            }
        }
        
        View.prototype.toggleContainer = function(state){
            if(state){
                this.$favContainer.classList.remove("hide");
                this.$searchResultContainer.classList.add("hide");
            }else{
                this.$favContainer.classList.add("hide");
                this.$searchResultContainer.classList.remove("hide");
            }
        }

        return View;
    }(window));
}
