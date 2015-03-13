(function(){
  var app = angular.module('services',[]);

  app.factory('DAL', function(){
    
    var dal = {};           // service objects, store all services, using in controllers

    var _object_store = {}; // store link to database obectStores

    var contentTask = [];   // store all tasks

    // open to-do list database
    dal.open = function(callback) {

      var request = indexedDB.open("todoDB");

      request.onupgradeneeded = function(e) {
        var db = e.target.result;

        if(db.objectStoreNames.contains("tableTasks")) {
          db.deleteObjectStore("tableTasks");
        };

        _object_store = db.createObjectStore("tableTasks",{keyPath: "timeStamp"});
        _object_store = db.createObjectStore("tableLists",{keyPath: "parentList"});
      };

      request.onsuccess = function(e) {
        _object_store = e.target.result;
        console.log("success open_1"); 
        callback();
      };

      request.onerror = function(e){
        console.log("Error on database_1 opening", e);
      };
  
    };

    // add new todo list to database
    dal.writeList = function(list) {
      var request = _object_store.transaction(["tableLists"], "readwrite").objectStore("tableLists").put(list);

      request.onsuccess = function(e) {
        console.log("Success during list adding");
      };

      request.onerror = function(e) {
        console.log("Error on list adding: ", e);
      };

    };

    // add new task to database
    dal.writeTask = function(task) {
      var request = _object_store.transaction(["tableTasks"], "readwrite").objectStore("tableTasks").put(task);

      request.onsuccess = function(e) {
        console.log("Success during task adding");
      };

      request.onerror = function(e) {
        console.log("Error on task adding: ", e);
      };

    };

    // delete todo list from database
    dal.deleteList = function(list) {
      var requestList = _object_store.transaction(["tableLists"], "readwrite").objectStore("tableLists").delete(list);

      requestList.onsuccess = function(e) {
        console.log("success during list deleting");
      };

      requestList.onerror = function(e) {
        console.log("Error on list deleting: ", e);
      };

      for (var i = 0; i < contentTask.length; i++) {
        if (contentTask[i].parentList == list) {
          var task = contentTask[i].timeStamp;
          this.deleteTask(task);
        };
      };

    };

    // delete task from database for specified todo list
    dal.deleteTask = function(task) {
      var request = _object_store.transaction(["tableTasks"], "readwrite").objectStore("tableTasks").delete(task);

      request.onsuccess = function(e) {
        console.log("success during task deleting");
      };

      request.onerror = function(e) {
        console.log("Error on task deleting: ", e);
      };

    };

    // read all todo lists from database
    dal.readLists = function(callback) {   
      var transList = _object_store.transaction(["tableLists"], "readwrite");   
      var store = transList.objectStore("tableLists");
      var contentList = [];
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequestList = store.openCursor(keyRange);

      cursorRequestList.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false){
          console.log("false list cursor, reading complete");
          callback(contentList);
          return;
        };
        contentList.push(result.value);
        result.continue();
      };      
 
      cursorRequestList.onerror = function(e) {
        console.log("Error on tasks reading");
      }; 

    };

    // read all tasks for all todo lists from database
    dal.readTasks = function(callback) {   
      var transTask = _object_store.transaction(["tableTasks"], "readwrite").objectStore("tableTasks");   
      contentTask = [];
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequestTask = transTask.openCursor(keyRange);

      cursorRequestTask.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false){
          console.log("false task cursor:read complete");
          callback(contentTask);
          return;
        };
        contentTask.push(result.value);
        result.continue();
      };      
 
      cursorRequestTask.onerror = function(e) {
        console.log("Error on tasks reading");
      }; 

    };

    // update task checkbox value
    dal.taskUpdate = function(task) {
      var trans = _object_store.transaction(["tableTasks"], "readwrite");
      var store = trans.objectStore("tableTasks");
      var request = store.put(task);
    };

    return dal;

  });

})();
