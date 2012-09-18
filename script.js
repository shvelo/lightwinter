var password_prompt = false;
var selected_user = null;
var time_remaining = 0

function show_prompt(text)
{
   password_prompt = true;

   var label = $('#password_prompt');
   label.html(text);
   
   var user_table = $('#user_table')[0];   
   for (i in user_table.rows)
   {
       var row = user_table.rows[i];
       if (row.id != ('user_' + selected_user) && row.style != null)
           row.style.opacity = 0.25;
   }

   var entry = $('#password_entry');
   entry.val('');

   var table = $('#password_table');

   entry.focus();
}

function show_message(text)
{
   table = document.getElementById('message_table');
   label = document.getElementById('message_label');
   label.innerHTML = text;
   if (text.length > 0)
       table.style.display = "table";
   else
       table.style.display = "none";
}

function show_error(text)
{
   show_message (text);
}

function reset()
{
   var user_table = document.getElementById('user_table');   
   for (i in user_table.rows)
   {
       row = user_table.rows[i];
       if (row.style != null)
           row.style.opacity = 1;
   }
   var table = $('#password_table');
   table.css('display',"none");
   password_prompt = false;
}

var loading_text = '';

function throbber()
{
   loading_text += '.';
   if (loading_text == '....')
       loading_text = '.'
   var label = $('#countdown_label');
   label.html(loading_text);
   setTimeout(throbber, 1000);
}

function authentication_complete()
{
   if (lightdm.is_authenticated)
       lightdm.login (lightdm.authentication_user, lightdm.default_session);
   else
       show_message ("Authentication Failed");

   reset ();
   setTimeout(throbber, 1000);
}

function timed_login(user)
{
   lightdm.login (lightdm.timed_login_user);
   setTimeout(throbber, 1000);
}

function start_authentication(username)
{
   lightdm.cancel_timed_login ();
   var label = $('#countdown_label')[0];
   if (label != null)
       label.style.visibility = "hidden";

   show_message("");
   if (!password_prompt) {
       selected_user = username;
       lightdm.start_authentication(username);
   }
}

function provide_secret()
{
   var entry = $('#password_entry');
   lightdm.provide_secret(entry.val());
}

function countdown()
{
   var label = $('#countdown_label');
   label.html(' in ' + time_remaining + ' seconds');
   time_remaining--;
   if (time_remaining >= 0)
       setTimeout(countdown, 1000);
}

$(function(){
for (i in lightdm.users)
{
   var user = lightdm.users[i];

   if (user.image.length > 0)
      image = user.image;
   else
      image = 'avatar-default.png';
   
   $('#user_table').append('<tr id="user_' + user.name +'" onclick="start_authentication(\'' + user.name + '\')">');
   
   $('#user_' + user.name).
    append('<td><img src="' + image + '"></td>').
    append('<td>' + user.display_name + '</td>');
   
   if (user.name == lightdm.timed_login_user && lightdm.timed_login_delay > 0)
       $('#user_' + user.name).append('<td id="countdown_label">');
}

$('#user_table').append('<tr id="other_user" onclick="other_user()">');
   
$('#other_user').
    append('<td><img src="avatar-default.png"></td>').
    append('<td>Other</td>');

time_remaining = lightdm.timed_login_delay;
if (time_remaining > 0)
    countdown();
});
