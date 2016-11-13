angular.module('starter.utils', []).factory('utils', function(sessionService) {
    return {
        removeByAttr: function(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        },
        isAuthenticated: function() {
            if(sessionService.get('token') == undefined){
                return false;
            }else{
                return true;
            }
        },
        isAdmin: function(){
            if(sessionService.get('admin') == false){
                return false;
            }else{
                return true;
            }
        }

    }

});
