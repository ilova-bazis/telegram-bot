const express = require('express');
const expressApp = express();
const axios = require('axios');
const path = require('path');
const port = process.env.PORT || 3000;
expressApp.use(express.static('static'))
expressApp.use(express.json())
require('dotenv').config() 

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN)

expressApp.get("/", (req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it', {
    })
})

bot.command('next', ctx => {
    console.log(ctx);
    bot.telegram.sendMessage(ctx.chat.id, "All good")
} )

bot.launch()