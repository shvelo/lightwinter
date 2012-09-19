var password_prompt = false;
var selected_user = null;
var time_remaining = 0

function show_prompt(text) {
   password_prompt = true;

   $('tr.password').insertAfter('[data-id="'+selected_user+'"]').slideDown('slow');

   var label = $('#password_prompt');
   label.html(text);
   
   var entry = $('#password_entry');
   entry.val('');

   var table = $('#password_table');

   entry.focus();
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
   if (lightdm.is_authenticated)
       lightdm.login (lightdm.authentication_user, lightdm.default_session);
   else
       show_message ("Authentication Failed");

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
    
    $('.user').click(function(){
        start_authentication($(this).data('id'));
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
    
    $('[data-id="'+ lightdm.timed_login_user +'"]').addClass('active');
    
    time_remaining = lightdm.timed_login_delay;
    if (time_remaining > 0)
        countdown();
});
