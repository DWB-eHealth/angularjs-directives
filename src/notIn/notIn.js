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
                isValid = doesNotContain(viewValue, scope.notIn);
                ctrl.$setValidity('isWithin', isValid);
                return viewValue;
            });

            var doesNotContain = function(needle, haystack) {
                return !haystack.some(function(value) {
                    return value.toLowerCase() === needle.toLowerCase();
                });
            };
        },
    };
});