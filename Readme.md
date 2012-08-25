== Browser Mirror

Cross-browser testing made easy. Mirrors all actions you do in one browser into another and shows you the difference!


Project consists of:
* Chrome extension that captures all user events in master browser
* Ruby eventmachine-based server that receives all events from master browser, queues them up and dispatches to slave browser via webdriver
* Remote webdriver server that controls slave browser


== Setup

=== Ruby event server
1. Checkout repo
2. make sure you have ruby 1.9.x installed
3. Install bundler "gem install bundler"
4. In root folder run "bundle install" – that will resolve all dependencies (just like maven)

=== Chrome extension (on Master Browser)
1. Open Chrome, go to settings -> Extensions. Enable developer mode and Load unpacked extension pointing to "chrome-extension" folder in browser mirror repo
2. !BEWARE! it will log all your actions while it's running and will send those actions to ruby event server so switch it on/off when you need it

=== Remote WebDriver Server (on Slave Browser)
1. Spin up virtual machine with IE (or whatever browser you want to use as a slave)
2. Make sure that Java is installed
3. Copy selenium-server-xxx.jar to VM and start it with "java -jar selenium-server-xxx.jar" that will start remote webdriver on 4444 port so make sure it's accessible

=== Starting it up
1. Start remote webdriver server (see above)
2. Start event server "./queue_server.rb" 
3. Click on chrome extension, check settings and press start – that should start up slave browser and you can start doing your actions

