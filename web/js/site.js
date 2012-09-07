var courses = [];

var resetAllFields = function() {
  $("#tab2_nom").text("Non disponible");
  $("#tab2_date").text("Non disponible");
  $("#tab2_lieu").text("Non disponible");
  $("#tab2_ponderation").text("Non disponible");
  $("#tab2_docs").text("Non disponible");
  $("#tab2_team").text("Non disponible");

  $("#tab2_moyenne").text("Non disponible");
  $("#tab2_count").text("Non disponible");
  $("#tab2_derivation").text("Non disponible");
  $("#tab2_maximum").text("Non disponible");
  $("#tab2_minimum").text("Non disponible");
  $("#tab2_median").text("Non disponible");

  $("#tab1_description").text("Non disponible");
  $("#tab1_nrc").text("Non disponible");
  $("#tab1_number").text("Non disponible");
  $("#tab1_count").text("Non disponible");
  $("#tab1_email").text("Non disponible");
  $("#tab1_teacher").text("Non disponible");
  $("#tab1_helper").text("Non disponible");
  $("#tab1_plan").text("Non disponible");
  $("#tab1_web").text("Non disponible");
};

var loadCourse = function(id) {
  for(var i in courses) {
    if(courses[i]._id == id) {
// Display the course
$("#myModalLabel").text(courses[i].title);
console.log(courses[i])
$("#dpmExamens").empty();
$("#dpmTravaux").empty();
resetAllFields();
$("#tab1_description").text(courses[i].description);
$("#tab1_nrc").text(courses[i].nrc);
$("#tab1_number").text(courses[i].number);
$("#tab1_count").text(courses[i].count);
$("#tab1_email").text(courses[i].mails);
$("#tab1_email").attr("hef", "mailto:" + courses[i].mails);
$("#tab1_teacher").text(courses[i].teachers);
$("#tab1_helper").text(courses[i].helpers);
$("#tab1_plan").text(courses[i].plan);
$("#tab1_plan").attr("href", courses[i].plan);
$("#tab1_web").text(courses[i].website);
$("#tab1_web").attr("href", courses[i].website);

if(courses[i].session) {
  var time = courses[i].session.toString().substring(4);
  if(time === '01') time = "Hiver";
  if(time === '05') time = "Été";
  if(time === '09') time = "Automne";
  $("#tab1_session").text(time + " " + courses[i].session.toString().substring(0,4));
}
else {
  $("#tab1_session").text("Non déterminé");
}


for(var e in courses[i].exams) {
// Add the exam
var exam = $('<li exam="' + i + '" index="' + e + '"><a href="#tab2" data-toggle="tab">' + courses[i].exams[e].title + '</a></li>');

$(exam).click(function() {
  resetAllFields();
  var offset = $(this).attr("exam");
  var index = $(this).attr("index");
  var _exam = courses[offset].exams[index];

  $("#tab2_nom").text(_exam.title);
  $("#tab2_date").text(_exam.date + ' / ' + _exam.time);
  $("#tab2_lieu").text(_exam.place);
  $("#tab2_ponderation").text(_exam.ponderation);
  $("#tab2_docs").text(_exam.docs);

  $("#tab2_moyenne").text(_exam.results.average);
  $("#tab2_count").text(_exam.results.count);
  $("#tab2_derivation").text(_exam.results.derivation);
  $("#tab2_maximum").text(_exam.results.maximum);
  $("#tab2_minimum").text(_exam.results.minimum);
  $("#tab2_median").text(_exam.results.mediane);

});

$("#dpmExamens").append(exam);
}

for(var e in courses[i].homeworks) {
// Add the exam
var exam = $('<li hw="' + i + '" index="' + e + '"><a href="#tab2" data-toggle="tab">' + courses[i].homeworks[e].title + '</a></li>');

$(exam).click(function() {
  resetAllFields();
  var offset = $(this).attr("hw");
  var index = $(this).attr("index");
  var _exam = courses[offset].homeworks[index];

  $("#tab2_nom").text(_exam.title);
  $("#tab2_date").text(_exam.date);
  $("#tab2_lieu").text("--");
  $("#tab2_ponderation").text(_exam.ponderation);
  $("#tab2_docs").text("--");
  $("#tab2_team").text(_exam.team);

  $("#tab2_moyenne").text(_exam.results.average);
  $("#tab2_count").text(_exam.results.count);
  $("#tab2_derivation").text(_exam.results.derivation);
  $("#tab2_maximum").text(_exam.results.maximum);
  $("#tab2_minimum").text(_exam.results.minimum);
  $("#tab2_median").text(_exam.results.mediane);

});

$("#dpmTravaux").append(exam);
}



}
}
}

$(document).ready(function() {

  $("#tooMuchResults").hide();
  $("#myModal").hide();

  window.visualSearch = VS.init({
    container  : $('#search_box_container'),
    query      : 'Titre: "Ingénieur"',
    unquotable : [
    'text',
    'account',
    'filter',
    'access'
    ],
    callbacks  : {
      search : function(query, searchCollection) {
        var $query = $('#search_query');
        $query.stop().animate({opacity : 1}, {duration: 300, queue: false});
        $query.html('<span class="raquo">&raquo;</span> Vous recherchez pour: <b>' + searchCollection.serialize() + '</b>');

        console.log(searchCollection.serialize());

        $("#tooMuchResults").hide(1000);

        $.ajax(
        {
          type: "POST", 
          url: 'http://ec2-50-112-64-221.us-west-2.compute.amazonaws.com:8080/title?title=' + searchCollection.serialize(),
          dataType: 'json',
          data: {NRC:10265},
          error: function(e, a) {console.log("ERROR"); console.log(e);} ,
          success: function(e) {

            if(e.length >= 25) {
              $("#tooMuchResults").show(500);
            }

            courses = e;

            $("#table_container").empty();

            $("#table_container").append('<table class="table table-hover" id="courses_table"><thead><tr><th>NRC</th><th>Numéro du cours</th><th>Titre du cours</th><th>Professeur</th><th>Session</th><th>Actions</th></tr></thead><tbody>');

            $.each(e, function() {
              var row = '<tr><td>' + this.nrc + '</td><td>' + this.number + '</td><td>' + this.title + '</td><td>' + this.teachers + '</td><td>' + this.session + '</td><td><a class="btn btn-small" href="#myModal" data-toggle="modal" onclick="' + "javascript:loadCourse('" + this._id + "');" + '"><i class="icon-signal"></i></a></td></tr>';

              $("#courses_table").append(row);


            });

            $("#courses_table").append("</tbody></table>");

          }
        });

clearTimeout(window.queryHideDelay);
window.queryHideDelay = setTimeout(function() {
  $query.animate({
    opacity : 0
  }, {
    duration: 1000,
    queue: false
  });
}, 2000);
},
valueMatches : function(category, searchTerm, callback) {
  switch (category) {
    case 'NRC':
    callback([
// TODO Callback
]);
    break;
    case 'Année':
    callback([
      "2009", "2010", "2011", "2012"
      ])
    break;
    case 'Session':
    callback([
      { value: '01',  label: 'Hiver' },
      { value: '05',  label: 'Été' },
      { value: '09',  label: 'Automne' }
      ]);
    break
    case 'Programme':
    callback([
      "GIF", "GEL", "GLO", "GMN"
      ], {preserveOrder: true});
    break;
  }
},
facetMatches : function(callback) {
  callback([
    'NRC', 'Titre', 'Numéro', 'Professeur','Année', 'Session', 'Programme'
    ]);
}
}
});
});

console.log(window.visualSearch);
