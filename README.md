# Am I UP

## a website monitoring linux app in javascript

### for Use :

make sure you have __mongodb__ , __nodejs__ and __typescript__
and you have started the `mongodb`

```sh
git clone https://github.com/smaEti/AmIUp.git
cd AmIUp
npm install
npx tsc
```

### Configs:

#### make a `.env` file like the example:

```sh
# your uri for connecting to database
DBURI =
# username and password of your user for smtp
SMTP_EMAIL =
SMTP_PASSWORD =
# your smtp host and port
SMTP_HOST =
SMTP_PORT =
# the email you want to send the message from your smtp server
SMTP_USER_EMAIL =
# your telegram bot api
TELEGRAM_API =
# web proxy for telegram bot connection (required)
# if you dont want it you can delete that part from telegramServer.ts file
WEB_PROXY =
# the port you want to run your telegram server on (monitorProcess interacts with)
TELEGRAM_SERVER_PORT =
```

#### if you dont want to use smtp,telegram or sms services the app still stores the logs in database and log files and you can access them with report command

now you can use the app in `/app` directory

```sh
node monitor.js
```

## `node monitor.js help`:

```sh
| AmIUp Help

Commands:

 |DataBase Commands:
   add [website]         add the website you want to be monitored.
   remove [website]      remove the website from being monitored.
   addAlertMethod [method] [method_data]
         add a method for sending alerts and add the data related to it.
         for example addAlertMethod email email@email.com
 |Service Commands:
   start          starts the monitoring system.
   stop           stops the monitoring system.
 |Monitor Commands:
   report [website]       gives a monitor report file for the given website.
   check                  monitors the inserted websites and prints it to terminal.
```

## contribution

### If you'd like to contribute to this project, please fork it and submit a pull request. I would be grateful for your help in making it better!