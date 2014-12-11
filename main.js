$(function() {

  // Add your Facebook App ID

	var app_id = 'YOUR APP ID';
	var scopes = 'email, user_friends, user_online_presence, publish_actions';

	var btn_login = '<a href="#" id="login" class="btn btn-primary">Log In</a>';

	var div_session = "<div id='facebook-session'>"+
					  "<strong></strong>"+
					  "<img>"+
					  "<a href='#' id='logout' class='btn btn-danger'>Logout</a>"+
					  "</div>";

	window.fbAsyncInit = function() {

	  	FB.init({
	    	appId      : app_id,
	    	status     : true,
	    	cookie     : true, 
	    	xfbml      : true, 
	    	version    : 'v2.1'
	  	});


	  	FB.getLoginStatus(function(response) {
	    	statusChangeCallback(response, function() {});
	  	});
  	};


  	var statusChangeCallback = function(response, callback) {
  		console.log(response);
   		
    	if (response.status === 'connected') {
      		getFacebookData();
    	} else {
     		callback(false);
    	}
  	}

  	var checkLoginState = function(callback) {
    	FB.getLoginStatus(function(response) {
      		callback(response);
    	});
  	}

    // Facebook login

    var facebookLogin = function() {
      checkLoginState(function(data) {
        if (data.status !== 'connected') {
          FB.login(function(response) {
            if (response.status === 'connected')
              getFacebookData();
          }, {scope: scopes});
        }
      })
    }

    // Facebook logout

    var facebookLogout = function() {
      checkLoginState(function(data) {
        if (data.status === 'connected') {
        FB.logout(function(response) {
          $('#facebook-session').before(btn_login);
          $('#facebook-session').remove();
        })
      }
      })

    }

    // Gets the Facebook users Object

  	var getFacebookData =  function() {
  		FB.api('/me', function(response) {
	  		$('#login').after(div_session);
	  		$('#login').remove();
	  		$('#facebook-session strong').text("Welcome: "+response.name);
	  		$('#facebook-session img').attr('src','http://graph.facebook.com/'+response.id+'/picture?type=large');

        // All the values the in the Facebook Object
        var dataObject = { 
          fb_id: response.id,
          email: response.email,
          birthday: response.birthday,
          first_name: response.first_name,
          gender: response.gender,
          last_name: response.last_name,
          link: response.link,
          location:response.location.name,
          locale: response.locale,
          name: response.name,
          timezone: response.timezone,
        };
          insertFacebookData(dataObject);
	  	});
  	}

    // Gets the Facebook pages Object

    var getPages = function(){
      FB.login(function (response){
        FB.api('/me/accounts',function(apiresponse){
          var data = apiresponse['data'];
          for(var i = 0; i < data.length; i++){
            var dataObject = { 
              page_id: data[i].id,
              page_name: data[i].name,
              page_access_token: data[i].access_token,
            };
          }
        });
      },{scope:'manage_pages, publish_actions'});
    }

    // Posts to Page as Page instead of user

    var postToPage = function(){

      // You must add the page ID;

      var page_id = 'PAGE ID' 
      FB.api('/' + page_id, {fields: 'access_token'}, function(resp) {
        if(resp.access_token) {
          FB.api('/' + page_id + '/feed',
            'post',
            { message: "I'm a Page!", access_token: resp.access_token }
            ,function(response) {
              console.log(response);
            });
        }
      });
    }


    $(document).on('click', '#login', function(e) {
      e.preventDefault();

      facebookLogin();
    })

    $(document).on('click', '#logout', function(e) {
      e.preventDefault();

      if (confirm("Are you sure?"))
        facebookLogout();
      else 
        return false;
    })

    $(document).on('click', '#pages', function(e) {
      e.preventDefault();

      getPages();
    })

    $(document).on('click', '#postToPage', function(e) {
      e.preventDefault();

      postToPage();
    })
})
