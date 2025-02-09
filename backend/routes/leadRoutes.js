const express = require("express");
const router = express.Router();

const Leads = require('../models/Leads');

router.post('/',async(req,res)=>{
    try{
        const {Name,doNotEmail,doNotCall,totalVisits,totalTimeSpentOnWebsite,pageVisitPerView} = req.body;
        const newItem = new Leads({Name,doNotEmail,doNotCall,totalVisits,totalTimeSpentOnWebsite,pageVisitPerView});
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch (err){
        res.status(500).json({ error: err.message})
    }
})

router.get("/", async (req, res) => {
    try {
      const items = await Leads.find();
      console.log(items);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;