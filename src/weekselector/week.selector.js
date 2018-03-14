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
            var year = today.year();
            var ifEPIWeekFallInNextYear = today.startOf("isoWeek").year() != today.endOf("isoWeek").year();
            var ifEPIWeekFallInNextMonth = today.daysInMonth() - today.startOf("isoWeek").date() < 3;
            if (ifEPIWeekFallInNextYear && ifEPIWeekFallInNextMonth) {
              year = today.endOf("isoWeek").year();
            }

            for (var i = startDate.year(); i <= year; i++) {
                $scope.years.push(i);
            }
            defaultToCurrentWeek(moment().year());
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
            var startOfWeekForDisplay = m.startOf("isoWeek").toDate().toLocaleDateString();
            var endOfWeekForDisplay = m.endOf("isoWeek").toDate().toLocaleDateString();
            var startOfWeek = m.startOf("isoWeek").format("YYYY-MM-DD");
            var endOfWeek = m.endOf("isoWeek").format("YYYY-MM-DD");
            return {
                'weekNumber': weekNumber,
                'weekYear': weekYear,
                'startOfWeek': startOfWeek,
                'startOfWeekForDisplay': startOfWeekForDisplay,
                'endOfWeekForDisplay': endOfWeekForDisplay,
                'endOfWeek': endOfWeek
            };
        };

        $scope.formatWeek = function(w) {
            return "W " + w.weekNumber + " - " + w.startOfWeekForDisplay + " - " + w.endOfWeekForDisplay;
        };

        $scope.populateWeeks = function() {
            $scope.weeks = [];
            if (!$scope.year || (!$scope.month && $scope.month !== 0)) {
                $scope.week = undefined;
                return;
            }
            var m = moment().year($scope.year).month($scope.month).date(1);

            var firstDayOfMonth = m.day();
            var addLastWeekToCurrentMonth = firstDayOfMonth === 2 || firstDayOfMonth === 3 || firstDayOfMonth === 4;

            if(addLastWeekToCurrentMonth && m.startOf("isoWeek").isBefore(moment())) {
                $scope.weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }

            if(m.startOf("isoWeek").month() !== $scope.month) {
                m.isoWeek(m.isoWeek() + 1);
            }

            while ((m.startOf("isoWeek").month() === $scope.month) && (m.daysInMonth() - m.startOf("isoWeek").date() > 2) && m.startOf("isoWeek").isBefore(moment())) {
                $scope.weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }
            if (moment().year() === $scope.year && moment().month() === $scope.month)
                $scope.week = $scope.weeks[$scope.weeks.length - 1];
        };

        var findWeek = function(week) {
            for (i = 0; i < $scope.weeks.length; i++) {
                if ($scope.weeks[i].weekNumber === week.weekNumber)
                    return $scope.weeks[i];
            }
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
            return moment.localeData($scope.locale).monthsShort(moment({ month :m }), m);
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
            'locale': "="
        },
        templateUrl: 'js/lib/angularjs-directives/template/weekselector/weekselector.html',
        replace: true,
        controller: 'WeekSelectorController'
    };
});
