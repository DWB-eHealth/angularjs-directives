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
            var today = moment();
            var currentYear = today.year();
            for (var i = startDate.year(); i <= currentYear; i++) {
                $scope.years.push(i);
            }
            defaultToCurrentWeek(currentYear);
        };

        var defaultToCurrentWeek = function(currentYear) {
            $scope.year = currentYear;
            $scope.populateMonths();
            $scope.populateWeeks();
            $scope.week = $scope.weeks[$scope.weeks.length - 1];
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
            var weekYear = m.isoWeekYear();
            var startOfWeek = m.startOf("isoWeek").toDate().toLocaleDateString();
            var endOfWeek = m.endOf("isoWeek").toDate().toLocaleDateString();
            return {
                'weekNumber': weekNumber,
                'weekYear': weekYear,
                'startOfWeek': startOfWeek,
                'endOfWeek': endOfWeek
            };
        };

        $scope.formatWeek = function(w) {
            return "W " + w.weekNumber + " - " + w.startOfWeek + " - " + w.endOfWeek;
        };

        $scope.populateWeeks = function() {
            $scope.weeks = [];
            if (!$scope.year || (!$scope.month && $scope.month !== 0)) {
                $scope.week = undefined;
                return;
            }
            var m = moment().year($scope.year).month($scope.month).date(1);

            while ((m.startOf("isoWeek").month() === $scope.month || m.endOf("isoWeek").month() === $scope.month) && m.startOf("isoWeek").isBefore(moment())) {
                $scope.weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }
            if (moment().year() === $scope.year && moment().month() === $scope.month)
                $scope.week = $scope.weeks[$scope.weeks.length - 1];
            else if ($scope.week && moment($scope.week.startOfWeek).month() !== $scope.month)
                $scope.week = undefined;
        };

        var findWeek = function(week) {
            for (i = 0; i < $scope.weeks.length; i++) {
                if ($scope.weeks[i].weekNumber === week.weekNumber)
                    return $scope.weeks[i];
            }
            return;
        };

        $scope.$watch('startDate', function() {
            init();
        });

        $scope.$watch('year', function() {
            $scope.populateMonths(false);
        });

        $scope.$watch('month', function() {
            $scope.populateWeeks();
        });

        $scope.$watch('week', function() {
            if ($scope.week)
                $scope.week = findWeek($scope.week);
        });

        $scope.$watch('language', function() {
            moment.locale($scope.language);
        });

        $scope.populateMonths = function(changedThruUI) {
            if (changedThruUI || !$scope.year) {
                $scope.month = undefined;
                $scope.week = undefined;
            }
            $scope.months = [];
            $scope.weeks = [];
            if (!$scope.year)
                return;
            if ($scope.year === moment().year()) {
                $scope.month = moment().month();
                $scope.months = generateMonths(0, $scope.month);
                $scope.populateWeeks();
            } else if ($scope.year === startDate.year())
                $scope.months = generateMonths(startDate.month());
            else
                $scope.months = generateMonths();
        };

        $scope.toDate = function(m) {
            return moment.monthsShort(m);
        };

        init();
    }
]);

weekselectorModule.directive('weekselector', function() {
    return {
        restrict: 'EA',
        scope: {
            'week': "=",
            'month': "=",
            'year': "=",
            'startDate': "=",
            'onChange': "&?",
            'labels': "=",
            'language': "="
        },
        templateUrl: 'js/lib/angularjs-directives/template/weekselector/weekselector.html',
        replace: true,
        controller: 'WeekSelectorController'
    };
});
