//Channel JSON data
var channels;
var i = 0;
// dial string
dialedstring = new String;
// menu JSON data
var usermenu;
var setupmenu;
// global variable for rotation
var angle = 0;
var motion;


    //Set some variables to track where we are
    power = 0;
    menumode = 0; // menu mode
    m = 0; // menu mode variable
    s = 0; // submenu variable
    menumode_setup = 0; //setup menu
    menumode_setup_prescreen = 0; // holding screen for setup menu
    menumode_user = 0; // user menu
    scanning = 0; // if scanning mode is on/off
    keytones = 1; //beeps
    // Global Busy. If radio is doing something, dont allow a function to happen
    var busy = 0;

$(document).ready(function () {

    // pipe a message to the console to tell people to turn the radio on
    if (power == 0) { tooltips("off"); }


    //Handle Power on/Power off
    var timeout_id = 0,
    hold_time = 2000,
    hold_trigger = $('#volumeknob')
    hold_events = 'mousedown touchstart';

    //power up function, available to everything
    var powerup = function () {
        /* Now you need to add code here to show a boot screen with animated delays and shit
         including the LED light blinking, beeps */
        // console.log("MenuMode: " + menumode);
        if (menumode == 0) {
            // set busy, prevent other functions
            setbusy(1, 1);
            // set LCD colour
            $("#lcd").addClass("lcdblue").removeClass("lcdgreen");
            keybeep();
            $('#poweron').fadeIn(1200, "linear", function () { $("#indicatorlight").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100, function () { $('#poweron').hide(10, function () { $('#ChannelMode').fadeIn(2800, "linear");});})});
            // pipe a message to the console once turned on to explain channel mode and menumode
            tooltips("powerup");
            power = 1;
            setbusy(0, 3500);
        } else if (menumode == 1) {
            // if menu mode is on, fuck off the menu
            menumode = 0; // this should point to a function for the hangup button, like a clear all.
            hangup();
            keybeep();
        }
    };

    //power down function, available to everything
    var powerdown = function () {
        /* show a boot screen with animated delays and 
         including the LED light blinking, beeps */
        // console.log("MenuMode: " + menumode);
        if (menumode == 0) {
            biplong();
            if (scanning == 1) { scanmode("shutdown") }; // if its scanning, stop the scanning function then proceed.
            $('#ChannelMode').fadeOut(800, "linear", function () { $('#poweroff').show("fast", function () {$("#indicatorlight").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100, function () { $('#poweroff').fadeOut(2800, "linear");});})});
            // adds the lcdgreen and lcdclass for screen, waits 2 seconds then removes lcdblue, returning lcd to green.
            $("#lcd").addClass("lcdgreen lcdblue", setTimeout(function () { $("#lcd").removeClass("lcdblue") }, 2000));
            power = 0;
        } else if (menumode == 1) {
            hangup();
            biplong();
            
        }
    };


    hold_trigger.on(hold_events, function (e) {
        // hold_trigger.mousedown(function () {
        e.preventDefault ? e.preventDefault() : e.returnValue = false; // Mobile Device - prevent default right click and zooming!
        if (power == 0) {
            timeout_id = setTimeout(powerup, hold_time);
           // alert("Device powered on");
            // console.log("Device currently powered off ..powering up");
            // console.log("Initial Power state = " + power);

            hold_trigger.on('mouseup mouseleave', function () {
                clearTimeout(timeout_id);
                // alert("Power = " + power);
                // console.log("Resultant Power state = " + power);
            });

            // this is where you fuck with it and do else
        } else {
            timeout_id = setTimeout(powerdown, hold_time);
          //  alert("Device Powered off");
            // console.log("Device currently powered on ..powering down");
            // console.log("Initial Power state = " + power);


            hold_trigger.on('mouseup mouseleave', function () {
                clearTimeout(timeout_id);
                // alert("Power = " + power);
                // console.log("Resultant Power state = " + power);
            });
        };                            
    });






 // Channel Mode / Management
    //if (power == 1 && menumode == 0) {
    $.getJSON("csv/channels.json", function (channelmode) {
        channels = channelmode;
        //Start by setting the channel
        $('#ChannelName').html(channels[i].ChannelName);
        $('#ChannelNumber').html(channels[i].ChannelNumber);
     //   return "Channel Data Loaded";

    });  


            //debug alert(channels.length);
            
            // console.log("Channel Object: " + i);
            //debug   alert("the value of i is: " + i);

// menu modes
            $.getJSON("csv/usermenu.json", function (usermenujson) {
                usermenu = usermenujson;
            });

            $.getJSON("csv/setupmenu.json", function (setupmenujson) {
                setupmenu = setupmenujson;
            });



    //click events
            $('body').on('vclick', '#right', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; right() });
            $('body').on('vclick', '#left', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; left() });
            $('body').on('vclick', '#up', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; up() });
            $('body').on('vclick', '#down', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; down() });

            $('#numbers td').each(dialpad);
            $('#duress').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; duress() });



            $('#f1').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; f1() });
            $('#f2').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; f2() });
            $('#f3').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; f3() });
            $('#f4').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; f4() });


            $('#hangup').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; hangup() });
            $('#answer').on('vclick', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; answer() });



            $('#simoco').on('dblclick', about);
            $('#simoco').doubletap(
                /** doubletap-dblclick callback */
                function (e) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    about()
                },
                /** doubletap-dblclick delay (default is 500 ms) */
                1500
            );

    //microphone
            $('body').on('vclick', '#micduress', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; duress() });
            $('body').on('vclick', '#ptt', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; transmit() });
            $('#microphonecontainer').on('vclick', '#microphone', function (e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; microphonetoolip() });
           

}); // end of document ready

// Core Nav functions for chan and menu
function left() {
    if (menumode == 0 && scanning == 0) { channelleft(); };
    if (power == 1 && menumode == 1 && menumode_user == 1) { usermenuleft(); };
    if (power == 1 && menumode == 1 && menumode_setup == 1 && menumode_setup_prescreen == 0) { setupmenuleft() };
};

function right() {
    if (menumode == 0 && scanning == 0) { channelright(); };
    if (power == 1 && menumode == 1 && menumode_user == 1) { usermenuright(); };
    if (power == 1 && menumode == 1 && menumode_setup == 1 && menumode_setup_prescreen == 0) { setupmenuright() };
};

function up() {
    if (power == 1 && menumode == 0 && scanning == 0) { menumodedisplay(); }
    //
    
    //DO NOT CHANGE THE ORDERING, statements evaluated in logical order to replicate actual radio
    
    if (power == 1 && menumode == 1 && menumode_user == 1) { menusetupdisplay(); return; };
    if (power == 1 && menumode == 1 && menumode_setup == 1 && menumode_setup_prescreen == 1) { menuuserdisplay(); return; };
    if (power == 1 && menumode == 1 && menumode_setup == 1) { setupmenuup(); return; }
    if (power == 1 && menumode == 1 && menumode_setup == 0) { menusetupdisplay(); return; }; // determines setup menu first on up arrow
};

function down() {
    if (power == 1 && menumode == 0 && scanning == 0) { menumodedisplay(); }
    //
    //DO NOT CHANGE THE ORDERING, statements evaluated in logical order to replicate actual radio
    if (power == 1 && menumode == 1 && menumode_user == 1) { menusetupdisplay(); return; };
    if (power == 1 && menumode == 1 && menumode_setup == 1 && menumode_setup_prescreen == 1) { menuuserdisplay(); return; }
    if (power == 1 && menumode == 1 && menumode_setup == 1) { setupmenudown(); return; }
    if (power == 1 && menumode == 1 && menumode_user == 0) { menuuserdisplay(); return; }; // determines user menu first on down arrow
};


//menumode display
function menumodedisplay() {
        if (busy == 1) { tooltips("busy"); return; };
        // hide channel mode, display menu mode.
        $('#ChannelMode').fadeOut(300, "linear", function () { ($('#menumode').fadeIn(300, "linear")) });
        // console.log("Changing to menu mode. (Menumode set to: " + menumode + ")");
        menumode = 1;

        //test tooltip
        tooltips("menumodedisplay");
    
};

function menuuserdisplay() {
    if (busy == 1) { tooltips("busy"); return; };
    //set initial and default (0) (or [m] ??) values of usermenu
    keybeep();
    menumode_user = 1;
    menumode_setup = 0;
    menumode_setup_prescreen = 0;
    $('#menutitle').html(usermenu[m].menutitle);
    $('#menuitem').html(usermenu[m].mainvalue);
    $('#menuvalue').html(usermenu[m].subvalue[(usermenu[m].currentvalue)]);
    $('#menualter').html(usermenu[m].altervalue);

    tooltips("menuuserdisplay");
};

function menusetupdisplay() {
    if (busy == 1) { tooltips("busy"); return; };
    //setup empty layout
    keybeep();
    menumode_setup = 1;
    menumode_setup_prescreen = 1;
    menumode_user = 0;
    $('#menutitle').html("Setup");
    $('#menuitem').html("");
    $('#menuvalue').html("");
    $('#menualter').html("Ok");

    tooltips("menusetupdisplay");
};

// Channel Navigation left/right
                    function channelright() {
                        
                    if (power == 1 && menumode == 0) {
                        if (busy == 1) { tooltips("busy"); return; };
                        keybeep();
                        if (i == channels.length - 1) { i = 0 } else { ++i; }

                        //debug     alert("the value of i is: " + i);
                        // console.log("Channel Object: " + i);
                        $('#ChannelName').html(channels[i].ChannelName);
                        $('#ChannelNumber').html(channels[i].ChannelNumber);
                        // console.log("the value of i is: " + i + " The channel is: " + channels[i].ChannelName + " The chan number is: " + channels[i].ChannelNumber);
                        tooltips("channelright");
                        if (((channels[i].ChannelName).match(/^CB.*$/))) { tooltips("CB","channelright") };
                    };
                };
            


                    function channelleft() {
                        
                        if (power == 1 && menumode == 0) {
                            if (busy == 1) { tooltips("busy"); return; };
                            keybeep();
                            if (i == 0) { i = channels.length - 1 } else { --i; }

                            //debug   alert("the value of i is: " + i);
                            // console.log("Channel Object: " + i);
                            $('#ChannelName').html(channels[i].ChannelName);
                            $('#ChannelNumber').html(channels[i].ChannelNumber);
                            // console.log("the value of i is: " + i + " The channel is: " + channels[i].ChannelName + " The chan number is: " + channels[i].ChannelNumber);
                            tooltips("channelleft");
                            if (((channels[i].ChannelName).match(/^CB.*$/))) { tooltips("CB","channelleft") };
                        };
                    };
            
                    //Handle The Buttons so they can dial in channels directly ***********

                    // ok, here we put an if statement to get the channel mode only, then do the code
                    // once we have that we can just concantenate the strings and make hash the 'enter' button and push that to a channel change.. yep.
                    function dialpad() {             
                        $(this).on('click', function () {
                            if (power == 1) {
                                if (busy == 1) { tooltips("busy"); return; };
                                dialed = $(this).attr('id');

                                keybeep();
                                // console.log("Numberpad keypress: " + dialed);
                                tooltips("dialpad");

                                dialedstring = dialedstring + dialed;
                                // console.log("Evaluating dial string: " + dialedstring);
                                var displaycharacters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
                                if (dialed in displaycharacters) { $('#dialed').append(dialed) };
                                if ($('#dialed').text().length > 7) { $('#dialed').html(""); }; //works sweet

                                dialmatch = /(([0-9]{1,2}(#){1})){1}/; // /(([0]{0,1})([0-9]{1,2}(#){1})){1}/   // better to avoid leading 0 entirely /(([0-9]{1,2}(#){1})){1}/; or /(([0-9]{1,3}(#){1})){1}/;
                                // Note this regex isnt suitable if channels length is > 99 (eg 100),. would need to account for [0-1]? at the start of the group.
                                if (dialcode = dialedstring.match(dialmatch)) {

                                    channelinput = (dialcode[0].slice(0, -1) - 1);
                                    // console.log("Match found. The dialed channel number is: " + (dialcode[0].slice(0, -1)) + " which has an Channel ID of: " + channelinput);
                                    dialcode = [];
                                    dialedstring = '';

                                    if (channelinput == -1 | channelinput > channels.length) {
                                        // why do anything? just beep and clear?
                                        doublebeep();
                                        $('#dialed').html("");
                                       // alert("DEBUG: " + channelinput + " is out of bounds");
                                        // console.log("Not a valid channel: " + channelinput + " is out of bounds");
                                    } else {
                                        // channel change code
                                        i = channelinput;
                                        // console.log("Channel Object: " + i);
                                        $('#ChannelName').html(channels[i].ChannelName);
                                        $('#ChannelNumber').html(channels[i].ChannelNumber);
                                        $('#dialed').html("");
                                        // console.log("the value of i is: " + i + " The channel is: " + channels[i].ChannelName + " The chan number is: " + channels[i].ChannelNumber);
                                        if (((channels[i].ChannelName).match(/^CB.*$/))) { tooltips("CB", "<p>You have manually changed the channel input to an UHF CB channel.") } else { tooltips("dialpad", "<p>Well Done. The channel input has matched to " + channels[i].ChannelNumber) };
                                    };

                                };
                            } 

                        });
                        
                    };

//Menu navigation functions
                    // left / right in usermode
                    function usermenuright() {
                        
                        if (m == usermenu.length - 1) { m = 0 } else { ++m; }
                        $('#menutitle').html(usermenu[m].menutitle);
                        if (typeof usermenu[m].mainvalue === 'object') { $('#menuitem').html(usermenu[m].mainvalue[usermenu[m].currentvalue]); } else { $('#menuitem').html(usermenu[m].mainvalue); }
                        //subvalue
                        if (usermenu[m].subvalue != null || usermenu[m].subvalue != undefined) { $('#menuvalue').html(usermenu[m].subvalue[(usermenu[m].currentvalue)]); } else { $('#menuvalue').html("") };
                        $('#menualter').html(usermenu[m].altervalue);

                        keybeep();

                      // console.log(typeof usermenu[m].mainvalue);
                      // console.log(typeof usermenu[m].subvalue);
                      // console.log("m is " + m);
                        tooltips("usermenuright", usermenu[m].mainvalue);
                    };


                    // left / right in usermode
                    function usermenuleft() {
                        
                        if (m == 0) { m = usermenu.length - 1 } else { --m; }
                        $('#menutitle').html(usermenu[m].menutitle);
                        if (typeof usermenu[m].mainvalue === 'object') { $('#menuitem').html(usermenu[m].mainvalue[usermenu[m].currentvalue]); } else { $('#menuitem').html(usermenu[m].mainvalue); }

                        if (usermenu[m].subvalue != null || usermenu[m].subvalue != undefined) { $('#menuvalue').html(usermenu[m].subvalue[(usermenu[m].currentvalue)]); } else { $('#menuvalue').html("") };
                        $('#menualter').html( usermenu[m].altervalue);

                        keybeep();

                       // console.log("m is " + m);
                       // console.log(typeof usermenu[m].mainvalue);
                        // console.log(typeof usermenu[m].subvalue);
                        tooltips("usermenuleft", usermenu[m].mainvalue);
                    };

                    function setupmenuup() {
                        
                        if (m == setupmenu.length - 1) { m = 0 } else { ++m; }
                        $('#menutitle').html(setupmenu[m].menutitle);
                        if (typeof setupmenu[m].mainvalue === 'object') { $('#menuitem').html(setupmenu[m].mainvalue[setupmenu[m].currentvalue]); } else { $('#menuitem').html(setupmenu[m].mainvalue); }
                        //subvalue
                        if (setupmenu[m].subvalue != null || setupmenu[m].subvalue != undefined) { $('#menuvalue').html("Subvalue: " + setupmenu[m].subvalue[(setupmenu[m].currentvalue)]); } else { $('#menuvalue').html("") };
                        $('#menualter').html(setupmenu[m].altervalue);

                        keybeep();

                      // console.log(typeof setupmenu[m].mainvalue);
                      //  console.log(typeof setupmenu[m].subvalue);
                        // console.log("m is " + m);
                        tooltips("setupmenuup", setupmenu[m].menutitle);
                    };



                    function setupmenudown() {
                        
                        if (m == 0) { m = setupmenu.length - 1 } else { --m; }
                        $('#menutitle').html(setupmenu[m].menutitle);
                        if (typeof setupmenu[m].mainvalue === 'object') { $('#menuitem').html(setupmenu[m].mainvalue[setupmenu[m].currentvalue]); } else { $('#menuitem').html(setupmenu[m].mainvalue); }


                        if (setupmenu[m].subvalue != null || setupmenu[m].subvalue != undefined) { $('#menuvalue').html("Subvalue: " + setupmenu[m].subvalue[(setupmenu[m].currentvalue)]); } else { $('#menuvalue').html("") };
                        $('#menualter').html(setupmenu[m].altervalue);

                        keybeep();

                        // console.log("m is " + m);
                        // console.log(typeof setupmenu[m].mainvalue);
                        // console.log(typeof setupmenu[m].subvalue);
                        tooltips("setupmenudown", setupmenu[m].menutitle);
                    };


                    function setupmenuleft() {
                        
                        s = setupmenu[m].currentvalue;
                        if (setupmenu[m].subvalue) {
                            if (s == 0) { s = setupmenu[m].subvalue.length - 1; } else { --s; };
                            setupmenu[m].currentvalue = s;
                            $('#menuitem').html(setupmenu[m].subvalue[s]);
                        } else /*if (typeof menu[m].mainvalue === 'object')*/ {
                            // console.log(setupmenu[m].mainvalue[s])
                            if (s == 0) { s = setupmenu[m].mainvalue.length - 1; } else { --s; }
                            setupmenu[m].currentvalue = s;
                            $('#menuitem').html(setupmenu[m].mainvalue[s]);
                        };
                        keybeep();
                        menucommands(setupmenu[m].menutitle, setupmenu[m].currentvalue);
                        tooltips("setupmenuleft");
                    };


                    function setupmenuright() {
                        
                        s = setupmenu[m].currentvalue;
                        if (setupmenu[m].subvalue) {
                            // console.log(setupmenu[m].subvalue);
                            if (s == setupmenu[m].subvalue.length - 1) { s = 0; } else { ++s; };
                            setupmenu[m].currentvalue = s;
                            $('#menuitem').html(setupmenu[m].subvalue[s]);
                        } else /* if (typeof setupmenu[m].mainvalue === 'object') */ {
                           // // console.log(setupmenu[m].mainvalue[s])
                            if (s == setupmenu[m].mainvalue.length - 1) { s = 0 } else { ++s; }
                            setupmenu[m].currentvalue = s;
                            $('#menuitem').html(setupmenu[m].mainvalue[s]);

                        };
                        keybeep();
                        menucommands(setupmenu[m].menutitle, setupmenu[m].currentvalue);
                        tooltips("setupmenuright");
                    };

                    // user options menu function, alter button, toggles the on/off functions, same as left/right.
                    function menualter() {
                        
                        s = usermenu[m].currentvalue;

                        if (usermenu[m].subvalue) {
                            // console.log(usermenu[m].subvalue);
                            if (s == usermenu[m].subvalue.length - 1) { s = 0; } else { ++s; };

                            usermenu[m].currentvalue = s;
                            $('#menuvalue').html(usermenu[m].subvalue[s]);

                        }
                        menucommands(usermenu[m].mainvalue, usermenu[m].currentvalue);

                    };

        // Add a handler to receive and act upon menu setting changes
                    function menucommands(menuname,menuvalue) {

                        if (menuname == "Backlight") { if (menuvalue = 1) { $('#lcd').toggleClass('lcdbluedark') }; if (menuvalue = 0) { $('#lcd').toggleClass('lcdbluedark') }; /* console.log("backlight altered") */ };
                        if (menuname == "DTMF") { /* console.log("DTMF setting updated") */ };
                        if (menuname == "Key beeps") { if (keytones == 0) { keytones = 1 } else { keytones = 0 }; $('#console').html("Key beeps setting changed"); };
                        if (menuname == "Contrast") { if (menuvalue < 7) {$('#overlaycontainer').fadeTo(50,0.5); $('#lcd').addClass('lcdbluedark') }; if (menuvalue > 7) {$('#overlaycontainer').fadeTo(50,1); $('#lcd').removeClass('lcdbluedark')}  /* console.log("Contrast changed") */ };
                        if (menuname == "Alert Volume") { /* console.log("Alert Volume changed") */ };
                        if (menuname == "Mute Adjust") { /* console.log("Mute Adjust changed") */ };

                    };


           

            // Handle the Duress button


            function duress() {
                if (power == 1) {
                    if (busy == 1) { tooltips("busy"); return; };
                    // keybeep(); not required
                    // console.log("Alert Button clicked");
                    //alert("Oh my goodness you pressed the duress. Dont worry, it does nothing on the UHF!");
                    // tooltips(arguments.callee.name); not cross browser compatible
                    tooltips("duress");
                }
            };
            


                function f1() {
                    
                    if (power == 1) {
                        // console.log("Scan button pressed (prefunc)");
                        if (busy == 1) { tooltips("busy"); return; };
                        
                        if (menumode == 0 && scanning == 0) {

                            keybeep();
                            // console.log("Scan button pressed");
                            //alert("This would scan the UHF channels silently untill a conversation is heard. Then it would tune into that channel")
                            scanmode("on");
                        }
                        else {
                            // else > code for menu mode - none required, but needs to beep
                            
                            if (scanning == 1) { keybeep(); scanmode("off"); return; }
                            tooltips("f1none");
                            return;
                        }
                    };
                };
            




                function f2() {
                    
                    if (power == 1) {
                        // console.log("F2 button pressed (prefunc)");
                        // tooltips(arguments.callee.name); not cross browser compatible
                        if (busy == 1) { tooltips("busy"); return; };

                        tooltips("f2");
                        if (menumode == 0) {
                           // keybeep();
                            // console.log("F2 button pressed");
                          //  alert("F2 Button pressed")
                        }
                        else {
                            // else > code for menu mode 
                           // keybeep();
                            return;
                        }
                    };
                };
            



                function f3() {
                    
                    if (power == 1) {
                        // console.log("F3 button pressed (prefunc)");
                        // tooltips(arguments.callee.name); not cross browser compatible. Pass function name manually instead.
                        if (busy == 1) { tooltips("busy"); return; };
                        tooltips("f3");
                        if (menumode == 0) {
                           // keybeep(); Not required
                            // console.log("F3 button pressed");
                         //   alert("F3 Button pressed")
                        }
                        else {
                            // else > code for menu mode
                           // keybeep();
                            return;
                        }
                    };
                };
            


                function f4() {
                    
                    if (power == 1) {
                        // console.log("F4 button pressed (prefunc)");
                        if (busy == 1) { tooltips("busy"); return; };
                        if (menumode == 0) {
                           // keybeep(); not required in channel mode
                            // console.log("F4 button pressed");
                           // alert("F4 Button pressed")
                        }
                        else {
                            // else > code for menu mode 
                            keybeep();
                            if (menumode_setup_prescreen == 1) { setupmenuup(); menumode_setup_prescreen = 0; return; };
                            //if (menumode_setup == 1) { setupmenuup() };
                            if (menumode_setup == 1 && menumode_setup_prescreen == 0) { hangup(); return; };
                            if (menumode_user == 1 ) { menualter() };
                            return;
                        }
                    }
                };
            

            function hangup() {
                
                if (power == 1) {
                    // console.log("Hangup button pressed (prefunc)");
                    if (busy == 1) { tooltips("busy"); return; };
                    if (menumode == 0) {
                        keybeep();
                        // console.log("Hangup/Cancel button pressed");
                       // alert("Hangup/Cancel Button pressed")
                    }
                    else {
                        menumode = 0;
                        menumode_setup = 0;
                        menumode_setup_prescreen = 0;
                        menumode_user = 0;
                        keybeep();
                        $('#menumode').fadeOut(300, "linear", function () { ($('#ChannelMode').fadeIn(300, "linear")) });
                        // console.log("Escaping menu mode. Back to Channel mode. (Menumode set to: " + menumode + ")");
                    }
                };
                // tooltips(arguments.callee.name); not cross browser compatible
                tooltips("hangup");
            };
            



                function answer() {
                    
                    if (power == 1) {
                        // tooltips(arguments.callee.name); not cross browser compatible
                        tooltips("answer");
                        // console.log("Answer button pressed (prefunc)");
                        if (menumode == 0) {
                            errorbeep();
                            // console.log("Answer button pressed");
                            //  alert("Answer Button pressed")  
                        }
                        else {
                            errorbeep();
                        }
                    } 
                };  
// Turns the scan mode screen on and off by passing scanmode("on") or scanmode("off). Scanmode, rotates the arrow as well

                function scanmode(state) {                                   
                     
                     if (state == "on" || state == null) {
                         if (menumode == 0) {
                             //set a busy mode delay to prevent maniac
                             setbusy(1, 1);
                            scanning = 1;
                            $('#ChannelMode').fadeOut(100, "linear", function () { ($('#scanmode').fadeIn(100, "linear")) });                                  
                            // motion;  
                            motion = setInterval(function () {
                                angle += 3;
                                $("#aarow").rotate({ angle: angle, center: ["50%", "100%"] }); //center is center position
                            }, 35); // defines speed
                             // console.log("Scan mode on")
                             //dev busy delay?
                            setbusy(0, 350);
                        };
                    };
                     if (state == "off") {
                         //set a busy mode delay to prevent maniac
                         setbusy(1, 1);
                        $('#scanmode').fadeOut(100, "linear", function () { ($('#ChannelMode').fadeIn(100, "linear")) });
                        scanning = 0;
                        clearInterval(motion);
                         // console.log("Scan mode off");
                         //dev busy delay?
                        setbusy(0, 150);
                     };
                    // shutdown scanning mode, disables but doesnt return channel mode
                     if (state == "shutdown") {
                         //set a busy mode delay to prevent maniac
                         setbusy(1, 1);
                         $('#scanmode').fadeOut(800, "linear");
                         scanning = 0;
                         clearInterval(motion);
                         // console.log("Scan mode off");
                         //dev busy delay?
                         setbusy(0, 150);
                     };
                    // tooltips(arguments.callee.name); not cross browser compatible
                    tooltips("scanmode");
                };

                function microphonetoolip() {
                    if (power == 1) {
                        if (busy == 1) { tooltips("busy"); return; };
                        tooltips("microphone")
                    };
                };



                //busy mode, function to allow holding of animations, stops maniac clicks
                // function is called using setbusy(state, delay);
                function setbusy(state, delay) {
                    if (state == 1 || state == "on" || state == null) { setTimeout(function () { busy = 1; }, delay) };
                    if (state == 0 || state == "off") { { setTimeout(function () { busy = 0; }, delay) }; };
                };


// Transmit function. Simulates a transmission / return white noise
                function transmit() {
                    
                    if (power == 1 && menumode == 0 && scanning == 0) {
                        if (busy == 1) { tooltips("busy"); return; };
                        $('#speaker').fadeIn(100, "linear", function () { ($('#signal').fadeIn(10, "linear", function () { recievenoise() }).delay(2100).fadeOut(50, 'swing')) }).delay(2100).fadeOut(50, 'swing');
                        // tooltips(arguments.callee.name); not cross browser compatible
                        tooltips("transmit");
                    };
                };

// Audio

function keybeep() {
    audiodiv = "#KeyBeep";
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: keybeep';
    
};
function errorbeep() {
    audiodiv = "#ErrorTone"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Error beep';
    
};
function bip() {
    audiodiv = "#Bip"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Bip';
};
function bipalert() {
    audiodiv = "#BipAlert"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Bip';
};
function biplong() {
    audiodiv = "#BipLongAlert"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Long Bip (Power down)';
};
function urgentalert() {
    audiodiv = "#UrgentAlert"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Urgent Alert';
};
//obsolete beep
function beep() {
    audiodiv = "#Beep"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Generic Beep';
};

function recievenoise() {
    audiodiv = "#receive"
    if (keytones == 1) { $(audiodiv)[0].play(); };
    return 'Audio: Generic Cosmic Background / Brown noise';
};



 function doublebeep() {
    function beep1() {
        keybeep();
    };
    function beep2() {
        setTimeout(function () { keybeep(); }, 210);
    };
    beep1();
    beep2();

    return 'Audio: double beep';

};

// LED light
 function blink() {
     $("#indicatorlight").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
     return "LED Blinking";
 };

 function ledOn() { $("#indicatorlight").fadeIn(100); return "LED on"; };
 function ledOff() { $("#indicatorlight").fadeOut(100); return "LED off"; };



// About / Easteregg - simoco button
function about() {
    function display() {
        if (busy == 1) { tooltips("busy"); return; };
        // set busy
        setbusy(1, 1);
        // return "Displaying about screen";
        if (menumode == 1) {
            $('#menumode').hide('slow');
        }
        if (scanning == 1) { $('#scanmode').hide('slow'); }
        else {
            $('#ChannelMode').hide('slow');
        };
        $('#easteregg').show('fast');
        blink();
        ledOn();
    };
    
    function hide() {
       // return "Hiding about screen";
        $('#easteregg').hide('fast');
        if (menumode == 1) {
            $('#menumode').show('slow');
        }
        if (scanning == 1) { $('#scanmode').show('slow'); }
        else {
            if (power == 1) { $('#ChannelMode').show('slow'); }
        };
        ledOff();
    };
    display();
    setTimeout(hide, 10000);
    tooltips("hide");
    setbusy(0, 11000);
    return "Displaying about screen.."

};

// Handle the interactive console text

function tooltips(functionname, textinput) {
    var details;
    var subdetails;

    if ($('#console')) {
        $('#console').fadeIn("fast", "linear");
        if (functionname == "off") {details = "The radio is currently switched off. Turn it on by pressing and holding down the power button (knob).<p>The radio is turned off this way as well."};
        if (functionname == "powerup") { details = "Channel Mode:<p>Turning the radio on will automatically put it in channel mode. You can change channels by pressing the left and right buttons on the Directional Pad.<p>Menu:<p>The radio's menu allows you to change settings that affect how the radio looks and sounds. Your LHQ radio may have more or less items visible.<br />There are two menus, User options and Setup. Access the menu by using the Up and Down buttons on the directional pad"}; //after fixing menumodedisplay with power == 1 in click event (or function), this cant display, overwritten. probably best to stick this in a variable and pipe it in with user/setup
        if (functionname == "scanmode") {details = "Scan mode:<p>The scanning function on the UHF is programmed to scan pre-set SES UHF channels for an incomming transmission.<p>The radio is listening silently to the SES Scanning group, when an transmission is received, the radio will tune into that channel until the transmission is over and then continue scanning again.<p>How would you use this?<ul><li>Monitoring multiple SES channels at once</li><li>Scanning SES channels for activity, vs manually tuning into each channel"};
        if (functionname == "menuuserdisplay") {details = "User options:<p>Each item is either on or off and is changed by pressing the Alter button (F4). Navigation between each menu is the left and right control on the directional pad."};
        if (functionname == "menusetupdisplay") {details = "Setup Menu:<p>To enter the setup menu, press Ok (F4). Navigate through the menu using Up and Down on the directional pad, change the values using left and right."};
        if (functionname == "transmit") { details = "Transmit/Receive (Simulation):<p>What you are seeing is a simulation of what you will see and hear if you pressed the PTT button whilst tuned into a repeater channel<p>Eg, SES CH 1 through to 15, and CB 1-8.<p>Notice the <img src=\"images/speaker.gif\" alt=\"speaker\" height=\"12px\" width=\"10px\"  /> icon is displayed on the screen to notify you a transmission is received, a signal icon ( <img src=\"images/signalmeter.gif\" />) is displayed representing the strength of the transmission. Full signal strength is indicated here." };
        if (functionname == "answer") { details = "Answer Button:<p>The answer button has no programmed function on the UHF radio. You will only hear the Error Tone." };
        if (functionname == "duress") { details = "Duress Button:<p>Oh my goodness you pressed the duress. Dont worry, it does nothing on the UHF!<p>Its a common misconception that the duress button sends an alert, calls for help or somehow transmits your location.<p>In fact, the Duress button only performs a function on the SMR (Orange) radio." };
        if (functionname == "f2" || functionname == "f3") { details = "F2 and F3:<p>These buttons are not asociated with any function. The display is set up in a 'What You See Is What You Get' (WYSIWYG). Just like using an ATM, there is a groove next to each button. Follow the label on the screen to its corresponding F button." };
        if (functionname == "f1none") { details = "There is currently no function to perform for F1. The display is set up in a 'What You See Is What You Get' (WYSIWYG). Just like using an ATM, there is a groove next to each button. Follow the label on the screen to its corresponding F button. " }

        if (functionname == "dialpad") { details = "Direct channel input:<p>From the channel screen, If you know the channel memory number, indicated on the top left when on the channel screen; you can directly dial in the channel memory number, followed by #.<p>This will change the channel. If you select a number that doesnt match a channel, nothing will happen."; subdetails = textinput;};
        if (functionname == "about") {details = "About this simulator:<p>This simulator was created for education and training purposes only. Simoco is a registered trademark.<p>Please read the readme documentation for information. Remember this simulator is a guide only, there may be differences in your LHQ radio, due to programming."};

        if (functionname == "usermenuleft" || "usermenuright") {
            if (textinput == "Key beeps") {details = "User Menu: Key beeps<p>Key beeps controls whether you hear an audible beep when you press buttons on the radio. Most radios will have this enabled, because it allows the operator to know if they are sucessfully pressing buttons.<p>This function has been simulated. Try it." };
            if (textinput == "Backlight") {details = "User Menu: Backlight<p>You can turn the Backlight of the LCD pannel on or off. Why would this be used? rarely indoors but may be useful adjusting in very bright or dull areas." };
            if (textinput == "DTMF") {details = "User Menu: DTMF<p>DTMF or <a href=\"https://en.wikipedia.org/wiki/Dual-tone_multi-frequency_signaling\">'Dial-tone multi-frequency signaling'</a> are set tones that are asociated with the buttons on the numberpad. This function controls whether you are permitted to transmit a DTMF tone by pressing the corresponding button on the numberpad whilst transmitting (pressing the PTT).<p>This does not control the beep heard when pressing the keys. Note: There is no simulation for this option." };
            if (textinput == "Dual Watch") {details = "User Menu: Dual Watch<p>Dual Watch is probably enabled on your LHQ radio. Dual Watch does exactly that (depending on programming), it allows one channel to be monitored in the background whilst you have selected another."  };
        };
        if (functionname == "setupmenuleft" || "setupmenuright") {
            if (textinput == "Mute Adjust") {details = "Setup Menu: Mute Adjust<p>The radio has several 'Mute' functions. These relate to special functions known as 'CTCSS' and 'Selcall'. Additionally Squealch. Effectively this setting sets a threshold volume level (offset) that engages the mute functions.<p>In context, this is used as our squealch level, how good/loud the incoming transmission has to be before the speaker is unmuted. Otherwise you would hear static non stop.<p>This feature is not simulated"};
            if (textinput == "Contrast") {details = "Setup Menu: Contrast<p>The contrast controls the darkness of the display. Eg, how dark the text is. This feature has been partially simulated. Values below 7 will dim the textual display, values above 7 will darken it.<p>On your LHQ radio you may have less range to adjust.<p>Why use this?<ul><li>Sunlight affects your ability to read the screen</li><li>Backlight / Contrast settings can affect the display</li><li>Age may affect the quality of the display</li><li>Personal preference</li></ul>" };
            if (textinput == "Information") {details = "Setup Menu: Information<p>This screen displays firmware/software information, radio settings and serial number. There is no function asociated with this screen." };
            if (textinput == "Alert Volume") {details = "Setup Menu: Alert Volume<p>This setting changes how loud received alerts are from the radio. If we used the UHF to receive tone coded messages, or 'calling' features, this would control how loud the phone ring alert would be, and other similar beeps and tones. This number is an offset based on the total volume, eg the volume knob.<p>This feature is not simulated." };

        };
        /* Channel Information */
        if (functionname == "CB") { details = "Citizen Band:<p>The Citizen Band (CB) channels are licensed for general public use and are not owned or controlled by SES or Emergency services. We have access to these channels for communications with public and organisations who use CB. Refer to <a href=\"https://en.wikipedia.org/wiki/UHF_CB\">Wikipedia: UHF CB</a><p><ul><li>Channels 5 and 35 are designated emergency channels</li><li>Channels 22 and 23 are reserved for data only and must not be used for voice</li><li>Channels 61, 62 and 63 are reserved and should not be used at all</li></ul>"; subdetails = textinput; };
        if (functionname == "channelleft") { details = "Pressing the Left arrow on the directional pad will cycle down through the channels" };
        if (functionname == "channelright") { details = "Pressing the Right arrow on the directional pad will cycle up through the channels" };
        if (textinput == "channelleft") { subdetails = "Pressing the Left arrow on the directional pad will cycle down through the channels" };
        if (textinput == "channelright") { subdetails = "Pressing the Right arrow on the directional pad will cycle up through the channels" };
        /* Informational */
        if (functionname == "microphone") { details = "Unlike the handheld radios, the microphone does not contain a speaker. Instead sounds are produced by an external speaker.<p>The microphone on this unit also has a Duress button. The Duress button has no function on the UHF." };


        if (functionname == "busy") { details = "The radio is currently busy performing another function. You cant do two things at once on the real radio!" };

        $('#console').html(details)
        if (subdetails) $('#console').append("<p>" + subdetails)


    } else { return };

};
