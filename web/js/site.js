var courses = [];

var loadCourse = function(id) {
  for(var i in courses) {
    if(courses[i]._id == id) {
// Display the course
$("#myModalLabel").text(courses[i].title);
console.log(courses[i])
$("#dpmExamens").empty();
$("#dpmTravaux").empty();

for(var e in courses[i].exams) {
// Add the exam
var exam = $('<li><a href="#">' + courses[i].exams[e].title + '</a></li>');
$("#dpmExamens").append(exam);
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
