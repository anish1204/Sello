const express = require("express");
const router = express.Router();
const redis = require('redis');

const Leads = require('../models/Leads');


const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
})
redisClient.on('connect',()=>{
  console.log('Redis connected');
})
redisClient.on('error', (err) => {
  console.log('Redis error: ' + err);
});


router.post('/',async(req,res)=>{
    try{
      const { Name, doNotEmail, doNotCall, totalVisits, totalTimeSpentOnWebsite, pageVisitPerView } = req.body;
      const newItem = new Leads({ Name, doNotEmail, doNotCall, totalVisits, totalTimeSpentOnWebsite, pageVisitPerView });
      await newItem.save();
      
      // Optionally set Redis cache for POST request (this would be useful in cases where you want to cache individual items as they are added)
      redisClient.set(newItem._id.toString(), 3600, JSON.stringify(newItem)); // Cache the new item for 1 hour (3600 seconds)

      res.status(201).json(newItem);
    }
    catch (err){
        res.status(500).json({ error: err.message})
    }
})

router.get("/", async (req, res) => {
    try {
      redisClient.get("all_leads", async (err, data) => {
        if (data) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(data)); // Return cached data
        } else {
            console.log('Cache miss');
            const items = await Leads.find();
            
            // Store the fetched data in Redis for future requests (cached for 1 hour)
            redisClient.set("all_leads", 3600, JSON.stringify(items));
            
            res.status(200).json(items);
        }
    });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;