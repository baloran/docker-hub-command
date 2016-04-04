var connect = require('connect');
var request = require('request');
var config = require('config');
var SlackBot = require('slackbots');
var exec = require('child_process').exec;

var app = connect();

var bot = new SlackBot({
    token: config.get('slack.token'),
    name: config.get('slack.name')
});
var params = {
  icon_emoji: ':boat:'
}

var port = process.env.PORT || 3000;

app.use('/yolo', function fooMiddleware(req, res, next) {

  var commands = config.get('commands');
  commands.forEach(function (command) {
    exec(command.exec, function (error, stdout, stderr) {
      if (error) {
        bot.postMessageToChannel(config.get('slack.channel'), 'Docker webhook triggered with error 😢', params);
      } else {
        bot.postMessageToChannel(config.get('slack.channel'), 'Docker webhook triggered with success 🚀', params);
      }
    });
  });
});

var server = app.listen(port, function () {
  request('https://diagnostic.opendns.com/myip', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Automate Docker Hub webhook");
      console.log("Your adress for the webhook is: " + body + ':' + port + '/yolo');
    }
  });
});