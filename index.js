class ReminderApp {
   //-----Database
   db = {
      Today: [],
      Tomorrow: [],
      Upcoming: [],
   };

   //-----Function to save reminders in localstorage
   saveReminders() {
      if (this.db) {
         localStorage.setItem("DB", JSON.stringify(this.db));
      }
   }

   //-----Function to retain data from localstorage
   getReminders() {
      this.db = JSON.parse(localStorage.getItem("DB"));
   }

   //-----Function to update data in localstorage
   updateReminder() {
      this.getReminders();

      //-----User Date info
      let date = new Date();
      let today = date.getDate();
      let tomorrow = today + 1;
      let thisMonth = date.getMonth() + 1;
      let thisYear = date.getFullYear();

      //-----Today list update
      let todayUpdatedData = this.db.Today.filter((data) => data.day == today);
      this.db.Today = todayUpdatedData;

      //-----Tomorrow list update
      for (let i = 0; i < this.db.Tomorrow.length; i++) {
         if (this.db.Tomorrow[i].day == today) {
            let updatedData = this.db.Tomorrow[i];
            Array.prototype.push.call(this.db.Today, updatedData);
         }
      }
      let tomorrowUpdatedData = this.db.Tomorrow.filter(
         (data) => data.day != today
      );
      this.db.Tomorrow = tomorrowUpdatedData;

      //-----Upcoming list update
      let upcomingUpdatedData = [];

      for (let i = 0; i < this.db.Upcoming.length; i++) {
         if (
            this.db.Upcoming[i].year == thisYear &&
            this.db.Upcoming[i].month == thisMonth
         ) {
            if (this.db.Upcoming[i].day == today) {
               let updatedData = this.db.Upcoming[i];
               Array.prototype.push.call(this.db.Today, updatedData);
            } else if (this.db.Upcoming[i].day == tomorrow) {
               let updatedData = this.db.Upcoming[i];
               Array.prototype.push.call(this.db.Tomorrow, updatedData);
            } else {
               let updatedData = this.db.Upcoming[i];
               Array.prototype.push.call(upcomingUpdatedData, updatedData);
            }
         } else if (
            this.db.Upcoming[i].year != thisYear ||
            this.db.Upcoming[i].month != thisMonth
         ) {
            let updatedData = this.db.Upcoming[i];
            Array.prototype.push.call(upcomingUpdatedData, updatedData);
         }
      }
      this.db.Upcoming = upcomingUpdatedData;
      this.saveReminders();
   }

   //-----Function to load/display data from localstorage to html page
   loadReminder() {
      this.getReminders();
      for (let i of this.db.Today) {
         todayReminderList.innerHTML += `<li>${i.reminder}</li>`;
      }

      for (let i of this.db.Tomorrow) {
         tommorrowReminderList.innerHTML += `<li>${i.reminder}</li>`;
      }

      for (let i of this.db.Upcoming) {
         otherDayReminderList.innerHTML += `<li>${i.reminder} (${i.day}-${i.month}-${i.year})</li>`;
      }
   }

   //-----Function to add data to database
   addReminder() {
      this.getReminders();

      //-----User Date info
      let date = new Date();
      let today = date.getDate();
      let tomorrow = today + 1;
      let thisMonth = date.getMonth() + 1;
      let thisYear = date.getFullYear();

      //-----Input Date info
      let reminderDate = new Date(inpDate.value);
      let reminderDay = reminderDate.getDate();
      let reminderMonth = reminderDate.getMonth() + 1;
      let reminderYear = reminderDate.getFullYear();
      if (reminder.value === "" || inpDate.value === "") {
         //------------------------------------------------------Have to do
         alert("Please enter value");
      } else {
         let data = {
            reminder: reminder.value,
            day: reminderDay,
            month: reminderMonth,
            year: reminderYear,
         };
         if (
            reminderDay == today &&
            reminderMonth == thisMonth &&
            reminderYear == thisYear
         ) {
            //-----Add data to database

            Array.prototype.push.call(this.db.Today, data);

            //-----Set data for today list
            todayReminderList.innerHTML += `<li>${reminder.value}</li>`;
         } else if (
            reminderDay == tomorrow &&
            reminderMonth == thisMonth &&
            reminderYear == thisYear
         ) {
            //-----Add data to database

            Array.prototype.push.call(this.db.Tomorrow, data);

            //-----Set data for tomorrow list
            tommorrowReminderList.innerHTML += `<li>${reminder.value}</li>`;
         } else if (reminderDate < date) {
            //-----Invalid Input date
            alert("You can't time travel to the past, Can you??");
         } else {
            //-----Add data to database
            Array.prototype.push.call(this.db.Upcoming, data);

            //-----Set data for upcoming list
            otherDayReminderList.innerHTML += `<li>${reminder.value} (${reminderDay}-${reminderMonth}-${reminderYear})</li>`;
         }
      }
      this.saveReminders();
      reminder.value = "";
      inpDate.value = "";
   }
}

const obj = new ReminderApp();

if (!localStorage.getItem("DB")) {
   obj.saveReminders();
}
obj.updateReminder();
obj.loadReminder();

let today = new Date();

dateDisplay.innerHTML = `Today: ${today.getDate()}-${
   today.getMonth() + 1
}-${today.getFullYear()}`;
