// const express = require('express');
// const User = require('../models/user');
// const Room = require('../models/room');
// var jwt = require('jsonwebtoken');
// const {body,validationResult} = require('express-validator');
// const JWT_SECRET = 'Harryisagoodb$oy';
// const router = express.Router()
// const register_verify = require('../middleware/register_verify');
// // route 1: to get the room details
// router.post('/bookroom',register_verify,[
//     body('room', 'Select a valid Room').isInt({ min:1, max: 2000}),],async (req,res)=>{
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             console.log(errors)
//             return res.status(400).json({ message: errors.array()[0].msg,reponse:false }); //agar empty nahi hain means error hain
//           }
//         else{
//             const usera = await User.findById(req.user)
//             console.log(usera._id)
            
//             if(usera.room)
//             {
//                 console.log("room is true")
//                 return res.status(400).json({ message:'User already had booked a room',response:false});
//         }
                

            
            
//             try {
//                 const room = await Room.findOne({ room_no: req.body.room })
//                 if(room){
//                     return res.status(400).json({ message:'Room is already booked',response:false});
//                 }
//                 else{
                
//                 const room_obj = new Room({
//                     user:req.user,name:usera.name,room_no:req.body.room
//                 })
//                 const room_obj_save = await room_obj.save()
//                 let student = await User.updateOne({_id:usera._id},{$set: {room: true}});
//                 res.json({message:'Room regestration done &#128077;,',response:true})
//                 }
//             } catch (error) {
//                 console.log(error)
//                 res.status(500).json({ message:'server error',response:false})
//             }

//         }
        
// })
// // router 2 : to get attendance history
// router.get('/detailsroom',register_verify,async (req,res)=>{
//     try {
//         const roomdetails = await Room.find(({ "room_no" : { $gt: 0, $lt: 500 } } ))
//         res.json(roomdetails)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ errors:'server error'})
//     }
// })
// router.get('/roomnumbers',register_verify,async (req,res)=>{
//     try {
//         const roomdetails = await Room.find()
//         let roomarray=[]
//         for(let i=0;i<roomdetails.length;i++){
//             roomarray.push(roomdetails[i].room_no)
//          }

//         res.json(roomarray)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ errors:'server error'})
//     }
// })

// module.exports=router


const express = require('express');
const User = require('../models/user');
const Room = require('../models/room');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const JWT_SECRET = 'Harryisagoodb$oy';
const router = express.Router();
const register_verify = require('../middleware/register_verify');

// route 1: to book a room (room selection is optional now)
router.post('/bookroom', register_verify, [
  // room validation is optional and auto-converts to int if present
  body('room').optional().toInt().isInt({ min: 1, max: 2000 }).withMessage('Select a valid Room'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log validation warnings but allow process to continue
    console.log('Room validation skipped or invalid:', errors.array());
    return res.status(200).json({
      message: 'Room selection skipped or invalid. You can proceed.',
      response: true,
      roomValid: false
    });
  } 

  // Proceed only if room is provided and valid
  if (!req.body.room) {
    return res.status(200).json({
      message: 'No room selected. You can proceed without booking.',
      response: true,
      roomValid: false
    });
  }

  try {
    const usera = await User.findById(req.user);
    console.log(usera._id);

    if (usera.room) {
      console.log("room is true");
      return res.status(400).json({
        message: 'User already had booked a room',
        response: false
      });
    }

    const room = await Room.findOne({ room_no: req.body.room });
    if (room) {
      return res.status(400).json({
        message: 'Room is already booked',
        response: false
      });
    } else {
      const room_obj = new Room({
        user: req.user,
        name: usera.name,
        room_no: req.body.room
      });
      const room_obj_save = await room_obj.save();
      await User.updateOne({ _id: usera._id }, { $set: { room: true } });
      res.json({
        message: 'Room registration done 👍',
        response: true,
        roomValid: true
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'server error',
      response: false
    });
  }
});

// route 2: to get the room details
router.get('/detailsroom', register_verify, async (req, res) => {
  try {
    const roomdetails = await Room.find(({ "room_no": { $gt: 0, $lt: 500 } }));
    res.json(roomdetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: 'server error' });
  }
});

// route 3: to get all room numbers booked
router.get('/roomnumbers', register_verify, async (req, res) => {
  try {
    const roomdetails = await Room.find();
    let roomarray = [];
    for (let i = 0; i < roomdetails.length; i++) {
      roomarray.push(roomdetails[i].room_no);
    }
    res.json(roomarray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: 'server error' });
  }
});

module.exports = router;
