var password_prompt = false;
var selected_user = null;
var time_remaining = 0;
var session = lightdm.session;

function show_prompt(text) {
   password_prompt = true;

   $('tr.password').insertAfter('[data-id="'+selected_user+'"]').slideDown('slow');

   $('tr.password .input').focus();
}

function show_message(text) {
   var table = $('#message_table');
   var label = $('#message_label');
   label.html(text);
   if (text.length > 0)
       table.css('display',"table");
   else
       table.css('display',"none");
}

function show_error(text) {
   show_message (text);
}

function reset() {
   var table = $('#password_table');
   table.css('display',"none");
   password_prompt = false;
}

var loading_text = '';

function throbber() {
   loading_text += '.';
   if (loading_text == '....')
       loading_text = '.'
   var label = $('#countdown_label');
   label.html(loading_text);
   setTimeout(throbber, 1000);
}

function authentication_complete() {
   if (lightdm.is_authenticated) {
       lightdm.login (lightdm.authentication_user, session);
   } else {
       show_message ("Authentication Failed");
   }

   reset ();
   setTimeout(throbber, 1000);
}

function timed_login(user) {
   lightdm.login (lightdm.timed_login_user);
   setTimeout(throbber, 1000);
}

function start_authentication(username) {
   lightdm.cancel_timed_login ();
   $('#user_table tr').removeClass('active');

   show_message("");
   if (!password_prompt) {
       selected_user = username;
       lightdm.start_authentication(username);
   }
}

function cancel_authentication() {
    lightdm.cancel_authentication();
    password_prompt = false;
}

function provide_secret() {
   var entry = $('#password_entry');
   lightdm.provide_secret(entry.val());
}

function countdown() {
   var label = $('.active .countdown');
   label.html(time_remaining);
   time_remaining--;
   if (time_remaining >= 0)
       setTimeout(countdown, 1000);
}

$(function(){
    if(lightdm.can_shutdown) {
        $('#shutdown').addClass('can');
    }
    
    $('#shutdown').click(lightdm.shutdown);
    
    var user_template = new t($('#user-template').html());
    
    for(i in lightdm.users.reverse()) {
        var user = lightdm.users[i];
        $('#user_table').prepend(user_template.render({
            id: user.name,
            name: user.display_name,
            image: user.image,
            logged_in: user.logged_in
        }));
    }
    
    var session_template = new t($('#session-template').html());
    
    for(i in lightdm.sessions) {
        var sess = lightdm.sessions[i];
        
        var image;
        switch(sess.key){
            case 'gnome':
                image = "gnome.png";
                break;
            default:
                image = "default.png";
                break;
        }
        
        $('#session_table').prepend(session_template.render({
            id: sess.key,
            name: sess.name,
            comment: sess.comment,
            image: image
        }));
    }
    
    $('#session_table .session[data-id="'+ lightdm.session +'"]').addClass('active');
    
    $('.user').click(function(){
        cancel_authentication();
        start_authentication($(this).data('id'));
    });
    
    $('.session').click(function(){
        $('#session_table .session').removeClass('active');
        session = $(this).data('id');
        $(this).addClass('active');
    });
    
    $('.password .input').on('focus', function(){
        $(this).text('').off('focus');
    });
    
    $('.password .input').keydown(function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            lightdm.provide_secret($(this).text());
        }
    });
    
    $('#users_table .user[data-id="'+ lightdm.timed_login_user +'"]').addClass('active');
    
    time_remaining = lightdm.timed_login_delay;
    if (time_remaining > 0)
        countdown();
});
