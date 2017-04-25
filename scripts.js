var app = angular.module('myApp', [ 'ui.bootstrap' ]);

app.controller('myCtrl', function($scope, $http, $uibModal, $log, $document) {
        $scope.queryName = "";
        $scope.errMsg = "";

        // function starts
        $scope.searchArtists = function() {
                $http.get("https://api.spotify.com/v1/search?q="+$scope.queryName+"&type=artist,album,track,playlist&offset=0&limit=3" )
                .then(function(response){
                        $scope.details = response.data;
                        console.log("response = ",response)
                        if(response.data.artists.total || response.data.albums.total || response.data.tracks.total || response.data.playlists.total) {
                            $scope.errMsg = "";
                        }
                        else {
                            $scope.errMsg = "No records found for "+$scope.queryName;
                        }
                }, function(error) {
                    console.log(error);
                });
        }
        // function ends

/* --------------------------------- --------------------------------- MODAL --------------------------------- */

        var $ctrl = this;
        //$ctrl.items = ['item1', 'item2', 'item3', 'item4', 'item5'];

        $ctrl.open = function (x) {
                var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                    resolve: {
                        items: function () {
                            return x;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    //$ctrl.selected = selectedItem;
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
        };

});
/* --------------------------------- --------------------------------- 1 end --------------------------------- */

app.controller('ModalInstanceCtrl', function ($uibModalInstance, items, $http) {
        var $ctrl = this;
        console.log("in 2nd function");
        //console.log("items=", items);
        $ctrl.items = items;
        console.log("$ctrl.items = ",$ctrl.items);
        //$ctrl.name = items.name;
        //console.log("$ctrl.name = ",$ctrl.name);
        //var apiForTracks = $ctrl.items.href + '/tracks?offset=0&limit=10';
        //console.log("apiForTracks", apiForTracks);

    //details about artist
        if($ctrl.items.type == 'artist') {
            var apiForAlbums = $ctrl.items.href + '/albums?offset=0&limit=10';
            $http.get( apiForAlbums )
                .then(function(response){
                        $ctrl.artistAlbum = response.data.items;
                        console.log("$ctrl.artistAlbum = ",$ctrl.artistAlbum);
                }, function(error) {
                    console.log(error);
                });
        }

    //details about album
        if($ctrl.items.type == 'album') {
            var apiForTracks = $ctrl.items.href + '/tracks?offset=0&limit=10';
            $http.get( apiForTracks )
                .then(function(response){
                        $ctrl.albumTracks = response.data.items;
                        console.log("$ctrl.albumTracks = ",$ctrl.albumTracks);
                }, function(error) {
                    console.log(error);
                });
        }

    //details about track
        if($ctrl.items.type == 'track') {
            var duration = $ctrl.items.duration_ms/1000;
            var minutes = Math.floor(duration / 60);
            var seconds = Math.floor(duration - (60*minutes));
            console.log("minutes =",minutes, "  seconds=",seconds)
            $ctrl.durationT = minutes+" : "+seconds;
        }


    // ok button function
        $ctrl.ok = function () {
                $uibModalInstance.close($ctrl.selected.item);
        };

    // cancel button function
        $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
        };

});
