angular.module('notes-autosave-example.directives', ['ngSanitize']).
directive('contenteditable', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {

      // Write data to the model
      function read() {
        var html = element.html();
        ngModel.$setViewValue(html);
      }

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      element.on('keyup', function() {
        scope.$apply(read);
      });
    }
  };
});
/*
directive('contenteditable', ['$santize', function ($sanitize) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
           // Specify how UI should be updated
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            // Listen for change events to enable binding
            element.bind('blur keyup change', function () {
                scope.$apply(function () {
                    // Write data to the model
                    scope.$apply(ngModel.$setViewValue($sanitize(element.html())));
                });
            });
        }
    };
}]);
*/
