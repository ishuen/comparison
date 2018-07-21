function sortCardsBy(option) {
  var list, i, b, shouldSwitch;
  list = document.getElementById('sourcePanel')
  block = document.getElementById('sort')
  buttons = block.getElementsByTagName('button')
  // console.log(buttons)
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
        // console.log(i, '***', b[2 * i].getElementsByTagName('h3')[0].innerHTML.toLowerCase())
        let former = b[2 * i].getElementsByTagName('h3')[0].innerHTML.toLowerCase()
        let later = b[2 * (i + 1)].getElementsByTagName('h3')[0].innerHTML.toLowerCase()
        if (former > later) {
        // if next item is alphabetically
        // lower than current item, mark as a switch
        // and break the loop:
          shouldSwitch = true
          break
        }
        for (let j = 1; j < buttons.length; j++) {
          buttons[j].style.backgroundColor = 'white'
          buttons[j].style.color = 'black'
        }
        buttons[0].style.backgroundColor = 'black'
        buttons[0].style.color = 'white'
      } else if (option === 'taste') {
        let former = parseInt(b[2 * i].getElementsByTagName('td')[0].innerHTML)
        let later = parseInt(b[2 * (i + 1)].getElementsByTagName('td')[0].innerHTML)
        if (former > later) {
          shouldSwitch = true
          break
        }
        for (let j = 0; j < buttons.length; j++) {
          if (j === 1) {
            buttons[j].style.backgroundColor = 'black'
            buttons[j].style.color = 'white'
          } else {
            buttons[j].style.backgroundColor = 'white'
            buttons[j].style.color = 'black'
          }
        }
      } else if (option === 'health') {
        let former = parseInt(b[2 * i].getElementsByTagName('td')[1].innerHTML)
        let later = parseInt(b[2 * (i + 1)].getElementsByTagName('td')[1].innerHTML)
        if (former > later) {
          shouldSwitch = true
          break
        }
        let last = buttons.length - 1
        for (let j = last; j >= 0; j--) {
          buttons[j].style.backgroundColor = 'white'
          buttons[j].style.color = 'black'
        }
        buttons[last].style.backgroundColor = 'black'
        buttons[last].style.color = 'white'

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

function init() {
  document.getElementById('reset').disabled = true;
 // Move the paragraph from #myDiv1 to #myDiv2
  $('#sourcePanel').append( $('#destinationPanel>div') );
}

function discardItem() {
  let remainingCards = document.getElementsByClassName('card')
  let toDiscard = document.getElementsByClassName('card ui-selected')
  console.log(remainingCards.length, toDiscard.length)
  if (remainingCards.length - toDiscard.length < 5) {
    alert('Cannot discard card(s) anymore.')
    return false
  }
  if (toDiscard.length == 0) {
    // ask user to select item first
    alert('Please select card(s) from the card display area and press this button again.')
  } else {
    // delete card
    $(toDiscard).remove()
  }
}