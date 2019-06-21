const mongoose =require('mongoose');
var mongodb = require('mongodb');
var request = require('request');
const bodyParser = require('body-parser');
var schedule = require('node-schedule');
var cron = require('cron');


const { Report} =require(process.cwd()+'/models/report');
var alias = '/nd';
module.exports = function(app, router){

var url="mongodb://dbuser:dbuser1@ds161245.mlab.com:61245/assignment_db";

mongoose.connect(url)
    .then((result)=>console.log(`Connected to db `))
    .catch((err)=>console.log(err));
       app.use(bodyParser.json());
       app.use(bodyParser.urlencoded({ extended: true }));


       app.post(alias + '/postReport',(req,res)=>{
           var tempcreated_at=req.body.created_at;
           var tempentry_id=req.body.entry_id;
           var tempfield1=req.body.field1;
           
         
        
        var report= new Report({created_at:tempcreated_at,entry_id:tempentry_id,field1:tempfield1});
            report.save();
            res.json("Success");
        });

      function timeDifference(date) {
            var date1=new Date(date);
            var date2=new Date();
            var difference = date1.getTime() - date2.getTime();
    
            var daysDifference = Math.floor(difference/1000/60/60/24);
            difference -= daysDifference*1000*60*60*24
    
           var hoursDifference = Math.floor(difference/1000/60/60);
            difference -= hoursDifference*1000*60*60
    
            var minutesDifference = Math.floor(difference/1000/60);
            difference -= minutesDifference*1000*60
    
            var secondsDifference = Math.floor(difference/1000);
            return hoursDifference;
            
      }
     app.get(alias + '/getAllReports', (req, res) => {
            
             async function getReports(){
                 const report=await Report.find();
                 console.log(report);
                 res.json(report);
             }
             getAllReports();
         
         });
     function postData(info){  
        var data=info;
            request.post({
                    
                    url: 'http://localhost:3000/nd/postReport',
                    body: data,
                    json: true
                     }, function(error, response, body){
                        
                });}
    function dailyUpdate(){   
    request('https://api.thingspeak.com/channels/479586/fields/1.json?api_key=8RLE0QA2PCUYSRN6&results=100', function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var info = JSON.parse(body)
              for(var i=0;i<info.feeds.length;i++)
              {
              var diff=timeDifference(info.feeds[i].created_at);
              console.log(diff);
              if(diff<=10)
              postData(info.feeds[i]);
              }
            }
        })

    }
    console.log(new Date());
   
/*var j = schedule.scheduleJob('35 * * * *', function(){
    dailyUpdate();
    console.log('The answer to life, the universe, and everything!');
  });*/
 
var cronJob = cron.job("0 */10 * * * *", function(){
    dailyUpdate();
    console.info('cron job completed');
}); 
cronJob.start();
  
}