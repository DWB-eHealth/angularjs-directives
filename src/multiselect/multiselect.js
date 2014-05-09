var multiselectModule = angular.module('ui.multiselect', []);

multiselectModule.controller('MultiSelectController', ['$scope',
    function($scope) {
        $scope.leftSelectedItems = {};
        $scope.rightSelectedItems = {};
        var ngModelCtrl = {
            $setViewValue: angular.noop,
            $render: angular.noop
        };
        var shiftItems = function(selectedItems, fromList, toList) {
            var shiftedItems = [];
            for (var index in selectedItems) {
                var selectedItem = selectedItems[index];
                var elementIndex = getFromElementIndex(fromList, selectedItem);
                shiftedItems.push(fromList[elementIndex]);
                toList.push(fromList[elementIndex]);
                fromList.splice(elementIndex, 1);
            }
            return shiftedItems;
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
        };

        var render = function() {
            $scope.rightList = ngModelCtrl.$viewValue;
        };

        var updateView = function() {
            ngModelCtrl.$setViewValue($scope.rightList);
            ngModelCtrl.$render();
        };

        $scope.moveToRight = function() {
            shiftItems(getSelectedItems($scope.leftSelectedItems), $scope.leftList, $scope.rightList);
            clearSelectedItems();
            updateView();
        };

        $scope.moveToLeft = function() {
            var shiftedItems = shiftItems(getSelectedItems($scope.rightSelectedItems), $scope.rightList, $scope.leftList);
            clearSelectedItems();
            updateView();
            $scope.onMoveLeft({
                "items": shiftedItems
            });
        };

        $scope.moveAllToLeft = function() {
            for (var index in $scope.rightList) {
                $scope.leftList.push($scope.rightList[index]);
            }
            $scope.rightList.splice(0, $scope.rightList.length);
            clearSelectedItems();
            updateView();
            $scope.onMoveLeft({
                "items": $scope.leftList
            });
        };

        $scope.moveAllToRight = function() {
            for (var index in $scope.leftList) {
                $scope.rightList.push($scope.leftList[index]);
            }
            $scope.leftList.splice(0, $scope.leftList.length);
            clearSelectedItems();
            updateView();
        };

        $scope.selectRightItem = function(element) {
            $scope.rightSelectedItems[element[$scope.name]] = !$scope.rightSelectedItems[element[$scope.name]];
            $scope.onRightItemSelect({
                "item": element
            });
        };

        this.init = function(_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = render;
        };
    }

]);

multiselectModule.directive('multiselect', function() {
    return {
        restrict: 'EA',
        require: ['multiselect', 'ngModel'],
        scope: {
            leftList: "=",
            disabled: "=",
            onRightItemSelect: "&",
            onMoveLeft: "&",
            name: "@"
        },
        templateUrl: 'js/lib/angularjs-directives/template/multiselect/multiselect.html',
        replace: true,
        controller: 'MultiSelectController',
        link: function(scope, element, attrs, ctrls) {
            var multiSelectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            if (ngModelCtrl) {
                multiSelectCtrl.init(ngModelCtrl);
            }
        }
    };
});