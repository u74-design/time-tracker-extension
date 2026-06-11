import express from 'express';
import Timelog from '../models/Timelog.js';

const Router = express.Router();

Router.post("/log",async (req,res)=>{
    const {date, site, ms} = req.body;

    if(!date || !site || !ms){
        return res.status(400).json({
            message: "Date, Site and ms all are require",
            succes: false
        })
    }

    try{
        const log = await Timelog.findOneAndUpdate(
            {date, site},
            {$inc : {ms}},
            {upsert: true, new: true}
        )

        res.status(200).json({
            success: true,
            data: log
        })
    }catch(err){
        console.log("Error saving log",err.message);
        res.status(500).json({
            message: err.message,
            success:false
        });
    }
});

Router.get("/summury", async (req,res)=>{
    try{
        const log = await Timelog.find()
        .sort({date : -1})
        .limit(500);

        res.status(200).json({
            data: log,
            success: true
        });
    }catch(err){
        console.log("Error getting Data",err.message)
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
});

Router.get("/summury/:date",async (req,res)=>{
    try{
        const log = await Timelog.findOne({date: req.params.date})
        .sort({ms: -1});

        res.status(200).json({
            data: log,
            success: true
        })

    }catch(err){
        console.log("Error in finding data", err.message)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export default Router;

