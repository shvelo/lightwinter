# Lightwinter

Winter Theme for lightdm-webkit-greeter.

## Demo

[shvelo.github.com/lightwinter/](http://shvelo.github.com/lightwinter/)

## Installation

### Install lightdm-webkit-greeter

    $ sudo apt-get install lightdm-webkit-greeter
    
Edit `/etc/lightdm/lightdm.conf` and set `greeter-session` to `lightdm-webkit-greeter`, like this:

    [SeatDefaults]
    user-session=gnome
    greeter-session=lightdm-webkit-greeter

### Install theme

    $ bash INSTALL

or

    $ chmod +x INSTALL
    $ ./INSTALL
