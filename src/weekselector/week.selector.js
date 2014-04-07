var weekselectorModule = angular.module('ui.weekselector', []);

weekselectorModule.controller('WeekSelectorController', ['$scope',
    function($scope) {
        $scope.weeks = [];
        $scope.years = [];
        $scope.startYear = $scope.startYear || 1900;
        for (var i = $scope.startYear; i <= moment().year(); i++) {
            $scope.years.push(i);
        }

        var generateMonths = function(tillMonth) {
            var months = [];
            tillMonth = tillMonth || 11;
            for (var i = 0; i <= tillMonth; i++)
                months.push(i);
            return months;
        };

        var getWeek = function(m) {
            var weekNumber = m.isoWeek();
            var startOfWeek = m.startOf("isoWeek").format("YYYY-MM-DD");
            var endOfWeek = m.endOf("isoWeek").format("YYYY-MM-DD");
            return {
                'weekNumber': weekNumber,
                'startOfWeek': startOfWeek,
                'endOfWeek': endOfWeek
            };
        };

        $scope.formatWeek = function(w) {
            return "W" + w.weekNumber + " - " + w.startOfWeek + " - " + w.endOfWeek;
        };

        $scope.getWeeks = function() {
            if (!$scope.year || $scope.month === undefined) return [];
            var m = moment().year($scope.year).month($scope.month).date(1);
            var weeks = [];

            while (m.startOf("isoWeek").month() === $scope.month || m.endOf("isoWeek").month() === $scope.month) {
                weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }

            return weeks;
        };

        $scope.getMonths = function() {
            if (!$scope.year) return [];
            return $scope.year === moment().year() ? generateMonths(moment().month()) : generateMonths();
        };

        $scope.getDate = function(m) {
            return moment().month(m).toDate();
        };
    }
]);

weekselectorModule.directive('weekselector', function() {
    return {
        restrict: 'EA',
        scope: {
            week: "=",
            month: "=",
            year: "=",
            startYear: "@"
        },
        templateUrl: 'js/lib/angularjs-directives/template/weekselector/weekselector.html',
        replace: true,
        controller: 'WeekSelectorController'
    };
});