describe('notIn', function() {
    var $scope, compile, form;

    beforeEach(module('ui.notIn'));
    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();
        compile = $compile;

        var element = angular.element(
            '<form name="form">' +
            '<input type="text" name="projectName" id="projectName" ng-model="project.name" required not-in="{{existingProjects}}"/>' +
            '</form>'
        );

        compile(element)($scope);
        $scope.existingProjects = ["prj A", "prj B", "prj C"];
        $scope.$apply();
        form = $scope.form;
    }));

    it('should invalidate if value present in list', function() {
        form.projectName.$setViewValue('PRJ a');
        $scope.$apply();

        expect(form.projectName.$invalid).toBe(true);
        expect(form.projectName.$error.isWithin).toBe(true);
    });

    it('should validate if value not present in list', function() {
        form.projectName.$setViewValue('prj D');
        $scope.$apply();

        expect(form.projectName.$invalid).toBe(false);
        expect(form.projectName.$error.isWithin).toBe(false);
    });

});