//const moment = require('moment-timezone');
function changeInTimeZone( date , timeZone){
  let nDate = date.toLocaleString('en-us',{timeZone: timeZone })
  nDate = new Date(nDate) 
  let diff = nDate.getTime() - date.getTime()
  return new Date(date.getTime() - diff)
}
console.log(changeInTimeZone(new Date('2024-01-20T15:30:00'), 'America/New_York'))
// Function to calculate empty time slots based on events
function calculateEmptySlots(startDateTime, endDateTime, events, meetingDuration) {
  // Initialize empty slots array
  const emptySlots = [];
  
  // Check if there are no events for the day
  if (events.length === 0) {
    emptySlots.push({
      start: startDateTime,
      end: endDateTime,
    });
    return emptySlots;
  }

  // Sort events by start time
  events.sort((a, b) => {
    return new Date(a.start.dateTime) - new Date(b.start.dateTime);
  });


  // const currDay = new Date()

  // if (currDay > startDateTime){
  //   return emptySlots;
  // }
  
  

  // Add a slot from the start of the day until the first event
  const firstEventStart = new Date(events[0].start.dateTime);
  if (firstEventStart > startDateTime) {
    const diff = (firstEventStart.getTime() - startDateTime.getTime())/(1000 * 60);
    if (diff >= meetingDuration){emptySlots.push({
      start: startDateTime,
      end: firstEventStart,
    });};
  }

  // Add slots between events
  for (let i = 0; i < events.length - 1; i++) {
    const currentEventEnd = new Date(events[i].end.dateTime);
    const nextEventStart = new Date(events[i + 1].start.dateTime);
    if (currentEventEnd < nextEventStart) {
      const diff = (nextEventStart.getTime() - currentEventEnd.getTime())/(1000 * 60);
      if (diff >= meetingDuration){
        emptySlots.push({
          start: (currentEventEnd),
          end: (nextEventStart),
        });
      }
    }
  }

  // Add a slot from the end of the last event until the end of the day
  const lastEventEnd = new Date(events[events.length - 1].end.dateTime);
  
  // console.log(lastEventEnd);

  if (lastEventEnd < endDateTime) {
    const diff = (endDateTime.getTime() - lastEventEnd.getTime())/(1000 * 60);
    if (diff >= meetingDuration){
      emptySlots.push({
        start: (lastEventEnd),
        end:   (endDateTime),
      });
    }
  }

  return emptySlots;
  }

  // Function to convert time to UTC based on the specified timezone
function convertToUTC(time, timezone) {
  const offset = moment.tz(time, timezone).utcOffset(); // Get the offset in minutes
  const utcTime = moment(time).subtract(offset, 'minutes').toISOString();
  return utcTime;
}

// Function to calculate duration in minutes
function calculateDurationInMinutes(duration) {
  const durationInMinutes = moment.duration(duration).asMinutes();
  return durationInMinutes;
}





module.exports = {
    calculateEmptySlots,
    convertToUTC,
    calculateDurationInMinutes,
    changeInTimeZone,
};