var notInModule = angular.module('ui.notIn', []);

notInModule.directive('notIn', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var thisValue;
            var otherValues;

            attrs.$observe('notIn', function(values) {
                otherValues = angular.fromJson(values);
                validate();
            });

            ctrl.$parsers.unshift(function(viewValue) {
                thisValue = viewValue.toLowerCase();
                validate();
                return thisValue;
            });

            var validate = function() {
                ctrl.$setValidity('isWithin', !otherValues.some(function(value) {
                    if (thisValue !== undefined)
                        return value.toLowerCase() === thisValue.toLowerCase();
                }));
            };
        },
    };
});