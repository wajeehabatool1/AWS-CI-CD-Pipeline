import express from 'express';
import moment from 'moment';
import * as emoji from 'node-emoji';


const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`Welcome to the AWS CI/CD practice app! ${emoji.get('rocket')} ${emoji.get('cloud')}`);
});

app.get('/hello', (req, res) => {
  const randomEmoji = emoji.random();
  res.send(`Hello, AWS CI/CD! Here's a random emoji for you: ${randomEmoji.emoji}`);
});

app.get('/time', (req, res) => {
  const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  res.send(`The current time is: ${currentTime} ${emoji.get('clock')} ${emoji.get('hourglass_flowing_sand')}`);
});

app.get('/joke', (req, res) => {
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛💡",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😢📝",
    "Why do programmers hate nature? It has too many bugs. 🌳🐞",
    "Why did the developer go broke? Because he used up all his cache! 💸",
    "Why did the functional programmer get thrown out of school? Because he refused to take classes. 🏫🚫",
    "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25! 🎃🎄",
    "Why do Java developers wear glasses? Because they don't C#! 👓",
    "What's a programmer's favorite hangout place? The Foo Bar. 🍻",
    "Why did the programmer quit his job? Because he didn't get arrays. 💼👋",
    "What do you call a programmer from Finland? Nerdic. 🇫🇮👨‍💻"
  ];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  res.send(`Here's a programming joke for you: ${randomJoke}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} ${emoji.get('headphones')}`);
});

// Simulate server running and accessing routes
console.log('Simulating server requests:');
console.log(`GET / ${emoji.get('house')}`);
console.log(`GET /hello ${emoji.get('wave')}`);
console.log(`GET /time ${emoji.get('alarm_clock')}`);
console.log(`GET /joke ${emoji.get('joy')}`);
