var equalsModule = angular.module('ui.notIn', []);

equalsModule.directive('notIn', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var thisValue;
            var otherValues;

            attrs.$observe('notIn', function(values) {
                otherValues = scope.$eval(values);
                validate();
            });

            ctrl.$parsers.unshift(function(viewValue) {
                thisValue = viewValue.toLowerCase();
                validate();
                return thisValue;
            });

            var any = function(arr, predicate) {
                for (var e in arr) {
                    if (predicate(arr[e])) {
                        return true;
                    }
                }
                return false;
            };

            var validate = function() {
                var isWithin = any(otherValues, function(value) {
                    return value && thisValue && (value.toLowerCase() === thisValue.toLowerCase());
                });
                ctrl.$setValidity('isWithin', !isWithin);
            };
        },
    };
});