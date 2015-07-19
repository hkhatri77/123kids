var client = new eventful.Client(S2JXWfF9x67LXtpR);
console.log('testing');

client.searchEvents({ keywords: 'music' }, function(err, data){
 
  if(err){
  
    return console.error(err);

  
  }
  
  console.log('Recieved ' + data.search.total_items + ' events');
  
  console.log('Event listings: ');
  
  //print the title of each event 
  for(var i in data.search.events){
  
    console.log(data.search.events[i].title);
  
  }
 
});

