if(!window.lightdm)
(function(){

function LightDMUser (name, real_name, image, logged_in)
{
    this.name = name;
    this.real_name = real_name;
    this.display_name = real_name;
    this.image = image;
    this.logged_in = logged_in;
}

function LightDMSession (key, name, comment)
{
    this.key = key;
    this.name = name;
    this.comment = comment;
}

function _cancel_timed_login ()
{
    if (_login_timer != null)
    {
        clearTimeout (_login_timer);
        _login_timer = null;
    }
}

function _start_authentication (user)
{
    this._user = user;
    this.is_authenticated = false;
    show_prompt ("Password:");
}

function _provide_secret (secret)
{
    this.is_authenticated = (secret == "password");
    authentication_complete ();
}

function _cancel_authentication ()
{
    this.is_authenticated = false;
}

function _suspend ()
{
    window.location = 'http://people.ubuntu.com/~robert-ancell/lightdm/suspend.jpg';
}

function _hibernate ()
{
   alert ('Attempted to hibernate, but can_hibernate = false');
}

function _restart ()
{
    window.location = 'http://people.ubuntu.com/~robert-ancell/lightdm/restart.jpg';
}

function _shutdown ()
{
    window.location = 'http://people.ubuntu.com/~robert-ancell/lightdm/shutdown.jpg';
}

function _login ()
{
    window.location.hast - this._user;
}

function LightDMClass ()
{
    this.users = [new LightDMUser("nick", "Nick Shvelidze", "avatar-default.png", false),
                  new LightDMUser("alice", "Alice", "http://people.ubuntu.com/~robert-ancell/lightdm/astronaut.jpg", false),
                  new LightDMUser("bob", "Bob", "http://people.ubuntu.com/~robert-ancell/lightdm/baseball.png", true),
                  new LightDMUser("carol", "Carol", "http://people.ubuntu.com/~robert-ancell/lightdm/coffee.jpg", false)];
    this.num_users = this.users.length;
    this.sessions = [new LightDMSession("gnome", "GNOME", "This session logs you into GNOME"),
                     new LightDMSession("kde", "KDE", "This session logs you into KDE")];
    this.session = "gnome";
    this.timed_login_user = "nick";
    this.timed_login_delay = 50;
    this.is_authenticated = false;
    this.can_suspend = true;
    this.can_hibernate = false;
    this.can_restart = true;
    this.can_shutdown = true;
    this.cancel_timed_login = _cancel_timed_login;
    this.start_authentication = _start_authentication;
    this.provide_secret = _provide_secret;
    this.cancel_authentication = _cancel_authentication;
    this.suspend = _suspend;
    this.hibernate = _hibernate;
    this.restart = _restart;
    this.shutdown = _shutdown;
    this.login = _login;
    
    this._user = this.timed_login_user;
}

lightdm = new LightDMClass();
_login_timer = setTimeout("timed_login('alice')", lightdm.timed_login_delay * 1000);

})();
