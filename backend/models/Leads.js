const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  "Name": { type: String, required: true },
  "doNotEmail": { type: String },
  "doNotCall": { type: String },
  "totalVisits": { type: String },
  "totalTimeSpentOnWebsite": { type: String },
  "pageVisitPerView": { type: String }
});

module.exports = mongoose.model("Lead", LeadSchema);
