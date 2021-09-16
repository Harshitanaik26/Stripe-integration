if(process.env.NODE_ENV!='production'){
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripePublicKey,stripeSecretKey)

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)
const bodyParser = require('body-parser')


app.set('view-engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/store',function(req,res){
    fs.readFile('items.json',function(error,data){
        if(error){
            res.status(500).end()
        }else{
            res.render('store.ejs',{
                key:stripePublicKey,
                items:JSON.parse(data)
            })
        }
    })
})

app.post('/payment',(req,res)=>{
  stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken,
    name:'Harshita Naik',
    address:{
      line1:'Belgaum Karnataka',
      postal_code:'590001',
      city:'Belgaum',
      state:'Karnataka',
      country:'India'
    }
  })
  .then((customer)=>{
    return stripe.charges.create({
      amount:8000,
      description:'Product 1',
      currency:'INR',
      customer:customer.id
    })
  })
  .then((charge)=>{
    console.log(charge)
    res.send("SUCCESS")
  })
  .catch((err)=>{
    res.send(err)
  })
})

app.listen(3000)


/*const stripe = require('stripe')('sk_test_51JXSDySJ5nvH2QmBug9yVNfDhqceyTSLLRKsvzVipQhQcRQG6CqA88nFepJLSlwpL6vrMkYBJT0s7Ycxrnb8Xa5200OLYsCR8S');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url)
});

app.listen(4242, () => console.log('Running on port 4242'));*/






/*app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // TODO: replace this with the `price` of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      payment_method_types: [
        'card',
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
    res.redirect(303, session.url)
  });*/