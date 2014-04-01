var multiselectModule = angular.module('ui.multiselect', []);

multiselectModule.controller('MultiSelectController', ['$scope',
    function($scope) {
        $scope.leftSelectedItems = {};
        $scope.rightSelectedItems = {};

        var shiftItems = function(selectedItems, fromList, toList) {
            for (var index in selectedItems) {
                var selectedItem = selectedItems[index];
                var elementIndex = getFromElementIndex(fromList, selectedItem);
                toList.push(fromList[elementIndex]);
                fromList.splice(elementIndex, 1);
            }
        };

        var getFromElementIndex = function(fromList, itemId) {
            for (var index in fromList) {
                if (fromList[index][$scope.name] === itemId)
                    return index;
            }
            return -1;
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
            for (var index in $scope.rightList) {
                $scope.leftList.push($scope.rightList[index]);
            }
            $scope.rightList = [];
            clearSelectedItems();
        };

        $scope.moveAllToRight = function() {
            for (var index in $scope.leftList) {
                $scope.rightList.push($scope.leftList[index]);
            }
            $scope.leftList = [];
            clearSelectedItems();
        };
    }

]);

multiselectModule.directive('multiselect', function() {
    return {
        restrict: 'EA',
        scope: {
            leftList: "=",
            rightList: "=",
            name: "@"
        },
        templateUrl: 'js/lib/angularjs-directives/template/multiselect/multiselect.html',
        replace: true,
        controller: 'MultiSelectController'
    };
});