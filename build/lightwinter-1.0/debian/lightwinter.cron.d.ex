#
# Regular cron jobs for the lightwinter package
#
0 4	* * *	root	[ -x /usr/bin/lightwinter_maintenance ] && /usr/bin/lightwinter_maintenance
