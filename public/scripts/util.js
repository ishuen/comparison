function sortCardsBy(option) {
  var list, i, b, shouldSwitch;
  list = document.getElementById('sourcePanel')
  let switching = true
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false
    b = list.getElementsByTagName('div')
    //Loop through all list-items:
    for (i = 0; i < (b.length - 1)/2 - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false
      /*check if the next item should
      switch place with the current item:*/
      if (option === 'alphabet') {
        console.log(i, '***', b[2 * i].getElementsByTagName('h3')[0].innerHTML.toLowerCase())
        let former = b[2 * i].getElementsByTagName('h3')[0].innerHTML.toLowerCase()
        let later = b[2 * (i + 1)].getElementsByTagName('h3')[0].innerHTML.toLowerCase()
        if (former > later) {
        // if next item is alphabetically
        // lower than current item, mark as a switch
        // and break the loop:
          shouldSwitch = true
          break
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark the switch as done:*/
      b[2 * i].parentNode.insertBefore(b[2 * (i + 1)], b[2 * i])
      switching = true
    }
  }
}