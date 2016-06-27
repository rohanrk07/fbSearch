var fbSearch = {}; //Global object
if(!fbSearch.utils){
	/*Utility to call FB search Graph API*/
	fbSearch.utils = (function(){

		var sAppKey = "1513453565582386",
            		sAppSecretKey = "a877266262b417696385aa55b92e959c",
	            	sAccessToken = sAppKey + "|" + sAppSecretKey,
        	    	counter = 0,
	            	fields = "global_brand_page_name,category,location,about,cover,link,website,likes";

        function FBPageSearch(query, fnCallback, context, bPageId){
        	var sCallback = "callback"+ counter++;
            if(bPageId){
                var sUrl = "https://graph.facebook.com/"+query+"?access_token="+sAccessToken+"&callback="+sCallback+"&fields="+fields;
            }else{
                var sUrl = "https://graph.facebook.com/search?q="+query+"&type=page&access_token="+sAccessToken+"&callback="+sCallback+"&fields="+fields;
            }
        	

        	addScript(sUrl, sCallback, context, fnCallback);
        }

        /*Inject script with callback*/
        function addScript(sUrl, sCallback, context, fnCallback){
		window[sCallback] = function(data){
        		fnCallback.call(context, data);
        		window.document.querySelector('#' + sCallback).remove();
        	}
        	var oHead = window.document.querySelector('head');
            var oScript = window.document.createElement('script');
            oScript.src = sUrl;
            oScript.id = sCallback;
            oHead.appendChild(oScript);
        }

        /*sorting utility*/
        function sortData(field, data, sortOrder){
            data.sort(function(a, b){
                if(sortOrder === "desc"){
                    if (a[field] < b[field])
                        return 1;
                    if (a[field] > b[field])
                        return -1;
                    return 0;
                }else{
                    if (a[field] < b[field])
                        return -1;
                    if (a[field] > b[field])
                        return 1;
                    return 0;
                }
            })
        }
		
		return {
			FBPageSearch : FBPageSearch,
            sortData : sortData
		};
	})(window);
}
