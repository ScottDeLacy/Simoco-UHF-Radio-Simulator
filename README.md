# Simoco UHF Radio Simulator
A HTML / Javascript simulator of the Simoco UHF Radiohead for the Victorian State Emergency Service (circa ~2016)

I am releasing this for prosperity and to demonstrate the efforts I sometimes go to, to do something nice for others. *insert eye roll here*
This is a very specific training aid, which is not really relevent today (2022). So I don't mind if you use this as a template for your own work.

This is the final release that I have on hand, I think... There may likely have been some small changes to the online version that was on the SES intranet, but the core functionality remains unchanged.

## Background history
Victoria SES operates with three radio bands; (HF, VHF and UHF), with the UHF band being primarilly used for local communications. 

This simulator was created as a training aid for Victorian State Emergency Services volunteers to familiarise themselves with the Simoco UHF Radiohead and its specific SES programmed functions. The intention was to expand on this simulator to include the Simoco VHF radiohead and the UHF handhelds that were also in use.

The requirements that dicated the code were (at the time) to ensure the highest level of copmatibility with a mix of infrastructure from Windows, Linux, iOS and Android, with the view being to provide the applet as a part of the internal SES 'intranet' (members only). As such, HTML and Javascript were used, as this fulfilled that requirement and was also in line with requirements for the state controlled website.

After several months of development which included investigation, coding, training/delivery aspects, testing and obtaining feedback the simulator was complete. Then began at least six months (or more?) of bureaucratic back and forth and waiting, until finally it was approved and published for all members of the VICSES to access.

Around 2017-2018 there was talk and then confirmation that the Victorian Government would migrate the SES to the encrypted MMR/RMR networks. Details were sketchy at the time other than the radio networks were to also be encrypted. Further development on this project ceased around that time - since everything was about to change anyway. https://en.wikipedia.org/wiki/Government_radio_networks_in_Australia#Victorian_Government_Radio_Networks

Naturally the roll-out was delayed and didnt actually happen until years later. During that time I had moved on from SES and the radio simulator remained available. It is unkown to me how long it lasted on the SES intranet.

## Design and Development
In order to create the simulator as true to real life as possible, but also being realistic that it was a 2D representation, there were several key aspects taken into consideration.

The solution had to be 'drop in place' and not require external database connections or constant connection to the internet.
The solution had to work on any major OS and not have requirements on the OS to be 'updated'.
The solution had to display dynamic animation and output sound.
The solution had to be as small in size as possible.
The solution had to be as simple as possible (allowing for contribution and editing)

Considering the above, the target audience, the target devices and disparity of technology available to SES units (think 10-15 year old computers running linux, Windows XP-10, unit owned & controled, and 'state' owned on a managed domain); HTML and Javascript was the only choice.

### Design process
In simple terms, the process involved:

1. Research
2. Data gathering
3. Content building
4. 'Framing' & styling
5. Validation, Testing & Feedback
###

1. Research
First thing was to see what information was available on the Simoco headunit. I obtained the technical manual which also conventiately had the button/beep/squak tones which were fully listed by frequency, pulse and duration. (total life saver really)
From a training perspective, the target audience was thoroughly researched and training goals were set. The IT equipment and capabilities were also obtained.

The result was knowing what had to be done and what 'could' be done, with the manual and stock images of the radiohead in hand.

2. Data gathering
Multiple high res photos of the radiohead was obtained. Real life photos, generated photos with all kinds of lighting and shading. It was worse, because the colouring was different in each photo, which made narrowing down the colours of the LCD to be near impossible.

After sorting through all of the possible candidates, only the stock promotional photos were of any use. Everything else just did not work, and looked terrible.
Taking my own high res phoots were equally terrible, although would have been a nice personal touch for my SES unit, it would have been ill placed elsewhere. Natural was not better.

I sifted through the manual to take the stock functions that were accessible to a 'user' (which all depend on firmware/admin options being set by 'owner')
A few hours of video over a 3 week period was also taken and I sifted through those to identify the menu functions, the options, the response from one screen or buttion press to the other. You would be surprised just how nuanced it can be.

3. Content building
Having obtained the information needed, some form of database was required. Channel lists, menu's, etc. The obvious way would be to use JSON formats. These were compiled and checked, then rechecked.

The audio needed to be created from scratch. I attempted to record live sounds, and some were almost useable, however the file size of recorded audio and the background noise of the power supply fan, aircon etc was too difficult to handle, since the subject beep or tone often had a duration of less than 1 second; there was no possible way to capture a sound profile or use any audio filtering in a DAW.

Using Audacity tone generater and the Simoco manual I obtained, the system tones/beeps could be generated exactly to the pitch, pulses and duration as specified. The sound was a true 1:1 creation of the original which was perfect.

The white noise was also generated and used in place. Perhaps not quite the same but it was only used to add some 'realisim' to the simulator.

The base image of the radiohead has the LCD cut out. This was used as the static image, with the LCD being for dynamic web generated content.

4. 'Framing' & styling
A miniamlistic approach was needed.
The CSS was created to mimic the LCD screen, with the use of blending to give the backlight the correct colouring and function.

The tooltips were styled rather hastedly, but if I recall, the styling was borrowed from something similar in use on the website, so it was desigend to be as close to 'familiar' as possible. It was also easily adapted to any other styling, but it was made for demonstration more than prettiness. (I don't think it was that bad?!)

The layout was intended to work with iframe or to be dropped in place on a larger website, so to that extent, some different html files were tested and used and the entire radiohead can be centered or aligned left or fixed position.

I recall at the time, there were issues getting the LCD and radiohead lined up for all browsers; which at the time I was testing at least 4 older versions of Safari, IE, Chrome and firefox. I don't remember now exactly what it was, only that were I landed with the way it was styled, was on purpose and may have been borne out of some measure of frustration.

Two presentations were provided. One with tooltips and one without. This was for training delivery options and self-guided practice. The only difference being (If I recall correctly) was toggling the display of the tooltips on/off.

One of the biggest challenges was to replicate the scanning arrow that rotates in a 360 degree arc. This was something that took extensive search for an even smarter person than me, who had already solved this problem with another object or image. Recoding that solution, I was able to implement the arrow and at such a way that it is almost identical to the real thing. Unfortunately during testing, some iOS or browser combinations displayed the symbol incorrectly. (I dont know if I fixed that by replacing it with a static image vs a text character, but that is the obvious fix)

5. Validation, Testing & Feedback
Once completed, I self validated as best as possible, comparing video footage and side by side testing. As formally as possilbe, working through each menu, and JSON file, it seemed to be 100%. Next phase was to pass it to others to validate and test and sure enough bugs were found.
Repeating the cycle over and over and eventually once completed, it went through to the submitting it to headoffice for approval and that is more or less the story.

## How to use
Clone the entire repo and place in a single folder. Host the entire folder on your webhost or open up one of the HTML files locally.

## It doesn't work
Yes it does. But likely Java has deprecated something and could be complaining. 
It is old code, so you can fix it if you want or try another browser or even spin up a virtual environment with older browser and java on it.

Audio is a funny thing.. because the audio files are short in duration, some browsers cant handle that now days. sad. Wait a minute or two and hit refresh and try... ;)

At the time of writing this, I tested this in the latest version of Firefox and it is partially bugged, so oh well.
I assure you it worked flawlessly at the time.

