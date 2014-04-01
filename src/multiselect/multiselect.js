var multiselectModule = angular.module('ui.multiselect', []);

multiselectModule.controller('MultiSelectController', ['$scope',
    function($scope) {
        $scope.leftSelectedItems = {};
        $scope.rightSelectedItems = {};

        var shiftItems = function(selectedItems, fromList, toList) {
            for (var index in selectedItems) {
                var selectedItem = selectedItems[index];
                var elementIndex = fromList.indexOf(selectedItem);
                toList.push(selectedItem);
                fromList.splice(elementIndex, 1);
            }
        };

        var getSelectedItems = function(selectedItems) {
            var selections = [];
            for (var selectedItem in selectedItems) {
                if (selectedItems[selectedItem])
                    selections.push(selectedItem);
            }
            return selections;
        };

        var clearSelectedItems = function() {
            $scope.leftSelectedItems = {};
            $scope.rightSelectedItems = {};
        }

        $scope.moveToRight = function() {
            shiftItems(getSelectedItems($scope.leftSelectedItems), $scope.leftList, $scope.rightList);
            clearSelectedItems();
        };

        $scope.moveToLeft = function() {
            shiftItems(getSelectedItems($scope.rightSelectedItems), $scope.rightList, $scope.leftList);
            clearSelectedItems();
        };

        $scope.moveAllToLeft = function() {
            shiftItems(angular.copy($scope.rightList), $scope.rightList, $scope.leftList);
            clearSelectedItems();
        };

        $scope.moveAllToRight = function() {
            shiftItems(angular.copy($scope.leftList), $scope.leftList, $scope.rightList);
            clearSelectedItems();
        };
    }
]);

multiselectModule.directive('multiselect', function() {
    return {
        restrict: 'EA',
        scope: {
            leftList: "=",
            rightList: "="
        },
        templateUrl: 'js/lib/angular-multiselect/template/multiselect.html',
        replace: true,
        controller: 'MultiSelectController'
    };
});
