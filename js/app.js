/*global app*/
(function () {

    function FBSearch(name) {
        this.model = new fbSearch.model(name);
        this.template = new fbSearch.template();
        this.view = new fbSearch.view(this.template);
        this.controller = new fbSearch.controller(this.model, this.view);
    }
    var fbsearch = new FBSearch("fbSearch");
}());