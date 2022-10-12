const overlay = $('#overlay');
var items = localStorage.getItem('items') || [];

function current_cart(items){
  $.ajax({
    url:"/shopping_cart",
    type: "POST",
    data: {items:items},

    success: function(data){
        $('.cart_list').html(data);
        $('.cart_list').append(data.item_response);
    //         place code for cart successful submit, such as a
    //         flash code or indicator on cart button
    //    let price = parseFloat($('.cart_list .price').text()).toFixed(2);
    //    let quantity = parseFloat($('.cart_list .quantity').text()).toFixed(2);
    //    let total_price = price * quantity;
    //    $('.total_price').text(total_price);
        cart_total(items)
    }
});
}

current_cart(items)

function edit(item_position) {
//    console.log(id)
    var items_json = JSON.parse(localStorage.getItem('items'))
    for(order of items_json){
        if(item_position == order.position){
            var local_item = items_json[order['position']]
        }
    }

    $.ajax({
        url:"/edit",
        type: "POST",
        data: {edit_item: JSON.stringify(local_item)},
    //    on success of getting the post request through do said function with
    //    json data
        success: function(data){
//        alert(data)
//        at the modal div replace the div with class modal with the data
            $('.modal').html(data);
            $('.modal').replaceWith(data);
            const modal = $('.modal');
            openModal(modal);

            var price1 = parseFloat($('.modal-body .price').text().replace('$','')).toFixed(2);
            var price2 = parseFloat($('.modal-body .price2').text().replace('$','')).toFixed(2);

//          Call function to see if second option needs to be active
            option_on(item_position, items_json)

            $('.close-button').on('click', function() {
                const modal = $('.modal')
                closeModal(modal)
                });

            $('.minus').on('click', function() {
                var num = parseInt($('.item-count .quantity').text());
                newNum = num -= 1
                if (newNum <= 0){
                    newNum = 1
                    $('.item-count .quantity').text(newNum);
                } else {
                    $('.item-count .quantity').text(newNum);
                    total_price(num);
                }
            });

            $('.plus').on('click', function() {
                var num = parseInt($('.item-count .quantity').text());
                newNum = num += 1;
                $('.item-count .quantity').text(newNum);
                total_price(num);
            });

            $('.modal-body .option2').on('click', function() {
                var num = parseInt($('.item-count .quantity').text());
    //         var price2 = parseFloat($('.price2').text()).toFixed(2);
                $('.modal-body .option2').toggleClass('active')
                total_price(num);
            });

            function total_price(num) {
                  if ($('.modal-body .option2').hasClass('active')){
                      var total = price2 * num;
                      $('.added-price span').text(`$${total.toFixed(2)}`);
                  } else {
                      var total = price1 * num;
                      $('.added-price span').text(`$${total.toFixed(2)}`);
                  }
                }

            }
        });
}

function delete_item(pos) {
//    let pos = parseInt($(this).data('position'));
    new_list = []
    let items = JSON.parse(localStorage.getItem('items')) || [];
//    console.log(pos)
    delete items[pos]
    for(let i=0; i<items.length; i++){
        if(items[i]){
            new_list.push(items[i])
        }
    }
    for (let i=0; i<new_list.length; i++){
//        console.log(new_list[i].position)
        new_list[i]['position'] = i
//        console.log(new_list[i].position)
//        console.log("")
    }

    list = JSON.stringify(new_list)

    $.ajax({
        url:"/delete",
        type: "POST",
        data: {items:list},

        success: function(data){
//                    let items = []
//                    for (i=0; i < items.length; i++) {
//                        if (items[i] !== undefined) {
//                            items.push(items[i])
//                        }
//                    }
//                    localStorage.setItem("items", JSON.stringify(items))
            $('.cart_list').html(data)
            $('.cart_list').append(data.item_response);
            localStorage.setItem("items", JSON.stringify(new_list));
//            var items = localStorage.getItem('items') || [];
            cart_total(list)
        }
    });

}

function cart_total(items_list){
//    get all total in each item than add each to output sum into a
//    different div, also add 2 dollar fee for stripe for now
    let total_list = []
    let items_json = JSON.parse(items_list)
    for(let i=0; i<items_json.length; i++){
        total_list.push(parseFloat(items_json[i].item_total.replace('$','')))
    }
    let sub_total = total_list.reduce((a, b) => a + b, 0)
    $('.total span').text(sub_total.toFixed(2))
}

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

function option_on(item_position, items) {
    for(order of items){
        if(item_position == order.position){
            if(order.option){
                $('.modal-body .option2').toggleClass('active')
            }

        }
    }
}

function updateItem(edit_item_pos){
    var current_item_list = JSON.parse(localStorage.getItem('items') || []);
    var old_item = current_item_list[edit_item_pos]
    var flag = false;
    var radio_sos = old_item['sos'];
    var maki_rolls = [];

    if ($('.modal-body .option2').hasClass('active')){
//        console.log('active')
      var option = $('.modal-body .option2').text();
      var price = $('.modal-body .price2').text().trim()
    } else {
//        console.log('deactivated')
      var option = null
      var price = $('.modal-body .price span').text()
    }
    if($('.sos').length){
        var radio_sos = $("input[name='soup_salad']:checked").val();
    }

    if($('.modal-title').text().toLowerCase().trim() == "maki combo pick 2 rolls:"){
        $('.checkbox_roll:checked').each(function(i){
            maki_rolls[i] = $(this).val();
//            console.log(val[i])
        });
        if(maki_rolls.length == 0){
            $('.success_flash').text("Must select a roll.");
            $('.success_flash').css('color', 'red');
            flag = true;
        }

    }
    if(flag){
        return false;
    }

    updated_item = {
        "position": edit_item_pos,
        "id": old_item['id'],
        "item_name": old_item['item_name'],
        "quantity": parseInt($('.modal-body .quantity').text()),
        "option": option,
        "price": price,
        "item_total": $('.added-price span').text(),
        "sos": radio_sos,
        "maki_rolls": maki_rolls,
    }
    current_item_list[edit_item_pos] = updated_item
    localStorage.setItem("items", JSON.stringify(current_item_list));
    current_cart(JSON.stringify(current_item_list))

    const modal = $('.modal')
    closeModal(modal)
}

function checkout(){
    var items_json = JSON.parse(localStorage.getItem('items'))
    $.ajax({
        url:"/create-checkout-session",
        type: "POST",
        data: {items:JSON.stringify(items_json)},
        success: function(data){
            window.location = data.url
        }
    })
}