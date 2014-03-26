describe('multiselect', function() {
    var scope;
    var leftList;
    var rightList;

    beforeEach(module('ui.multiselect'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        $controller('MultiSelectController', {
            $scope: scope
        });
        scope.leftList = ['foo', 'bar', 'for', 'each'];
        scope.rightList = ['abc', 'def'];
    }));

    afterEach(function() {
        expect(scope.leftSelectedItems).toEqual({});
        expect(scope.rightSelectedItems).toEqual({});
    });

    it('should shift selectedItems from left to right', function() {
        scope.leftSelectedItems = {
            'bar': true,
            'for': true,
            'foo': false
        };

        scope.moveToRight();

        expect(scope.rightList).toEqual(['abc', 'def', 'bar', 'for']);
    });

    it('should shift selectedItems from right to left', function() {
        scope.rightSelectedItems = {
            'abc': true,
            'def': false
        };

        scope.moveToLeft();

        expect(scope.leftList).toEqual(['foo', 'bar', 'for', 'each', 'abc']);
    });

    it('should shift all items from right to left', function() {
        scope.moveAllToLeft();

        expect(scope.leftList).toEqual(['foo', 'bar', 'for', 'each', 'abc', 'def']);
    });

    it('should shift all items from left to right', function() {
        scope.moveAllToRight();

        expect(scope.rightList).toEqual(['abc', 'def', 'foo', 'bar', 'for', 'each']);
    });
});