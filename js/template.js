if(!fbSearch.template){
	fbSearch.template = (function(){
		function Template(){
			this.pageTemplate = "<div class=\"container\" data-id={{pageId}}>"+
									"<div class=\"lft\">"+
										"<div class=\"mr-b15\"><img src={{imgSrc}} ></div>"+
										"<div class=\"like-cont fl\">"+
											"<span class=\"like-img\"><img src=\"img/like.jpg\"></span>"+
											"<span class=\"like-count\">{{likeCount}}</span>"+
										"</div>"+
										"<div class=\"fav-cont fl\">"+
											"<span class=\"fav-img cursor-p\" data-id=\"{{pageId}}\"><img src=\"img/{{favIcon}}\"></span>"+
										"</div>"+
									"</div>"+
									"<div class=\"rt\">"+
										"<div class=\"brandName color-orange\">{{brandName}}</div>"+
										"<div class=\"location fs-12 mr-b5\">{{location}}</div>"+
										"<div class=\"about fs-13 mr-b5\">{{about}}</div>"+
										"<div class=\"category mr-b5\">Category : {{category}}</div>"+
										"<div class=\"links fs-12 fr\">"+
											"<span class=\"website {{websiteClass}}\"><a href= {{website}} target=\"_blank\">View Website</span>"+
											"<span class=\"{{dividerClass}}\"> - </span>"+
											"<span class=\"fblink\"><a href= {{fblink}} target=\"_blank\">View on Facebook</span>"+
										"</div>"+
									"</div>"+
								"</div>";
		}

		return Template;
	})();
}