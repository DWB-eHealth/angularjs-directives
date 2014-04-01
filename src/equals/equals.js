var equalsModule = angular.module('ui.equals', []);

equalsModule.directive('equals', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var thisValue;
            var otherValue;

            attrs.$observe('equals', function(value) {
                otherValue = value;
                validate();
            });

            ctrl.$parsers.unshift(function(viewValue) {
                thisValue = viewValue;
                validate();
                return thisValue;
            });

            var validate = function() {
                ctrl.$setValidity('notEqual', thisValue === otherValue);
            };
        },
    };
});