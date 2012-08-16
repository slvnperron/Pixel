# Pixel
An external API for the Laval University's [Pixel](https://pixel.fsg.ulaval.ca) plateform.

## Requirements

* NodeJS
* NPM
* MongoDB

## Installation

* Install NPM, on Ubuntu it's as simple as:
	
	sudo apt-get install npm

* Install MongoDB

	sudo apt-get install mongodb
	
* Install NPM modules

	npm install numpad optimist mongojs jsdom

* And you're ready to go

## Usage

* --session is a session code with the form YYYYmm where mm={01/05/09}.
	
	i.e: Fall 2010 is 201009

* --p is your Pixel password, which _may_ be different from your Capsule's password.

### Single NRC Api

Pixel is very simple to use :
``` bash
node spider.js --u USERNAME --p PASSWORD --session CODE --nrc NRC
```

