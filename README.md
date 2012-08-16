# Pixel
An external API for the Laval University's [Pixel](https://pixel.fsg.ulaval.ca) plateform.

## Requirements

* NodeJS
* NPM
* MongoDB

## Installation

* Install NPM, on Ubuntu it's as simple as:

``` bash
	sudo apt-get install npm
```

* Install MongoDB

``` bash
	sudo apt-get install mongodb
```

* Install NPM modules

``` bash
	npm install numpad optimist mongojs jsdom
```

* And you're ready to go

## Usage

* --s is a session code with the form YYYYmm where mm={01/05/09}.

```	bash
	Fall 2010 is 201009
```

* --p is your Pixel password, which _may_ be different from your Capsule's password.

### Single NRC Api

Pixel is very simple to use :

``` bash
node spider --u USERNAME --p PASSWORD --s CODE --nrc NRC
```

### Batching NRCs in a session

Pixel can batch multiples NRCs in a single session :

``` bash
node batch --u USERNAME --p PASSWORD --s SESSION_CODE --nrc STARTING_NRC
```

This operation will batch fetches to Pixel from STARTING___NRC to 99999 (a NRC can only have 5 digits)_

### Accessing results

Retreiving all courses:

``` bash
mongo pixel
> db.courses.find()
```

Retreiving courses with custom queries:

``` bash
mongo pixel
> db.courses.find({ session: '201009' })
```

You can export the whole database JSON with mongoexport
