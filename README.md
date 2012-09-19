# Winter Theme for lightdm-webkit-greeter

Early dev

## Installation

### Install lightdm-webkit-greeter

    $ sudo apt-get install lightdm-webkit-greeter
    
Edit `/etc/lightdm/lightdm.conf` and set `greeter-session` to `lightdm-webkit-greeter`, like this:

    [SeatDefaults]
    user-session=gnome
    greeter-session=lightdm-webkit-greeter

### Install theme

Copy files to `/usr/share/lightdm-webkit/themes/lightwinter`.  
Edit `/etc/lightdm-webkit-greeter.conf` and set `webkit-theme` to `lightwinter`, like this:

    [greeter]
    background=/usr/share/backgrounds/warty-final-ubuntu.png

    theme-name=Radiance
    webkit-theme=lighwinter
    font-name=Ubuntu 11
    xft-antialias=true
    xft-dpi=96
    xft-hintstyle=slight
    xft-rgba=rgb
