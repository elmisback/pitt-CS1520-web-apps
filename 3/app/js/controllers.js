'use strict';

function tryCache(options, fn) {
  if (!options.data.notes) {
    options.$http.post('/server/index')
    .success(function (notes) {
      options.data.notes = notes;
      fn();
    });
  } else {
      fn();
  }
}

function doIndex($http, $scope, $location, $route, data) {
  tryCache({'$http': $http, 'data': data}, function () {
    $scope.notes = data.notes;
    $scope.delete = function(note) {
      $http.post('/server/delete', {'noteId': note.noteId})
      .success(function () {
        for (var i = 0; i < data.notes.length; i ++) {
          if (data.notes[i].noteId === note.noteId) {
            data.notes.splice(i, 1);
            break;
          }
        }
        note.deleted = true;
      });
    }
    $scope.add = function() {
      $http.post('/server/add')
      .success(function (note) {
        data.notes.splice(0, 0, note);
        //$scope.notes.splice(0, 0, note);
        //data.notes.push(note);
        $location.path('/edit/' + note.noteId);
      });
    }
    $scope.go = function(path) {
      $location.path(path);
    }
    $scope.localTime = function (date) {
      return moment(moment.utc(date).toDate()).format('MM/DD/YY [at] HH:mm');
    }
    $scope.getDate = function (note) {
      return moment.utc(note.date)
    }
  });
}

function doEdit($http, $scope, $routeParams, data) {
  tryCache({'$http': $http,
            '$scope': $scope,
            '$routeParams': $routeParams,
            'data': data}, function () {
    for (var i = 0; i < data.notes.length; i ++) {
      if (data.notes[i].noteId === $routeParams.noteId) {
        $scope.note = data.notes[i];
        break;
      }
    }

    var editor_conf = {theme: 'solarized_light', mode: 'text'};
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + editor_conf.theme);
    var session = editor.getSession();
    session.setMode("ace/mode/" + editor_conf.mode);

    session.setValue($scope.note.text);
    var doc = session.getDocument();

    var oldTitle = $scope.note.title;
    var title = oldTitle;

    var save = function () {
      console.log("Saving!");
      title = $scope.note.title;
      $scope.note.text = doc.getAllLines().join('\n');
      $scope.note.date = moment().utc();
      $http.post('/server/save', $scope.note);
    }

    $scope.updateTitle = function (title) {
      save();
    }
    doc.on('change', function (e) {
      save();
    });

    $scope.save = save;
    save();
    // If we wanted to make it save on a timer...
    /*setInterval(function () {
    title = $scope.note.title;
    //console.log(changed);
    if (changed || oldTitle != title) {
      var text = doc.getAllLines();
      $http.post('/server/save', {'text': text, 'noteId': $scope.note.noteId,
                                  'title': title});
      oldTitle = title;
      changed = false;
    }
    }, 4000); */
  });
};

angular.module('notes-autosave-example.controllers', [])
  .controller('MainCtrl', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    $http.post('/server/logout').
      success(function (response) {
        $scope.logout_url = response.logout_url;
    });
  }])
  .controller('IndexCtrl', ['$http', '$scope', '$location', '$route', 'data', doIndex])
  .controller('EditCtrl', ['$http', '$scope', '$routeParams', 'data', doEdit])
