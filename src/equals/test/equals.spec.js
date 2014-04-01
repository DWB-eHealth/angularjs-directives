describe('equals', function() {

    var $scope, compile, form;

    beforeEach(module('ui.equals'));
    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();
        compile = $compile;

        var element = angular.element(
            '<form name="form">' +
            '<input type="password" name="password" id="password" ng-model="user.password" required>' +
            '<input type="password" name="confPassword" id="confPassword" ng-model="user.confirmPassword" equals="{{ user.password }}" required>' +
            '</form>'
        );

        compile(element)($scope);
        $scope.$digest();
        form = $scope.form;
    }));

    it('should set invalid to true for different passwords', function() {
        form.password.$setViewValue('p@ss');
        form.confPassword.$setViewValue('p@sss');
        $scope.$digest();

        expect(form.confPassword.$invalid).toBe(true);
        expect(form.confPassword.$error.notEqual).toBe(true);
    });

    it('should set invalid to false for same passwords', function() {
        form.password.$setViewValue('p@ss');
        form.confPassword.$setViewValue('p@ss');
        $scope.$digest();

        expect(form.confPassword.$invalid).toBe(false);
        expect(form.confPassword.$error.notEqual).toBe(false);
    });
});