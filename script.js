// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(() => {
  // Load previous local storage data in an array of Objects format.
  const calendarData = JSON.parse(localStorage.getItem("calendar") || "[]");
  
  $(function () {
    // Event listener for click events on the save button.
    $(".fa-save").on("click", function (e) {
      // Find the parent div element of the clicked element
      const parent = $(this).closest('.time-block');

      // Get the ID of the parent div element
      const id = parent.attr('id');

      // Get the text inside the corresponding textarea
      const text = parent.find('textarea').val();

      // Save calendar event to local storage
      const data = {};
      data.time = id;
      data.task = text;
      calendarData.push(data);
      localStorage.setItem("calendar", JSON.stringify(calendarData))
    })
    
    // Check if there was a time change and if there was,
    // then call the updateTimeSlots function
    function checkTime() {
      // Get hour in military time
      let timeNow = Number(dayjs().format("H"));
      let previousTime = 0;

      // Only change the time block background if the time
      // is between the working hours and if the time changed
      if (timeNow > 8 && timeNow < 18) {
        if (timeNow > previousTime) {
          previousTime = timeNow;
          updateTimeSlots(timeNow);
        }
      }
    }

    // Code to apply the past, present, or future class to each time block
    function updateTimeSlots(now)
    {
           $(".container-fluid").find(".time-block").each(function (index) {
            const timeSlotId = Number($(this).attr("id").split("-")[1]);

            if (timeSlotId < now){
              $(this).removeClass().addClass("row time-block past");
            } else if (timeSlotId === now) {
              $(this).removeClass().addClass("row time-block present");
            } else if (timeSlotId > now) {
              $(this).removeClass().addClass("row time-block future");
            }
          })      
    }

    // Call the checkTime function every second
    setInterval(checkTime, 1000);

    // Get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. 
    calendarData.forEach(e => {
      const { time, task } = e
      $("#" + time).children(1).val(task);
    })

    // Display the current date in the header of the page.
    const todaysDate = dayjs().format("dddd, MMMM D, YYYY");
    $("#currentDay").text(todaysDate)
  });
});
