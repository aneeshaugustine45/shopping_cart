//const { resource, response } = require("../../app");

function addToCart(proId) {
  $.ajax({
    url: "/add-to-cart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cart-count").html();
        count = parseInt(count) + 1;
        $("#cart-count").html(count);
      }
      //alert(response)
    },
  });
}

function changeQuntity(cartId,proId,userid,count) {
  let quantity = parseInt(document.getElementById(proId).innerHTML);
  count = parseInt(count);
  $.ajax({
    url: "/change-product-quantity",
    data: {
      cart: cartId,
      product: proId,
      count: count,
      quantity: quantity,
      user: userid,

    },
    method: "post",
    success: (response) => {
      
      if (response.removeProduct) {
        alert("product removed from cart");
        location.reload();
      } else {
        document.getElementById(proId).innerHTML = quantity + count;
        document.getElementById('total').innerHTML = response.total;
      }
      //alert(Response)
    },
  });
}

function removeCart(cartId,proId) {
  $.ajax({
    url: "/cart-remove",
    data: {
      cart: cartId,
      product: proId,
    },
    method: "post",
    success: (response) => {
      if (response.removeCartProduct) {
        alert("product removed from cart");
        location.reload();
      } else {
        document.getElementById(proId).innerHTML = quantity + count;
      }
    },
  });
}
