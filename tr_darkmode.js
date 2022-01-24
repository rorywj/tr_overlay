get_dm_kv();
var darkmode;

window.addEventListener('onEventReceived', function (obj) {
  	const listener = obj.detail.listener;
  	const data = obj.detail.event.data;
    if (listener == "kvstore:update") {
      	if(data.hasOwnProperty('dm_data')) {
          	set_darkmode(data["dm_data"]);
        }
    }
});

function get_dm_kv() {
  SE_API.store.get('dm_data').then(obj => {
      set_darkmode(obj);
  });
}

function set_darkmode(obj) {
      if(obj.dm_mode == "Auto") {
          var now = new Date(); //New date object 
          var time_now = now.getTime();
          var now_year = now.getFullYear();
          var now_month = now.getMonth();
          var now_date = now.getDate();
          var on = new Date(obj.dm_on); //New date object from 'on' time hh:mm
          on.setFullYear(now_year, now_month, now_date); //Set 'on' date to today
          var on_time = on.getTime();
          var off = new Date(obj.dm_off); //New date object from 'off' time hh:mm
          off.setFullYear(now_year, now_month, now_date); //Set 'off' date to today
          var off_time = off.getTime();
          if (time_now > off_time && time_now < on_time) { //If time now is between off time and on time
              //Activate Light mode
              lightswitch();
              on_timecheck(on_time, off_time);
          } else { //If time now is after on time or before off time
              //Activate Dark mode
              darkswitch();
			  off_timecheck(on_time, off_time);	  
          }
      }
      if(obj.dm_mode == "On") {	
          //Activate Dark mode
          darkoverride();
      }
      if(obj.dm_mode == "Off") {	
          //Activate Light mode
          lightoverride();
      }
      $("#main_container").fadeIn();
}

function on_timecheck(on_time, off_time) {
  	var n2 = new Date();
  	let time_n2 = n2.getTime();
  	var switch_on_in = (on_time - time_n2); //Time left until dark mode should turn on
  	console.log("Switch dark mode on in: " + switch_on_in);
	var timeout_n2 = Math.min(Math.max(switch_on_in, 1000), 3600000); //Make sure timeout is at least 1000ms
    setTimeout(readKV, timeout_n2); //Read dark mode kv again after timeout
}

function off_timecheck(on_time, off_time) {
  	var n3 = new Date(); 
  	let time_n3 = n3.getTime();
  	//Make sure it's AM
  	if (n3.getHours() >= 0 && n3.getHours() < 12 ) {
      	var switch_off_in = (off_time - time_n3); //Time left until dark mode turns off
      	console.log("Switch dark mode off in: " + switch_off_in);
      	var timeout_n3 = Math.min(Math.max(switch_off_in, 1000), 3600000); //Make sure timeout is at least 1000ms
      	setTimeout(readKV, timeout_n3); //Read dark mode kv again after timeout	
    } 	
}
