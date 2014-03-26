var multiselectModule = angular.module('ui.multiselect', []);

multiselectModule.controller('MultiSelectController', ['$scope',
    function($scope) {

    }
]);

multiselectModule.directive('multiselect', function() {
    return {
        restrict: 'EA',
        scope: {
            leftList: "=",
            rightList: "="
        },
        templateUrl: 'template/multiselect.html',
        replace: true,
        controller: 'MultiSelectController'
    }
});