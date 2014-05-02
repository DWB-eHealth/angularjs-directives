var notInModule = angular.module('ui.notIn', []);

notInModule.directive('notIn', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            notIn: '=',
        },
        link: function(scope, elm, attrs, ctrl) {
            var thisValue;
            var otherValues;

            ctrl.$parsers.unshift(function(viewValue) {
                thisValue = viewValue.toLowerCase();
                validate();
                return thisValue;
            });

            var validate = function() {
                ctrl.$setValidity('isWithin', !scope.notIn.some(function(value) {
                    return value.toLowerCase() === thisValue.toLowerCase();
                }));
            };
        },
    };
});