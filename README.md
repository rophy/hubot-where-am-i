# hubot-where-am-i
[![Build Status](https://img.shields.io/travis/johnkchiu/hubot-where-am-i/master.svg?style=flat-square)](https://travis-ci.org/johnkchiu/hubot-where-am-i)
[![NPM Version](https://img.shields.io/npm/v/hubot-where-am-i.svg?style=flat-square)](https://www.npmjs.com/package/hubot-where-am-i)

Hubot for tracking OOO, WFH, PTO, etc.

See [`src/where-am-i.js`](src/where-am-i.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-where-am-i --save`

Then add **hubot-where-am-i** to your `external-scripts.json`:

```json
[
  "hubot-where-am-i"
]
```

### Commands

```
//   _<date>_ - It can be `today`, `tomorrow` or `MM/DD/YYYY`..
//   _<user>_ - It can be `everyone` or `@<username`.
//   *hubot OOO|WFH|PTO <date> <message>* - Sets your out of office.  <date> is optional and defaults to `today`.  <message> are optional.
//   *hubot clear <date>*                 - Clears your out of office.  <date> is optional and defaults to `today`.
//   *hubot where am i*                   - Prints your out of office dates.
//   *hubot where is <user> <date>*       - Prints <user>'s out of office.  <date> is optional and defaults to all dates.
```

## Sample Interaction

```
user1>> OOO
hubot>> [01/07/2016] user1​ is ​OOO ...​

user1>> OOO tomorrow
hubot>> [01/08/2016] user1​ is ​OOO ...

user1>> OOOO 1/30/2016 because I don’t feel so good.
hubot>> [01/30/2016] user1 is OOO because I don’t feel so good....

user1>> where am i
hubot>> [01/07/2016] user1​ is ​OOO ...
hubot>> [01/08/2016]​ user1​ is ​OOO ...
hubot>> [01/30/2016] user1​ is ​OOO because I don’t feel so good....

user2>> where is @user1
hubot>> [01/07/2016] user1​ is ​OOO ...
hubot>> [01/08/2016] user1​ is ​OOO ...
hubot>> [01/30/2016] user1​ is ​OOO because I don’t feel so good....

user1>> clear today
hubot>> ~[01/07/2016] user1​ is ​OOO ...~

user2>> where is @user1 tomorrow
hubot>> [01/08/2016]​ user1​ is ​OOO ...
```
