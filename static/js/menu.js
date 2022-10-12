const overlay = $('#overlay');
var items = JSON.parse(localStorage.getItem('items')) || [];  // getting local storage items than turning it into a json
if(items.length != 0) {  // if items in local storage is not 0 display it on html by text
    $('.item_num').text(items.length)
}

$("#empty_ls").on('click',()=>{  // created button for clearing localstorage for testing
    var items = localStorage.clear()
})

$('.grid .item').on('click', function() {  // do something when clicking on itemized div in grid
// get data value from the div in a variable
    var itemId = $(this).data('id');

// using ajax for modal
  $.ajax({
    url:"/modal",  // the python url route to go to
    type: "POST",  // is this a post or get
    data: {itemId: itemId},  // what to send to python file once activated by map/dictionary system
//    on success of getting the post request through do said function with
//    json data
    success: function(data){
//      alert(data)
//    at the modal div replace the div with class modal with the data
//      $('.modal').html(data);
        $('.modal').replaceWith(data);
        const modal = $('.modal');
        openModal(modal);

        var price1 = parseFloat($('.modal-body span').text()).toFixed(2);
        var price2 = parseFloat($('.modal-body .price2').text()).toFixed(2);

// add js commands for things in the modal.html since it won't technically
// exist in the menu html pages
        $('.close-button').on('click', function() {
        const modal = $('.modal')
        closeModal(modal)
        });

        $('.minus').on('click', function() {
            var num = parseInt($('.quantity').text());
            newNum = num -= 1
            if (newNum <= 0){
                newNum = 1
                $('.quantity').text(newNum);
            } else {
                $('.quantity').text(newNum);
                total_price(num);
            }
        });

        $('.plus').on('click', function() {
            var num = parseInt($('.quantity').text());
            newNum = num += 1;
            $('.quantity').text(newNum);
            total_price(num);
        });

        $('.modal-body .option2').on('click', function() {  // this is for second option of item
            var num = parseInt($('.quantity').text());  // getting quantity of items currently
//            var price2 = parseFloat($('.price2').text()).toFixed(2);
            $('.modal-body .option2').toggleClass('active')
            total_price(num);
        });

        function total_price(num) {
    //    var item_price = 6.00;
          if ($('.modal-body .option2').hasClass('active')){
              if (isNaN(price2)){
                  $(".added-price span").text(`$${num}xMP`)
              } else {
                  var total = price2 * num;
                  $('.added-price span').text(`$${total.toFixed(2)}`);
              }

          } else{
              if (isNaN(price1)) {
                  $(".added-price span").text(`$MPx${num}`)
              } else {
                  var total = price1 * num;
                  $('.added-price span').text(`$${total.toFixed(2)}`);
              }

          }
        }

// make info of item at current state go to shopping cart db when clicking
// add to cart, use ajax by making variables for each piece of info to send
// in js/jquery than pass those in the data key of ajax as key:value; go
// back up to the previous ajax use for help, see how I get the data-id
// first by setting it in a var in js first, thus do the same for each
// info needed for shopping cart id and stripe data that is needed
        $('.add-cart button').on('click', function() {
            var flag = false;
            var maki_rolls = [];
            var limit = 2;
//            var radio_sos = ''

            $('input.checkbox_roll').on('change', function(evt) {  // making sure only 2 checked boxes are the limit
                if($(this).siblings(':checked').length >= limit) {
                   this.checked = false;
                }
            });
            // getting each checked box using ":checked" and adding it to the array/list maki_rolls
            if($('.modal-title').text().toLowerCase().trim() == "maki combo pick 2 rolls:"){
                $('.checkbox_roll:checked').each(function(i){
                maki_rolls[i] = $(this).val();
//                console.log(val[i])
                });
                //  covering for if no rolls are selected to send error
                if(maki_rolls.length == 0){
                    $('.success_flash').text("Must select a roll.");
                    $('.success_flash').css('color', 'red');
                    flag = true;
                }

            }
            if(flag){
                return false;
            }

//            console.log(maki_rolls)
            // checking for radio buttons and if there is a choice for one
            var radio_sos = null;
            // soup or salad = sos, in an if statement 0 returns false else true
            if($('.sos').length){
                var radio_sos = $("input[name='soup_salad']:checked").val();
            }
            // getting various data from modal after clicking the cart button
            var item_total = $('.added-price span').text();
            var quantity = parseInt($('.quantity').text());
            var item_name = $('.modal-title').text().trim();
     //       console.log(itemId)
            if ($('.modal-body .option2').hasClass('active')){
                var price = price2;
                var option2 = $('.modal-body .option2').text().trim();
            } else {
                var price = price1;
                var option2 = null;
            }
//            Using 'typeof(Storage)' to say if localStorage is not null than
//            use it, thus adding items to localStorage
            if(typeof(Storage) !== 'undefined'){
                let item = {
                    position: items.length,
                    id: itemId,
                    item_name: item_name,
                    option: option2,
                    quantity: quantity,
                    price: price,
                    item_total: item_total,
                    sos: radio_sos,
                    maki_rolls: maki_rolls,

                };

                items.push(item);
                // adding item to local storage but converting it to json string first
                localStorage.setItem("items", JSON.stringify(items));
            }
//            making notification circle on cart button
            $('.item_num').text(items.length);
            // making success message in modal once it has been added to local storage
            $('.success_flash').css("color","green");
            $('.success_flash').text("Successfully added item to cart");

        });
    }

   });

});

overlay.on('click', function() {
  const modals = $('.modal.active')
  closeModal(modals)
})

function openModal(modal) {
  if (modal == null) {
    return
  }
    modal.addClass('active');
    overlay.addClass('active');
}

function closeModal(modal) {
  if (modal == null) {
    return
  }
  modal.removeClass('active');
  overlay.removeClass('active');
}

