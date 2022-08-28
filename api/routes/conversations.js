const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {
  const memberArray = [req.body.senderId, req.body.receiverId];
  memberArray.sort();

  //check whether connection is setup or not 
  try {
    const conversation = await Conversation.find({
      members: memberArray
    });
    if(conversation.length == 0){
      const newConversation = new Conversation({
        members: memberArray,
      });
      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    else{
      res.status(200).json({"result" : "Data Already Exists"})
    }
  } catch (err) {
    console.log(err);
  }  
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
