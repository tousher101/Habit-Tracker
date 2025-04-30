habitTracker();


function habitTracker(){
 let habits = JSON.parse(localStorage.getItem('pain')) || [{
  
    id: 1,
    name: 'Drink Water',
    frequancy: 'Everyday',
    streak:'0',
    completed: false,
    lastCompletedDate : '',
  
    
},
{  id: 2,
    name: 'Drink Beer',
    frequancy: 'Weekly',
    streak:'0',
    completed: false,
    weeklyTarget: '',
    weeklyProgress: '',
    lastCompletedDate : '',
   
    

},
{id: 3,
    name: 'Drink Water',
    frequancy: 'Custom',
    streak:'0',
    completed: false,
    customFrequancy:[''],
    lastCompletedDate : '',


}];

document.querySelector('.js-add-btn').addEventListener('click',()=>{
    document.querySelector('.habit-input').style.display = 'flex';
    const weeklyToggaled = document.querySelector('.js-Weekly-checkbox')
 weeklyToggaled.addEventListener('change',(event)=>{
    if(event.target.checked){document.querySelector('.js-toggled-hide').classList.add('its-toogled')}
    else{document.querySelector('.js-toggled-hide').classList.remove('its-toogled')}
   
 });
});
const customToogled = document.querySelector('.js-frequancy-checkbox');
const toggledHide = document.querySelector('.js-toggled-hide-custom-frequancy');
customToogled.addEventListener('change',(event)=>{
    if(event.target.checked){toggledHide.classList.add('its-open')}
    else{toggledHide.classList.remove('its-open')}
});


document.addEventListener('click', (event) => {
    if (event.target.closest('.submit-btn')) {
        addHabit();
        displayHabit();
        displayDashboard();
        saveToStorage();

        document.querySelector('.habit-input').style.display = 'none';

        const nameInput = document.querySelector('.input-habbit')
         nameInput.value='';
        const weeklyday = document.querySelector('.input-weekly-day');
        weeklyday.value='';
        const frequancyInput = document.querySelectorAll('.js-fr-input');
        frequancyInput.forEach((input)=>{
        input.checked= false; document.querySelector('.js-toggled-hide').classList.remove('its-toogled');
            
        });
        const customFreq = document.querySelectorAll('.js-input-custom');
        customFreq.forEach((custom)=>{
            custom.checked = false; toggledHide.classList.remove('its-open')
           
        });





    }
    
    if (event.target.closest('.cancel-btn')) {
        document.querySelector('.habit-input').style.display = 'none';
    }
});

setInterval(()=>{
    const now = new Date();
    if(now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0){
        resetCompletedDate();}
},60000);


function resetCompletedDate(){
    habits.forEach((habit)=>{
        habit.completed = false; })
        saveToStorage();
        displayHabit();
}

function streakUpdate(habit){
const today = new Date().toLocaleString('en-Us',{weekday: 'long'});

if(habit.frequancy === 'Everyday'&& !habit.completed && habit.lastCompletedDate !== today){
    habit.completed = true; habit.lastCompletedDate = today; habit.streak++;
} 
if(habit.frequancy === 'Weekly' && !habit.completed && habit.lastCompletedDate !== today ){
    habit.completed = true; habit.lastCompletedDate = today; habit.weeklyProgress++
    if (today === 'Sunday' && habit.weeklyProgress>=habit.weeklyTarget){habit.streak++}
}

if((habit.frequancy === 'Custom' && Array.isArray(habit.customFrequancy)) &&  !habit.completed && habit.lastCompletedDate !== today){
    if(habit.customFrequancy.includes(today)){habit.completed = true; habit.streak++; habit.lastCompletedDate = today}
}
saveToStorage();
displayHabit();

}



    function displayDashboard(){
    const pushElm = document.querySelector('.sub-container');
    pushElm.innerHTML= '';
    habits.forEach((habit)=>{
        let habitID = habit.id;
     const div2 = document.createElement('div');
     div2.classList.add('dash-elm');
     pushElm.appendChild(div2)
     div2.innerHTML=`
      
      <div class="habit-dashboard">
        <p class="title-1"> ${habit.name}</p>
        <p class="title-2">Streak: ${habit.streak} </p>
        <p class = "title-2"> Last Completed: ${habit.lastCompletedDate}</p>
      </div>
    <div class="canves-div" style="position: relative; height:30vh; width:60vw; height:150px; width: 150px;">  <canvas class="showing-graph js-graph-${habitID}"></canvas></div>
     `
   
     displayChart(habit,habitID);
    });
}


 function displayChart(habit,habitID){
    const completed = habit.streak;
    const Remaining = Math.max(30 - completed,0)
    if (window.expenseChartInstance) {
        window.expenseChartInstance.destroy();
    }
    const ctx = document.querySelector(`.js-graph-${habitID}`).getContext('2d');
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [completed, Remaining],
          backgroundColor: ['green', 'red'],
          
        }]
      },
      options: {
        reponsive: true,
        maintainAspectRation: false,
        aspectRatio: 1,
        cutout: '70%',
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed + '%';
                return label;
              }
            }
          }
        }
      }
    });
}

/*
function renderHabit(habit,habitId){
    const displayEveryday = document.querySelector('.js-display-fr-everyday');
    const displayWeekly = document.querySelector('.js-display-fr-weekly');
    const displayCustom = document.querySelector('.js-cus-frq');
     if(displayEveryday.checked && habit.frequancy === 'Everyday' || 
    displayWeekly.checked && habit.frequancy === 'Weekly' || 
    displayCustom.checked && habit.frequancy === 'Custom'){
   

}*/

function displayHabit(){
    const pushDiv = document.querySelector('.sec-wrapper');
    pushDiv.innerHTML= '';
    habits.forEach((habit)=>{
        const habitId = habit.id;
        const divElm = document.createElement('div');
        divElm.classList.add('habit-elm');
        pushDiv.appendChild(divElm)
        divElm.innerHTML = `
          <div class="habit-list">
          <p class="title-1"> ${habit.name}</p>
          <p class="title-2"> Frequancy: ${habit.frequancy}</p>
          <p class="title-2"> Custom Days: ${habit.customFrequancy}</p>
          <p class="title-2"> Weekly Target: ${habit.weeklyTarget} Days</p>
         <button class="habit-complete-btn new-complete-${habitId}">Complete</button>
        </div>
         <div class="btn-elm">
         <button class="edit-btn-elm new-edit-${habitId}"><img class="btn-img" src="assets/pencil.svg"></button>  
         <button class="edit-btn-elm new-delete-${habitId}"><img class="btn-img" src="assets/trash.svg"></button>  
         </div>`; 
document.querySelector(`.new-delete-${habitId}`).addEventListener('click',()=>{
 const habitCard =  document.querySelector(`.new-delete-${habitId}`).closest('.habit-elm');
habitCard.classList.add('its-done');
setTimeout(()=>{
    deleteHabit(habitId);
    saveToStorage();
    displayHabit();
    displayDashboard();
    },1000)
    

});
document.querySelector(`.new-edit-${habitId}`).addEventListener('click',()=>{
    editHabit(habitId);
    saveToStorage();
    displayHabit();
    displayDashboard();
   
});
document.querySelectorAll(`.new-complete-${habitId}`).forEach((combtn)=>{
combtn.addEventListener('click',()=>{

    streakUpdate(habit);
    saveToStorage();
    displayDashboard();
        });
    });
});

}



 function deleteHabit(habitId){
    habits = habits.filter((hbt)=>hbt.id !== habitId)
    }
    
function editHabit(habitId){
        const newHabit = prompt("Enter New Title")
        if(!newHabit) return;
        const edit = habits.find((bit)=>bit.id === habitId)
        edit.name = newHabit;
    }


 function addHabit(){
        const nameInput = document.querySelector('.input-habbit')
        const habitName = nameInput.value;
        const weeklyday = document.querySelector('.input-weekly-day');
        const weeklyInput = weeklyday.value;
        const frequancyInput = document.querySelectorAll('.js-fr-input');
        const customFreq = document.querySelectorAll('.js-input-custom');
    
        let frequancyPush= '';
        frequancyInput.forEach((input)=>{
            if(input.checked){frequancyPush=input.value; }
        });
    
        const customFrequancy = [];
        customFreq.forEach((custom)=>{
            
        if(custom.checked){customFrequancy.push(custom.value) }
            
        });
       
        if(habitName.trim()==="")  return;
        const newhabit = {
            id: Date.now(),
            name: habitName,
            streak: '0',
            completed: false,
            weeklyTarget: weeklyInput,
            weeklyProgress: '0',
            frequancy:frequancyPush,
            customFrequancy: customFrequancy,
            lastCompletedDate : '',
            
        }
       
        habits.push(newhabit);
        saveToStorage();
        displayHabit();
    
       
        }

    function saveToStorage(){
        localStorage.setItem('pain', JSON.stringify(habits));
    }



window.addEventListener('DOMContentLoaded',()=>{
    const save = localStorage.getItem('pain');
    habits = save?JSON.parse(save):[];
    displayHabit();
    displayDashboard();
 
});

}






   