import React, { useState } from "react";
import "./DateSelector.css";

const getTimezoneOptions = () => {
  // Replace this array with your desired timezone options
  return [
    { value: "utc", label: "UTC" },
    { value: "est", label: "Eastern Standard Time (EST)" },
    // Add more timezone options as needed
  ];
};

function DateSelector() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("utc");
  const [meetingDuration, setMeetingDuration] = useState("");

  const handleScheduleMeeting = () => {
    // Add your logic for scheduling the meeting here
    console.log("Meeting Scheduled:", {
      startTime,
      endTime,
      timezone,
      meetingDuration,
    });
  };

  return (
    <div className="date-selector">
      <h1>Meeting Scheduler</h1>
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <label>
        Timezone:
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {getTimezoneOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Meeting Duration (minutes):
        <input
          type="number"
          value={meetingDuration}
          onChange={(e) => setMeetingDuration(e.target.value)}
        />
      </label>
      <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
    </div>
  );
}

export default DateSelector;
