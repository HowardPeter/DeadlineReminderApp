class ReminderApp {
   //-----Database
   db = {
      Today: [],
      Tomorrow: [],
      Upcoming: [],
   };

   //-----FUnction to save reminders in localstorage
   saveReminders() {
      if (this.db) {
         localStorage.setItem("DB", JSON.stringify(this.db));
         console.log(`Save Reminder working`);
      }
   }

   getReminders() {
      this.db = JSON.parse(localStorage.getItem("DB"));
      console.log(`Get Reminder working`);
   }

   taskComplete(e) {
      this.getReminders();

      console.log(e.value);
   }

   updateReminder() {
      this.getReminders();

      //-----User Date info
      let date = new Date();
      let today = date.getDate();
      let tomorrow = today + 1;
      let thisMonth = date.getMonth();
      let thisYear = date.getFullYear();

      let data = {};
      console.log(`update working`);

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
      for (let i = 0; i < this.db.Upcoming.length; i++) {
         if (
            this.db.Upcoming[i].year == thisYear &&
            this.db.Upcoming[i].month == thisMonth &&
            this.db.Upcoming[i].day == today
         ) {
            let updatedData = this.db.Upcoming[i];
            Array.prototype.push.call(this.db.Today, updatedData);
         } else if (
            this.db.Upcoming[i].year == thisYear &&
            this.db.Upcoming[i].month == thisMonth &&
            this.db.Upcoming[i].day == tomorrow
         ) {
            let updatedData = this.db.Upcoming[i];
            Array.prototype.push.call(this.db.Tomorrow, updatedData);
         }
      }
      let upcomingUpdatedData = this.db.Upcoming.filter(
         (data) => data.day != today && data.day != tomorrow
      );
      this.db.Upcoming = upcomingUpdatedData;
      console.log(data);
      this.saveReminders();
   }

   loadReminder() {
      console.log("Working");
      // this.saveReminders();
      this.getReminders();
      for (let i of this.db.Today) {
         todayReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check"> ${i.reminder}</li>`;
      }

      for (let i of this.db.Tomorrow) {
         tommorrowReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check"> ${i.reminder}</li>`;
      }

      for (let i of this.db.Upcoming) {
         otherDayReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check"> ${i.reminder} (${i.day}-${i.month}-${i.year})</li>`;
      }
   }

   addReminder() {
      this.getReminders();

      //-----User Date info
      let date = new Date();
      let today = date.getDate();
      let tomorrow = today + 1;
      let thisMonth = date.getMonth();
      let thisYear = date.getFullYear();

      //-----Input Date info
      let reminderDate = new Date(inpDate.value);
      let reminderDay = reminderDate.getDate();
      let reminderMonth = reminderDate.getMonth();
      let reminderYear = reminderDate.getFullYear();

      let data = {
         reminder: reminder.value,
         day: reminderDay,
         month: reminderMonth,
         year: reminderYear,
         completed: false,
      };

      if (
         reminderDay == today &&
         reminderMonth == thisMonth &&
         reminderYear == thisYear
      ) {
         //-----Save reminder to localstorage

         Array.prototype.push.call(this.db.Today, data);
         this.saveReminders();

         //-----Set reminder for today
         todayReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check">${reminder.value}</li>`;
      } else if (
         reminderDay == tomorrow &&
         reminderMonth == thisMonth &&
         reminderYear == thisYear
      ) {
         //-----Save reminder to localstorage
         Array.prototype.push.call(this.db.Tomorrow, data);
         this.saveReminders();

         //-----Set reminder for tomorrow
         tommorrowReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check">${reminder.value}</li>`;
      } else if (reminderDate < date) {
         //-----Invalid Input date
         alert("You can't time travel to the past, Can you??");
      } else {
         //-----Save reminder to localstorage
         Array.prototype.push.call(this.db.Upcoming, data);
         this.saveReminders();

         //-----Set reminder for upcoming
         otherDayReminderList.innerHTML += `<li><input type="checkbox" onclick="obj.taskComplete(this)" class="check">${reminder.value} (${reminderDay}-${reminderMonth}-${reminderYear})</li>`;
      }
   }
}

const obj = new ReminderApp();

if (!localStorage.getItem("DB")) {
   obj.saveReminders();
}
obj.updateReminder();
obj.loadReminder();

let t = new Date();
console.log(t);

document.querySelector(".title").innerHTML = t.getDate();
