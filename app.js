class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.previous = null;
  }
}
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(val) {
    const newNode = new Node(val);
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
      newNode.previous = null;
      newNode.next = this.tail;
    } else {
      this.tail.next = newNode;
      newNode.previous = this.tail;
      this.tail = newNode;
    }
    this.length += 1;
    return this;
  }
  pop() {
    let removedNode;
    if (this.length === 0) {
      return null;
    } else if (this.length === 1) {
      removedNode = this.head;
      this.head = null;
      this.tail = null;
    } else {
      removedNode = this.tail;
      removedNode.previous = null;
      this.tail = this.tail.previous;
      this.tail.next = null;
    }
    this.length -= 1;
    return removedNode;
  }
  shift() {
    let removedNode = this.head;
    if (this.length === 0) {
      return null;
    } else if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.previous = null;
    }
    this.length -= 1;
    removedNode.next = null;
    return removedNode;
  }
  unshift(val) {
    if (this.length === 0) {
      return this.push(val);
    }
    const newNode = new Node(val);
    this.head.previous = newNode;
    newNode.next = this.head;
    this.head = newNode;
    this.length += 1;
    return this;
  }
  get(ind) {
    let currentNode;
    let counter;
    if (ind < 0 || ind >= this.length) {
      return null;
    } else if (ind === 0) {
      return this.head;
    } else if (ind === this.length - 1) {
      return this.tail;
    } else if (ind <= Math.floor(this.length / 2)) {
      currentNode = this.head;
      counter = 0;
      while (counter < ind) {
        currentNode = currentNode.next;
        counter++;
      }
      return currentNode;
    } else if (ind >= Math.floor(this.length / 2)) {
      currentNode = this.tail;
      counter = this.length - 1;
      while (counter > ind) {
        currentNode = currentNode.previous;
        counter--;
      }
      return currentNode;
    }
  }
  set(ind, val) {
    if (ind < 0 || ind >= this.length) {
      return false;
    }
    let foundNode = this.get(ind);
    if (foundNode !== null) {
      foundNode.val = val;
      return true;
    }
    return falsex;
  }
  insert(ind, val) {
    if (ind < 0 || ind > this.length) {
      return null;
    } else if (ind === 0) {
      return this.unshift(val);
    } else if (ind === this.length) {
      return this.push(val);
    }
    let oldNode = this.get(ind);
    const newNode = new Node(val);
    oldNode.previous.next = newNode;
    newNode.previous = oldNode.previous;
    newNode.next = oldNode;
    oldNode.previous = newNode;
    this.length += 1;
    return this;
  }
  remove(ind) {
    if (ind < 0 || ind >= this.length) {
      return null;
    } else if (ind === 0) {
      return !!this.shift();
    } else if (ind === this.length - 1) {
      return !!this.pop();
    }
    const removedNode = this.get(ind);
    removedNode.previous.next = removedNode.next;
    removedNode.next.previous = removedNode.previous;
    this.length -= 1;

    return true;
  }
  print() {
    let counter = 0;
    let current = this.head;
    while (counter < this.length) {
      console.log(current);
      current = current.next;
      counter++;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("img");
  doodler.src = "Doodler.png";
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let platforms = new DoublyLinkedList();
  let score = 0;
  let platformCount = 5;
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let movePlatformsId;
  let isGameOver = false;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms.head.val.left;
    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("img");
      const visual = this.visual;
      visual.classList.add("platform");
      visual.src = "./Doodle_Jump/tile.png";
      visual.style.left = `${this.left}px`;
      visual.style.bottom = `${this.bottom}px`;
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  }
  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      let currentNode = platforms.head;
      for (let i = 0; i < platforms.length; i++) {
        if (currentNode.val.bottom < 10) {
          let removed = platforms.shift();
          removed.val.visual.classList.remove("platform");
          removed.val.visual.parentNode.removeChild(removed.val.visual);

          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
          currentNode = platforms.head;
        }
        let visual = currentNode.val.visual;
        currentNode.val.bottom -= 4;

        visual.style.bottom = `${currentNode.val.bottom}px`;

        currentNode = currentNode.next;
      }
    }
  }
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      } else if (doodlerBottomSpace > 515) {
        fall();
      }
    }, 20);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      let currentNode = platforms.head;
      for (let i = 0; i < platforms.length; i++) {
        if (
          doodlerBottomSpace >= currentNode.val.bottom &&
          doodlerBottomSpace <= currentNode.val.bottom + 15 &&
          doodlerLeftSpace + 60 >= currentNode.val.left &&
          doodlerLeftSpace <= currentNode.val.left + 85 &&
          !isJumping
        ) {
          console.log("landed");
          startPoint = doodlerBottomSpace;
          score += 5;
          jump();
        }
        currentNode = currentNode.next;
      }
    }, 20);
  }
  function gameOver() {
    console.log("game is over");
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(movePlatformsId);
    platforms = new DoublyLinkedList();
  }

  function control(e) {
    console.log(e.key);
    if (e.key === "ArrowLeft") {
      //move left
      moveLeft();
    } else if (e.key === "ArrowRight") {
      //move right
      moveRight();
    } else if (e.key === "ArrowUp") {
      //move straight
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    doodler.src = "./Doodle_Jump/doodle-left.png";
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else {
        moveRight();
      }
    }, 20);
  }
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    doodler.src = "./Doodle_Jump/doodle-right.png";
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else {
        moveLeft();
      }
    }, 20);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function init() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      movePlatformsId = setInterval(movePlatforms, 30);
      jump();
      document.addEventListener("keyup", control);
    }
  }
  init();
  //attatch to button
  const startBtn = document.getElementById("start");

  startBtn.addEventListener("click", () => {
    window.location.reload();
  });
});
