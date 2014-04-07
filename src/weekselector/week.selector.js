var weekselectorModule = angular.module('ui.weekselector', []);

weekselectorModule.controller('WeekSelectorController', ['$scope',
    function($scope) {
        $scope.weeks = [];
        $scope.years = [];
        $scope.months = [];
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

        $scope.populateWeeks = function() {
            $scope.week = undefined;
            $scope.weeks = [];
            if (!$scope.year || (!$scope.month && $scope.month !== 0)) return;
            var m = moment().year($scope.year).month($scope.month).date(1);

            while ((m.startOf("isoWeek").month() === $scope.month || m.endOf("isoWeek").month() === $scope.month) && m.endOf("isoWeek").isBefore(moment())) {
                $scope.weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }
        };

        $scope.populateMonths = function() {
            $scope.month = undefined;
            $scope.week = undefined;
            $scope.months = [];
            $scope.weeks = [];
            if (!$scope.year)
                return;
            $scope.months = $scope.year === moment().year() ? generateMonths(moment().month()) : generateMonths();
        };

    $scope.toDate = function(m) {
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