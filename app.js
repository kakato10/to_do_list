'use strict';
var generateToDoList = function(){
  var keys = Object.keys(localStorage);
  console.log(localStorage[keys[0]]);
  var allTableRows = "";
  keys.forEach(function(key){
    if(key!=="user") {
      allTableRows = allTableRows + generateTaskRow(JSON.parse(localStorage[key]));
    }
  });
  $("#task-container").append(allTableRows);
};

var getTask = function(title) {
  return JSON.parse(localStorage[title]);
};

var updateTask = function(task) {
  localStorage[task.title] = JSON.stringify(task);
};

var generateTaskRow = function(task){
  var taksRowSource;
  console.log(task.starred);
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
  console.log(userDivTemplate(JSON.parse(localStorage.user)));
  $("#user-container").append(userDivTemplate(JSON.parse(localStorage.user)));
};

$(document).ready(function(){
  generateToDoList();
  loadUser();
  $("#add-task").on("click", function(){
    $(this.data("target")).modal("show");
  });

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
    alert("lqlql");
    var user = getUsersInfo();
    if (user === false) {
      alert("Please enter correct values in the fields!");
    } else {
      localStorage.user = JSON.stringify(user);
    }
    loadUser();
  });

});
