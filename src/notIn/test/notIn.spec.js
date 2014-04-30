xdescribe('notIn', function() {
    var $scope, compile, form;

    beforeEach(module('ui.notIn'));
    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();
        compile = $compile;

        var element = angular.element(
            '<form name="form">' +
            '<input type="text" name="projectName" id="projectName" ng-model="project.name" not-in="{{existingProjects}}" required>' +
            '</form>'
        );

        compile(element)($scope);
        $scope.existingProjects = ["prj A", "prj B", "prj C"];
        $scope.$digest();
        form = $scope.form;
    }));

    it('should set invalid to true if existingProjects contains specified value', function() {
        form.projectName.$setViewValue('PRJ a');
        $scope.$digest();

        expect(form.projectName.$invalid).toBe(true);
        expect(form.projectName.$error.isWithin).toBe(true);
    });

    it('should set invalid to false if existingProjects does not contain specified value', function() {
        form.projectName.$setViewValue('prj D');
        $scope.$digest();

        expect(form.projectName.$invalid).toBe(false);
        expect(form.projectName.$error.isWithin).toBe(false);
    });

});