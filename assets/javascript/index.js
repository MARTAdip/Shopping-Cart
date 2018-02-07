class shoppingCart {
    constructor () {
      this.db = JSON.parse( localStorage.getItem('cart') ) || [];
      this.db.total = this.db.total || 0;
      this.db.shipping = this.db.shipping || 0;
      this.db.time = this.db.time || 0;
      this.db.discount = this.db.discount || 0;
      this.elements = {
        list: document.getElementById('products'),
        result: document.querySelectorAll('.cartresult'),
        reset: document.getElementById('reset'),
        cart: document.getElementById('cart'),
        totaltarget: document.querySelectorAll('.total-target'),
        total_template: document.getElementById('total-template'),
        template: document.getElementById('template')
      }
      this.init()
    }
    init(){
          //here you take your cart item template and clone this piece of html to a virtual copy

      var card = this.elements.template
      for (var i in database ) {
        var element = card.cloneNode(true);
        // here we have clone our template lets remove the id first and rmove display none class
        element.removeAttribute("id");
        element.classList.remove("d-none")
  // fill the element with the image from the database and add the name of the product to the title
        element.querySelector('.card-img-top').src = database[i].image
        element.querySelector('.card-title').prepend(i)
        //element.querySelector('.card-text').innerHTML = `${ database[i].content } `

        var price = document.createElement('span');
        price.innerHTML = ` ${database[i].price}€`;
        element.querySelector('.card-body').appendChild(price);
        
        if (database[i].discount){
            price.style.textDecoration='line-through';
            price.classList.add('text-danger');
            // discount
            var discount = document.createElement('span');
            discount.innerHTML = `${ database[i].discount }%`
            element.querySelector('.card-body').appendChild(discount);
        } 


        
        var footer = document.createElement('small');   // create a small element to display text -smaller- on the element
        footer.classList.add('text-muted');   // bootstrap class
        footer.innerHTML = `shipping: ${database[i].shipping}&euro; <br> delivery: ${database[i].delivery} days`;
        


        element.querySelector('.card-footer').appendChild(footer);  // lets put in the footer the shipping costs and delivery time
  
        var button = element.querySelector('.btn-primary'); // now we take the  button and fill it with all our data to use this for the remove action
        button.dataset.name = i
        button.dataset.shipping = database[i].shipping;
        button.dataset.delivery = database[i].delivery;
        button.dataset.price = database[i].price;
        button.dataset.discount = database[i].discount;
        this.elements.list.appendChild(element);
  
        // Fade-in effect
      // this removes the faded class with a timeout from all divs - wooosh!

        var divs = document.querySelectorAll('#products > div');
        var time = 0;
        for (let div of divs) {
          setTimeout(function(){
            div.classList.remove('faded');
          }, time);
          time+=100
        }
      }

      // these are the event listeners for dynamically created elements. Eg: A element is not present and will be generated and rendered with js, its hart to define the event listeners on document load. They will not hook up, so we listen to the document
      document.addEventListener('click', (e)=>{
        if(e.target && e.target.classList.contains( 'btn-danger' )){//do something}
          let itemKey = this.findItemKey(e.target.dataset.name)
          this.updateCart(e.target.dataset.name, true)
        } else if (e.target && e.target.classList.contains( 'cart-button' )){
          this.updateCart(e.target.dataset.name)
          this.render()
        }
      })
  
      this.render()
      this.resetEventListener()
    }
    resetEventListener() {
      this.elements.reset.addEventListener('click', (e)=>{
        this.db.items = []
        this.db.total = 0
        this.db.shipping = 0
        this.db.delivery = 0
        this.db.discount = 0
        localStorage.setItem("cart", JSON.stringify( {shipping: 0, total: 0, items: [], delivery: 0, discount: 0 } ))
        this.render()
      })
    }
    findItemKey(itemName){
      for (let i = 0; i < this.db.items.length; i++){
        if (this.db.items[i].name == itemName){
          return i
        }
      }
    }
    updateCart(item, remove = false){
      let itemKey = this.findItemKey(item)
      if(remove){
        //this.db.total -= Number( this.db.items[itemKey].price )
        if(this.db.items[itemKey].count > 1){
          this.db.items[itemKey].count--
        }else{
          this.db.items.splice(itemKey, 1)
        }
      } else {
        //this.db.total += Number( event.target.dataset.price )
        if(itemKey !== undefined){
          this.db.items[itemKey].count++
        } else {
          this.db.items.push({shipping: event.target.dataset.shipping, name: event.target.dataset.name, price: event.target.dataset.price, delivery: event.target.dataset.delivery, discount: event.target.dataset.discount, count: 1})
        }
      }
      if(this.db.items.length > 0) {
        this.db.total = this.db.items.map((i) => {
          return i.price * i.count
        }).reduce((e, i) => Number(e) + Number(i))
  
        this.db.shipping = this.db.items.map((i) => {
          return i.shipping
        })
        this.db.shipping = Math.max(...this.db.shipping)

       
        
      
        var productsArray = document.querySelectorAll('#products .card-footer button');
       //console.log(productsArray[3].getAttribute('data-discount')) 
       
      /*  productsArray.forEach(function(product){
         if( product.hasAttribute('data-discount'))  */
          
         
   
        this.db.delivery = this.db.items.map((i) => {
          return i.delivery
        })
        this.db.delivery = Math.max(...this.db.delivery)
      } else {
        this.db.shipping = 0;
        this.db.total = 0;
        this.db.delivery = 0;
      }
  
      localStorage.setItem("cart", JSON.stringify( {shipping: this.db.shipping, total: this.db.total, items: this.db.items, delivery: this.db.delivery, discount: this.db.discount } ))
      this.render()
    }
    render(){
      this.db.items = this.db.items || []        // the function checks if items are in the cart and hides the cart if it is empty
      if( this.db.items.length > 0 ){
        this.elements.cart.classList.remove('faded')
        for (let i = 0; i < this.elements.totaltarget.length; i++){
          this.elements.totaltarget[i].classList.remove('faded')
        }
      } else {
        this.elements.cart.classList.add('faded')
        for (let i = 0; i < this.elements.totaltarget.length; i++){
          this.elements.totaltarget[i].classList.add('faded')
        }
      }
      var cart = document.createElement('div')
      this.db.items.forEach( item => {
         


        var element = document.createElement('li');
        element.classList += 'list-group-item d-flex justify-content-between align-items-center ';
        element.innerHTML = `<span class="badge badge-info badge-pill mr-2">${item.count} </span>  ${ item.name } - ${item.price}€ - ${item.discount}% <span class="ml-auto mr-3 font-weight-bold">${( item.price * item.count ).toFixed(2)}&euro; </span>`;
        var button = document.createElement('button');
        button.classList.add('btn', 'btn-sm', 'btn-danger');
        button.dataset.name = item.name
        button.innerHTML = "<i class='fa fa-close pointer-events-none'></i>";
        element.appendChild(button);
        cart.appendChild(element);
        
        
      })

      //TODO we want to show the list of totals several times on the page
    //we loop over the target elements, take each time a new template, fill it with data and display it on the page
      var ttemplate = this.elements.total_template
      for (let i = 0; i < this.elements.totaltarget.length; i++){
        ttemplate = ttemplate.cloneNode(true);
        ttemplate.removeAttribute("id");
        ttemplate.classList.remove("d-none")
        ttemplate.querySelector(".total").innerHTML = this.db.total ? this.db.total.toFixed(2) : 0
        ttemplate.querySelector(".delivery").innerHTML = this.db.delivery ? this.db.delivery.toFixed(0) : 0
        ttemplate.querySelector(".shipping").innerHTML = this.db.shipping ? this.db.shipping.toFixed(0) : 0
        ttemplate.querySelector(".totalplusship").innerHTML = (this.db.total + this.db.shipping).toFixed(2)
       // ttemplate.querySelector(".discount").innerHTML = ((this.db.price * this.db.discount)/100 ).toFixed(0)
        if (this.db.total){
          var tTotal = this.db.total.toFixed(2)
        } else {
          var tTotal = 0;
        }

        this.elements.totaltarget[i].innerHTML = ttemplate.innerHTML
      }
      for (let i = 0; i < this.elements.result.length; i++){
        this.elements.result[i].innerHTML = cart.innerHTML
      }
    }
  }

  var instaceOfCart = new shoppingCart();

   

