interface allTask {
  text: string;
  check: boolean;
}

let allTasks: allTask[] = [];

let count: number = 1; //for identical collapse id
const topLi: HTMLElement = document.getElementById('topLi') as HTMLFormElement;
const mainForm: HTMLElement = document.getElementById(
  'addingForm'
) as HTMLFormElement;
const mainInput: HTMLInputElement = mainForm.children[0] as HTMLInputElement;
const mainList: HTMLElement = document.getElementById(
  'mainList'
) as HTMLFormElement;
const delAll: HTMLElement = document.getElementById(
  'delAll'
) as HTMLFormElement;

eventListeners();
loadLocalStorage();

// all Listeners
function eventListeners(): void {
  //submit event
  mainForm.addEventListener('submit', addNewItem);
  //task stufs
  mainList.addEventListener('click', taskStufs);
  //delete all tasks
  delAll.addEventListener('click', deleteAll);
}

//to creat new task
function createNewTask(text: string, check: boolean): void {
  //to clone upper visible li in html page
  const newLi: HTMLElement = topLi.cloneNode(true) as HTMLElement;

  const newLiChildren = newLi.children[1] as HTMLElement;
  const newLiPreChildren = newLi.children[0] as HTMLElement;
  //making visible the new li
  newLi.classList.remove('displayNone');
  newLiChildren.classList.remove('lineThrought');
  newLiPreChildren.classList.remove('tick');

  //removing id
  newLi.setAttribute('id', '');

  newLiChildren.innerText = text;
  if (check === true) {
    newLiPreChildren.classList.add('tick');
    newLiChildren.classList.add('lineThrought');
  } else {
    newLiPreChildren.classList.remove('tick');
    newLiChildren.classList.remove('lineThrought');
  }
  mainList.appendChild(newLi);
  mainInput.value = '';
}

//add New Task
function addNewItem(e: Event): void {
  e.preventDefault();
  //entered text
  const taskText: string = mainInput.value;

  if (taskText !== '') {
    allTasks = JSON.parse(localStorage.getItem('allTasks') as string);
    let c: boolean = false;
    allTasks.forEach(function (item) {
      if (item.text === taskText) {
        c = true;
        alert('Task Already Added');
      }
    });
    if (c === false) {
      createNewTask(taskText, false);
      saveLocalStorage(taskText, 1);
    }
  } else {
    alert('Please type something');
  }
}

//delete and check a task
function taskStufs(e: Event): void {
  e.preventDefault();
  const target = e.target as HTMLElement;
  const targetParentELement = target.parentElement as HTMLElement;
  const targetFirstChildren = targetParentELement.children[1] as HTMLElement;
  const targetZeroChildren = targetParentELement.children[0] as HTMLElement;
  //delete item
  if (target.classList.contains('deleteItem')) {
    //remove LS
    const text: string = targetFirstChildren.innerText;
    saveLocalStorage(text, 0);

    //remove from page
    targetParentELement.remove();
  } else if (target.classList.contains('check')) {
    let tmpList: allTask[] = JSON.parse(
      localStorage.getItem('allTasks') as string
    );

    if (targetFirstChildren.classList.contains('lineThrought')) {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text === targetFirstChildren.innerText) {
          tmpList[i].check = false;
          localStorage.setItem('allTasks', JSON.stringify(tmpList));
          break;
        }
      }

      targetFirstChildren.classList.remove('lineThrought');
      targetZeroChildren.classList.remove('tick');
    } else {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text === targetFirstChildren.innerText) {
          tmpList[i].check = true;
          localStorage.setItem('allTasks', JSON.stringify(tmpList));
          break;
        }
      }

      targetFirstChildren.classList.add('lineThrought');
      targetZeroChildren.classList.add('tick');
    }
  }
}
//delete all
function deleteAll(e: Event): void {
  e.preventDefault();
  mainList.replaceChildren();
  saveLocalStorage('', -1);
}

//loading Main Tasks
function loadLocalStorage(): void {
  if (localStorage.getItem('allTasks') === null) {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  } else {
    allTasks = JSON.parse(localStorage.getItem('allTasks') as string);

    allTasks.forEach(function (item) {
      createNewTask(item.text, item.check);
    });
  }
}
//saving Main Tasks
function saveLocalStorage(text: string, index: number): void {
  if (index === -1) {
    localStorage.removeItem('allTasks');
    allTasks.length = 0;
    loadLocalStorage();
  } else if (index === 0) {
    const tmp: allTask[] = JSON.parse(
      localStorage.getItem('allTasks') as string
    );
    let c: number;
    tmp.forEach(function (item, ind) {
      if (item.text === text) c = ind;
    });
    tmp.splice(c!, 1);
    localStorage.setItem('allTasks', JSON.stringify(tmp));
  } else if (index === 1) {
    const tmp: allTask[] = JSON.parse(
      localStorage.getItem('allTasks') as string
    );
    tmp.push({ text: text, check: false });
    localStorage.setItem('allTasks', JSON.stringify(tmp));
  }
}

// drag and drop trying
