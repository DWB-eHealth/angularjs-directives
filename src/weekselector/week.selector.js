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

            while ((m.startOf("isoWeek").month() === $scope.month || m.endOf("isoWeek").month() === $scope.month) && m.startOf("isoWeek").isBefore(moment())) {
                $scope.weeks.push(getWeek(m));
                m.isoWeek(m.isoWeek() + 1);
            }
            if (moment().year() === $scope.year && moment().month() === $scope.month)
                $scope.week = $scope.weeks[$scope.weeks.length - 1];
        };

        $scope.$watch('startDate', function() {
            init();
        });

        $scope.$watch('language', function() {
            moment.lang($scope.language);
        });

        $scope.populateMonths = function() {
            $scope.month = undefined;
            $scope.week = undefined;
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