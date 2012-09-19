var password_prompt = false;
var selected_user = null;
var time_remaining = 0;
var session = lightdm.session;

function show_prompt(text) {
}

function show_message(text) {
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
       $('.password, .pass-wrapper').addClass('error');
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

   if (!password_prompt) {
       selected_user = username;
       lightdm.start_authentication(username);
       
       password_prompt = true;
       $('tr.password').insertAfter('[data-id="'+selected_user+'"]').slideDown('slow');
       $('tr.password .input').focus();
   }
}

function cancel_authentication() {
    lightdm.cancel_authentication();
    password_prompt = false;
    $('.password, .pass-wrapper').removeClass('error');
    $('.password .input, .pass').text('');
    $('.other-user-login .name').text('');
    $('.password, .other-user-login, .pass-wrapper').slideUp('slow');
    
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
    
    $('.other-user').click(function(){
        cancel_authentication();
        $('.other-user-login').slideDown('slow');
        $('.other-user-login .name').focus();
    });
    
    $('.session').click(function(){
        lightdm.cancel_timed_login ();
        $('#user_table tr').removeClass('active');
        
        $('#session_table .session').removeClass('active');
        session = $(this).data('id');
        $(this).addClass('active');
    });
    
    $('.input').on('focus', function(){
        $(this).text('').off('focus');
    });
    
    $('.password .input').keydown(function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            lightdm.provide_secret($(this).text());
        }
    });
    
    $('.other-user-login .name').keydown(function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            lightdm.start_authentication($(this).text());
            $('.pass-wrapper').slideDown('slow');
            $('.other-user-login .pass').focus();
        }
    });
    
    $('.other-user-login .pass').keydown(function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            lightdm.provide_secret($(this).text());
        }
    });
    
    $('#user_table .user[data-id="'+ lightdm.timed_login_user +'"]').addClass('active');
    
    time_remaining = lightdm.timed_login_delay;
    if (time_remaining > 0)
        countdown();
        
    var left_height = $('.left').innerHeight();
    var right_height = $('.right').innerHeight();
    if(left_height > right_height)
        $('.right').css('height', left_height);
    else
        $('.left').css('height', right_height);
});
