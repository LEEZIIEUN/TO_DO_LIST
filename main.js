// 유저 값 입력
// + 버튼 클릭하면 할일 추가
// delete 버튼  누르면 할일 삭제
// check 버튼 누르면 할일이 끝나면서 밑줄이 간다
// 진행중 끝남 탭을 누르면, 언더바 이동
// 끝남 탭은 끝난 아이템만, 진행중은 진행중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let chartButton = document.getElementById("chart-button");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine =document.querySelector("#under-line");
let taskList = new Set;
let filterList = new Set();
let doneList = new Set();
let mode = 'all';
let showingChart = false;
let list = {};

for(let i = 1; i<tabs.length; i++){
  tabs[i].addEventListener("click",function(event){
    filter(event)});
}

let underLineIndicator = (e) => {
  underLine.style.left = e.currentTarget.offsetLeft - 15 +'px';
  underLine.style.width = e.currentTarget.offsetWidth + 'px';
  underLine.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight -19+ 'px';
};

tabs.forEach((menu) =>
  menu.addEventListener('click', (e) => underLineIndicator(e))
);

addButton.addEventListener("click", addTask);
chartButton.addEventListener("click", function(event){
  filter(event)});
chartButton.addEventListener("click", showChart);

function addTask(){
  if (taskInput.value.trim() == ''){
    alert("내용을 입력해주세요!");
    taskInput.value = '';
    return;
  }
  let task = {
    id : Date.now(),
    taskContent : taskInput.value,
    isComplete : false
  }
  taskList.add(task)
  taskInput.value = '';
  mode = 'all';
  render();
}

function render(){
  console.log(taskList)
  list = {};
  if (mode == "all"){
    list = taskList;
  } else if (mode == "ongoing"){
    list = filterList;
  } else if (mode == "done"){
    list = doneList;
  }
  console.log("랜더부분-----"+list.size)
  let resultHTML = '';
  for (let i of list){
    if(i.isComplete == true){
      resultHTML += `<div class="task-done">
      <div>${i.taskContent}</div>
      <div>
        <button onclick="toggleComplete('${i.id}')">🔄</button>
        <button onclick="toggleDelete('${i.id}')">🗑</button>
      </div>
    </div>`
    } else {
    resultHTML += `<div class="task">
    <div>${i.taskContent}</div>
    <div>
      <button onclick="toggleComplete('${i.id}')">✅</button>
      <button onclick="toggleDelete('${i.id}')">🗑</button>
    </div>
  </div>`
    }
  
  }
  document.getElementById("task-board").innerHTML = resultHTML
}

function toggleComplete(id){
  for(let i of taskList){
    if(id == i.id){
      i.isComplete = !i.isComplete;
      render();
      break;
    }
  }
}

function toggleDelete(id) {

  for(let i of taskList){
    if(id == i.id){
      taskList.delete(i)
      mode = 'all';
      render();
      break;
    }
  }
}

function filter(event){
  mode = event.target.id;
  if (mode == "all"){
  } else if (mode == "ongoing"){
    for (let i of taskList){
      if (i.isComplete == false){
        filterList.add(i);
        doneList.delete(i);
      }
    }
  } else if (mode == "done"){
    for (let i of taskList){
      if (i.isComplete == false){
        doneList.add(i);
        filterList.delete(i);
      }
    }
  }
  render();
}

function showChart(){
  showingChart = !showingChart;
  if (showingChart == true){
    if (filterList.size == 0 && filterList.size == 0){
      document.getElementById("piechart").innerHTML = "오늘 작성된 일정이 없습니다.";
    } else {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    }
  } else if (showingChart == false) {
    document.getElementById("piechart").innerHTML = "";
  }
}

function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Count'],
    ['Not Done', filterList.size],
    ['Done', doneList.size]
  ]);

  var options = {
    title: 'Achievement',
    colors: ['#CE80BC', '#5181C4']
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

