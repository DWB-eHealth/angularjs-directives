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
        scope.leftList = [{
            name: 'foo',
            id: "1"
        }, {
            name: 'bar',
            id: "2"
        }, {
            name: 'for',
            id: "3"
        }, {
            name: 'each',
            id: "4"
        }];
        scope.rightList = [{
            name: 'abc',
            id: "6"
        }, {
            name: 'def',
            id: "7"
        }];
        scope.name = "name";
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

        expect(scope.rightList).toEqual([{
            name: 'abc',
            id: "6"
        }, {
            name: 'def',
            id: "7"
        }, {
            name: 'bar',
            id: "2"
        }, {
            name: 'for',
            id: '3'
        }]);
    });

    it('should shift selectedItems from right to left', function() {
        scope.rightSelectedItems = {
            'abc': true,
            'def': false
        };

        scope.moveToLeft();

        expect(scope.leftList).toEqual([{
            name: 'foo',
            id: '1'
        }, {
            name: 'bar',
            id: "2"
        }, {
            name: 'for',
            id: '3'
        }, {
            name: 'each',
            id: '4'
        }, {
            name: 'abc',
            id: '6'
        }]);
    });

    it('should shift all items from right to left', function() {
        scope.moveAllToLeft();
        expect(scope.leftList).toEqual([{
            name: 'foo',
            id: '1'
        }, {
            name: 'bar',
            id: "2"
        }, {
            name: 'for',
            id: '3'
        }, {
            name: 'each',
            id: '4'
        }, {
            name: 'abc',
            id: '6'
        }, {
            name: 'def',
            id: '7'
        }]);
    });

    it('should shift all items from left to right', function() {
        scope.moveAllToRight();

        expect(scope.rightList).toEqual([{
            name: 'abc',
            id: '6'
        }, {
            name: 'def',
            id: '7'
        }, {
            name: 'foo',
            id: '1'
        }, {
            name: 'bar',
            id: "2"
        }, {
            name: 'for',
            id: '3'
        }, {
            name: 'each',
            id: '4'
        }]);
    });
});