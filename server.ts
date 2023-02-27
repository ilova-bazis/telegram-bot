import { Telegraf } from "telegraf";
import { Person, PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient()
if(!process.env.BOT_TOKEN) { throw new Error("Environment variable BOT_TOKEN not found") }
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(async (ctx) => await ctx.reply('Hi! Agent 0719 Ready to serve!'))
bot.help(async (ctx) => await ctx.reply(
    'List of commands\n' + 
    '/add NAME - adds a person to the list\n' +
    '/list - lists all people in the list with order number\n' +
    '/remove NAME - removes person from the list\n' +
    '/next - Prints who is next\n' +
    '/current - Prints who is current\n' +
    '/setcurrent NAME - set person as current\n' +
    '/setorder NAME ORDER - changes the person\'s order\n' +
    '/quit - Orders the bot to leave the chat'

))
bot.command('quit', async (ctx) => {
    await ctx.leaveChat()
})
bot.command('list', async (ctx) => {
    const people = await prisma.person.findMany({
        orderBy: {
            order: "asc"
        }
    })
    var list = ""
    people.forEach( val => {
        list += `${val.order}. ${val.name}\n`
    })
    if(list.length < 1) {
        await ctx.reply("List is empty")
        return
    }
    ctx.reply(list)
})
bot.command('remove',async (ctx) => {
    const arr = extractArguments(ctx.message.text)
    if(arr.length < 1){
        await ctx.reply("Remove command usage: /remove NAME")
        return 
    }
    const name = arr.join(" ")
    const person = await prisma.person.findFirst({
        where: {
            name: name
        }
    })
    if(person) {
        await prisma.person.delete({
            where: {
                id: person.id
            }
        })
        await ctx.reply("Success! " + name + " is deleted")
    }
    else {
        await ctx.reply("Person not found!")
    }
})

bot.command('setorder', async (ctx) => {
    const arr = extractArguments(ctx.message.text)
    if(arr.length < 2){
        await ctx.reply("Set order command usage: /setorder NAME ORDER")
        return 
    }
    let order = parseInt(arr.pop()!)
    if(!order) {
        await ctx.reply("Set order command usage: /setorder NAME ORDER")
        return 
    }
    const name = arr.join(" ")
    const person = await prisma.person.findFirst({
        where: {
            name: name
        }
    })
    if(!person) {
        await ctx.reply("Person not found")
        return
    }
    if(person.order === order) {
        await ctx.reply("The person already has this order")
        return
    }
    const people = await prisma.person.findMany({
        where: {
            id: { not: person.id }
        },
        orderBy: {
            order: "asc"
        }
    })
    let prevOrder = person.order
    person.order = order
    let firstHalf: Person[] = []
    let secondHalf: Person[] = []
    if(order>prevOrder) {
        firstHalf = people.filter(v => v.order <= order)
        secondHalf = people.filter(v => v.order > order)
    }
    else {
        firstHalf = people.filter(v => v.order < order)
        secondHalf = people.filter(v => v.order >= order)
    }
    let newArray = firstHalf
    newArray.push(person)
    newArray.push(...secondHalf)
    newArray = reorder(newArray)
    await prisma.$transaction(
        newArray.map (val => prisma.person.update({
            where: {
                id: val.id
            },
            data: {
                
                order: { set: val.order }
            }
        }))
    )
    await ctx.reply("Success. Order set.")
})

bot.command('setcurrent', async (ctx)=> {
    const arr = extractArguments(ctx.message.text)
    if(arr.length < 1){
        ctx.reply("Add command usage: /add NAME")
        return 
    }
    const name = arr.join(" ")
    const person = await prisma.person.findFirst({
        where: {
            name: name
        }
    })
    if(!person) {
        ctx.reply("Person not found")
        return
    }
    await prisma.person.updateMany({
        data: {
            current: false
        }
    })
    await prisma.person.update({
        where: {
            id: person.id
        },
        data: {
            current: true
        }
    })
    ctx.reply("Success! Current set to: " + person.name)
})

bot.command('current', async (ctx) => {
    const person = await prisma.person.findFirst({
        where: {
            current: true
        }
    })
    if(person ) {
        await ctx.reply("Current is " + person.name)
    }
    else {
        await ctx.reply("Current not found")
    }
})
bot.command('next', async (ctx)=> {
    const people = await prisma.person.findMany({
        orderBy: {
            order: "asc"
        }
    });
    // console.log(people)
    const currentPerson = people.filter(val => val.current)
    let nextOrder = 0
    if(currentPerson.length > 0){
        nextOrder = (currentPerson[0].order) % people.length 
    }
    await ctx.reply("Next is " + people[nextOrder].name)
})
bot.command('add', async (ctx) => {
    const arr = extractArguments(ctx.message.text)
    if(arr.length < 1){
        await ctx.reply("Add command usage: /add NAME")
        return 
    }
    const name = arr.join(" ")
    if(await prisma.person.findFirst({where: { name: name}})) {
        await ctx.reply("This name already in the list")
        return 
    }
    const people = await prisma.person.findMany()
    const order = people.reduce((res, next)=> {
        if(next.order > res) {
            return next.order
        }
        return res
    }, 0)

    await prisma.person.create({
        data:{
            name: name,
            order: order + 1,
            ts: new Date()
        }
    })
    ctx.reply("Success. Added " + name + " with order number " + (order + 1))
})
bot.hears('salom', (ctx) => ctx.reply('Salom! Salom!'));
bot.hears('ош',  async (ctx) => { 
    if(0.7 > Math.random()) {
        await ctx.reply('Оши палав бомаза! Оши палав аҷоиб!')
    }
})
bot.launch();

function extractArguments(text: string): string[] {
    const arr = text.split(" ")
    if(arr.length < 2){
        return []
    }
    arr.shift()
    return arr
}

function reorder(people: Person[]): Person[] {
    for(let i = 1; i <= people.length; i++) {
        people[i-1].order = i
    }
    return people
}

process.once('SIGINT', async () => { bot.stop('SIGINT'); await prisma.$disconnect() });
process.once('SIGTERM', async () =>{ bot.stop('SIGTERM'); await prisma.$disconnect() });