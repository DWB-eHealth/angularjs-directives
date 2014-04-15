var weekselectorModule = angular.module('ui.weekselector', []);

weekselectorModule.controller('WeekSelectorController', ['$scope',
    function($scope) {
        var startDate;
        var init = function() {
            $scope.onChange = $scope.onChange || function() {};
            $scope.weeks = [];
            $scope.years = [];
            $scope.months = [];
            $scope.startDate = $scope.startDate || "1900-01-01";
            startDate = moment(new Date($scope.startDate));
            for (var i = startDate.year(); i <= moment().year(); i++) {
                $scope.years.push(i);
            }
        };

        var generateMonths = function(startMonth, tillMonth) {
            var months = [];
            startMonth = startMonth || 0;
            tillMonth = tillMonth || 11;
            for (var i = startMonth; i <= tillMonth; i++)
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
            return "W " + w.weekNumber + " - " + w.startOfWeek + " - " + w.endOfWeek;
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
            if ($scope.year === moment().year()) {
                var currentMonth = moment().month();
                $scope.months = generateMonths(0, currentMonth);
                $scope.month = currentMonth;
            } else if ($scope.year === startDate.year())
                $scope.months = generateMonths(startDate.month());
            else
                $scope.months = generateMonths();
        };

        $scope.toDate = function(m) {
            return moment().month(m).toDate();
        };

        init();
    }
]);

weekselectorModule.directive('weekselector', function() {
    return {
        restrict: 'EA',
        scope: {
            'week': " = ",
            'month': " = ",
            'year': " = ",
            'startDate': "@",
            'onChange': " & ? "
        },
        templateUrl: 'js/lib/angularjs-directives/template/weekselector/weekselector.html',
        replace: true,
        controller: 'WeekSelectorController'
    };
});