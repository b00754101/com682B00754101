IUPS = "https://prod-14.eastus.logic.azure.com:443/workflows/c7930ce811274db4b608c30930634e95/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ExDC4B9_ibCuL0kevYEsUmyBRlD7rgoInROMSGsD1Vc"; //upload image
RAI = "https://prod-89.eastus.logic.azure.com:443/workflows/5eaf7a787f294a869c0511798fd08412/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8TqGEz8KEIQ515eR1Z5Lwv-XUAjd3hJEjOLsb9dGSJQ"; //retrieve all images
CU = "https://prod-84.eastus.logic.azure.com:443/workflows/5b8c6af3baaa4509b431aa04b6a68a8b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8Ybi5GqcOO8CDqQti11CoZ3_LqRy6fAsehBmILwxJt8"; //create user
GU = "https://prod-04.eastus.logic.azure.com:443/workflows/7e5e5ff87b4e44099b6125f1bd12c36c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QjpGw6HYl0LhQjd0G3kiNJ2IQ_4Fg0-0VcHKM1ij8aE"; //get users

BLOB_ACCOUNT = "https://blobstoragecom682cd.blob.core.windows.net";

USERID = 0;
USERNAME = "";


D1 = "https://prod-06.eastus.logic.azure.com/workflows/eae7c077695445efad209f2519023592/triggers/manual/paths/invoke/"; //delete url split
D2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7iwpVhROlGJ_3flmGf4-E-qr5k8NY9yqv4qvWAnZaPw";

G1 = "https://prod-29.eastus.logic.azure.com/workflows/d97fdf85565c441796d63a18d3e37a57/triggers/manual/paths/invoke/"; //get individual url split
G2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4YcVqrrunbG5xr4TLZV0YY3f41b87QHnhT3EVISpPe8";

E1 = "https://prod-16.eastus.logic.azure.com/workflows/6db545b353c24be3a39312036e1519f4/triggers/manual/paths/invoke/"; //edit url split
E2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gi8N_p08_1JPobRNRZcu-5uDzVjWzKEwwIKyMancz88";

$(document).ready(function() {
    getMedia();

  $("#retImages").click(function(){

      getMedia();

  });

  $("#subImage").click(function(){

    submitMedia();
    
  });

  $("#editMedia").click(function(){

      editMedia(val["id"]);

  });


  $("#login").click(function(){

    login();

  });

  $("#logout").click(function () {

    logout();

  });

  $("#register").click(function(){

    register();

  });

});

function register(){
 registerData = new FormData();

 registerData.append('userName', $('#username').val());
 registerData.append('password', $('#password').val());

 $.ajax({
 url: CU,
 data: registerData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(user){}
 });
}

function logout() {
  USERID = 0;
  USERNAME = "";
  $("#login").toggle();
  $("#submitForm").toggle();
  $("#logout").toggle();
}

function login() {
  $.getJSON(GU, function (user) {
    loggedIn=false;
    $.each(user, function (key, val) {
      username = $("#username").val();
      password = $("#password").val();
      if (val["userName"] == username && val["password"] == password) {

        loggedIn = true;
        USERID = val["userID"];
        USERNAME = val["userName"];
        alert("logged in");
        $("#login").toggle();
        $("#submitForm").toggle();
        $("#logout").toggle();
      }
    });
  });
}

function submitMedia(){

 //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('FileName', $('#FileName').val());
 submitData.append('userID', USERID);
 submitData.append('userName', USERNAME);
 submitData.append('File', $("#UpFile")[0].files[0]);
 submitData.append('type', $("#UpFile")[0].files.item(0).type);

 $.ajax({
 url: IUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){

 }
 });

 getMedia();

}

function getMedia(){

 $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
 $.getJSON(RAI, function( data ) {

 var items = [];

 $.each( data, function( key, val ) {
    items.push( "<hr />");
    items.push("<h1>" +val["type"] + "</h1>");
    if (val["type"] == 'video/mp4')
    {
    items.push("<video controls><source src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400' type='video/mp4'></video> <br />");
    }
    else if (val["type"] == 'audio/mpeg')
    {
    items.push("<audio controls> <source src='"+BLOB_ACCOUNT + val["filePath"] +"' type='audio/mpeg'> </audio>")
    }
    else {
    items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />");
    }
    items.push( "File : " + val["fileName"] + "<br />");
    items.push( "Uploaded by: user id: "+ val["userID"] +"<br />");
    items.push('<button onclick="deleteMedia(\''+val["id"]+'\')" type="button" class="btn btn-danger">Delete Media</button><br />');
    items.push('<button onclick="editMedia(\''+val["id"]+'\')" type="button" class="btn btn-primary">Edit Media</button><br />');
    });
    $('#ImageList').empty();
    $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
    }).appendTo( "#ImageList" );
    });

}

function deleteMedia(id){
    $.ajax({
        type:"DELETE",
        url: D1 + id + D2
    })
    alert("Media deleted")
    getMedia();
}

function editMedia(id) {
    alert("updating");

    editData = new FormData();


    editData.append('FileName', $('#FileName').val());
    editData.append('userID', USERID);
    editData.append('userName', USERNAME);
    editData.append('File', $("#UpFile")[0].files[0]);
    editData.append('type', $("#UpFile")[0].files.item(0).type);



    $.ajax({
        url: E1 + id + E2,
        data: editData,
        cache: false,
        enctype: 'multipart/form-data',
        contentType: false,
        processData: false,
        type: 'PUT',
        success: function (data) {
        }
    });
    getMedia();
    alert("updated");

}



