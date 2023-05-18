
window.onload = () => {
  var chairs = document.querySelectorAll('[id^="chair"]');
  console.log(chairs)


  let middlePositions = [];
  for (const i of chairs) {
    middlePositions.push(getMiddlePos(i));
  }
console.log(middlePositions)
}

function getMiddlePos(htmlElem) {
  let chairrect = htmlElem.getBoundingClientRect();
  return { id: htmlElem.id, x: chairrect.x + (chairrect.width / 2), y: chairrect.y + (chairrect.height / 2) }
}