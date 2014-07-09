'use strict';
var generateToDoList = function(){
  var keys = Object.keys(localStorage);
  var allTableRows = "";
  keys.forEach(function(key){
    if(key!=="user") {
      allTableRows = allTableRows + generateTaskRow(JSON.parse(localStorage[key]));
    }
  });
  $("#task-container").append(allTableRows);
};

var generateId = (function() {
  var count = 0;
  return function() {
    count = count + 1;
    return count;
  }
} () );

var getTask = function(title) {
  return JSON.parse(localStorage[title]);
};

var updateTask = function(task) {
  localStorage[task.title] = JSON.stringify(task);
};

var generateTaskRow = function(task){
  var taksRowSource;
  task.id = generateId();
  if(task.starred === true) {
    taksRowSource = $("#task-row-starred").html();
  } else {
    taksRowSource = $("#task-row-unstarred").html();
  }
  var taskRowTemplate = Handlebars.compile(taksRowSource);
  return taskRowTemplate(task);
};

var getUsersInfo = function() {
  if ($("#username-box").val() !== "") {
    return {
      username : $("#username-box").val(),
      background : $("#background-box").val(),
      avatar : $("#avatar-box").val()
    };
  } else {return false;}
};

var changeTaskStarred =  function(task) {
  if(task.starred === true) {
    task.starred = false;
  } else {
    task.starred = true;
  }
  updateTask(task);
};

var getNewTask = function() {
  var title = $("#title-box").val();
  var deadline = $("#deadline-box").val();
  var description = $("#description-box").val();
  var starred;
  if($("#starred-box").is(":checked")){
    starred = true;
  } else {starred = false}
  return {
    "title" : title,
    "deadline" : deadline,
    "description" : description,
    "starred" : starred
  };
};

var loadUser = function() {
  var userDivSource = $("#user-template").html();
  var userDivTemplate = Handlebars.compile(userDivSource);
  $("#user-container").empty();
  $("#user-container").append(userDivTemplate(JSON.parse(localStorage.user)));
  $("#body").css("background-color", JSON.parse(localStorage.user).background);
};

$(document).ready(function(){
  generateToDoList();
  loadUser();

  $(document).on("click", ".starrer", function() {
    var title = $(this).parent().parent().attr("data-taskTitle");
    changeTaskStarred(getTask(title));
    $(this).parent().parent().replaceWith(generateTaskRow(getTask(title)));
  });

  $("#submit-task").on("click", function(){
    var newTask = getNewTask();
    $("#task-container").append(generateTaskRow(newTask))
    localStorage.setItem(newTask.title, JSON.stringify(newTask));
  });

  $("#submit-user").on("click", function(){
    if (user === false) {
      alert("Please enter correct values in the fields!");
    } else {
      localStorage.user = JSON.stringify(user);
    }
    loadUser();
  });

  $(".task-table").tableDnD();
});
