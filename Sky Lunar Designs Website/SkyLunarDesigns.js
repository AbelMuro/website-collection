$(document).ready(function() {
    let all_DIVS = "#DIV_array div";
    Paginate($('#DIV_array div').clone(), $('section.list_container'), 1);
    CreatePages($("#DIV_array div"), all_DIVS);

    $("div img.first_image").on({                                                           
        mouseenter: function(){ 
            $("div div.grey_box_one").css("transform" ,"rotate(-20deg)");
        },
        mouseleave: function(){
            $("div div.grey_box_one").css("transform" ,"rotate(20deg)");
        }
    });

    $("div img.second_image").on({                                                           
        mouseenter: function(){ 
            $("div div.grey_box_two").css("transform" ,"rotate(-20deg)");
        },
        mouseleave: function(){
            $("div div.grey_box_two").css("transform" ,"rotate(20deg)");
        }
    });

    $("div img.third_image").on({                                                           
        mouseenter: function(){ 
            $("div div.grey_box_three").css("transform" ,"rotate(-20deg)");
        },
        mouseleave: function(){
            $("div div.grey_box_three").css("transform" ,"rotate(20deg)");
        }
    });

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav_menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    })
    
})

//creating an object that has all the data related to a product
//then we stringify the object so that we can store it in the localstorage
function add_to_cart(node) {
    let products = [];                          // we create an array to store all the info from the product

    let title = node.children("#item_title").html();                        
    let price = node.children("#item_price").attr("data-price");
    let size = node.children("#user_choice").children("#size").val();
    let quantity = node.children("#user_choice").children("#quantity").val();
    let color = node.children("#user_choice").children("#color").val(); 
    let image = "images/" + title.toLowerCase() + "/" + color + ".jpg";
    let new_price = parseFloat(price);                                                  
    new_price *= parseFloat(quantity);

    if(localStorage.getItem("cart"))                                                    // we check to see if localStorage already has products on the carts
        products = JSON.parse(localStorage.getItem("cart"));                            // we do this to retain products from being deleted when we add new products on the cart

    products.push({                                                                     // we then push a new object onto the array/cart
        users_image : image,                                                        
        users_title : title, 
        users_price : new_price, 
        users_size : size, 
        users_color : color, 
        users_quantity : quantity
    });
    
    localStorage.setItem("cart", JSON.stringify(products));                             //we stringify the array because localstorage can only store strings as values
}

//removing objects from the array that is stored within the localstorage
function remove_from_cart(node) {
    let products = [];                                                                  //creating an array that will be used to store the products from the cart
    products = JSON.parse(localStorage.getItem("cart"));                                //getting the products         

    for(let key in products) {
        if(products[key].users_image == node.children(".product_image").attr("src")) {  //we iterate through the array until we have a matching value between the cart and the node that user requested to delete
            products.splice(key, 1);                                                    //we delete the element from the array
            break;
        }           
    }
    if(products.length > 0)
        localStorage.setItem("cart", JSON.stringify(products));                         //we then set the product with the deleted element to the localstorage

    else 
        localStorage.removeItem("cart");
}

//this function will store the contents of a node into an object
//then the object will be pushed into an array
//then it will be stored onto the localStorage
function storeItem(node, description) {
    let desc = null;
    let temp = [];                                                                   

    if(node.hasClass("men"))         
        desc = description.children("#mens_tshirt").html();        

    else if(node.hasClass("women")) 
        desc = description.children("#womens_tshirt").html();

    else if(node.hasClass("hoodie_unisex"))
        desc = description.children("#unisex_hoodie").html();

    else if(node.hasClass("bucket_hats"))
        desc = description.children("#bucket_hat").html();

    else if(node.hasClass("regular_hats"))
        desc = description.children("#regular_hat").html();

    else if(node.hasClass("bags"))
        desc = description.children("#bag").html();

    let image = node.children("a").children("img").attr("src");
    let title = node.children(".title").html();
    let price = node.attr("data-price");
    let variants = node.attr("data-variants");
    let sizes = node.attr("data-size");

    temp.push({
        item_title : title, 
        item_image : image, 
        item_price : price, 
        item_desc : desc, 
        item_variants: variants, 
        item_sizes: sizes,
    });
    localStorage.setItem("temp" , JSON.stringify(temp));
}

//this function will "slice" an array and place the sliced array on another container element
//the array will be sliced at certain intervals.
//interval 1: elements 0 to 8
//interval 2: elements 9 to 16
//etc...
//each interval represents a page
function Paginate(DIVS, container, interval) {                                 
    let DIVS_per_page = 8;                                                              // we will break up the DIV elements into 8 per page                  
    let start = (interval - 1) * DIVS_per_page;                                         // (2 - 1) * 8 = 8, so the starting index to slice the DIV elements starts at 8  
    let end = start + DIVS_per_page;                                                    // 8 + 8 = 16, so the ending index to slice the DIV elements ends at 16
    let paginated_items = DIVS.slice(start, end);                                       // we slice the DIVS from index 8 to index 16, so this will be the second page
    container.html("");                                                                 // clearing the container

    for(let i = 0; i < paginated_items.length; i++) {
        container.append(paginated_items[i]);
    };
}

//this function will create a certain number of PAGE links
function CreatePages(DIVS, DIV_name) {
    let DIVS_per_page = 8;                                                              //we will display 8 elements per page
    let number_of_pages = Math.ceil(DIVS.length/DIVS_per_page);                         // 4/8 = 0.5  we then round it up to 1, so that means we have 1 page link that is created
    $(".pagination").html("");                                                          //we clear any previous page links the container

    for(let i = 0; i < number_of_pages; i++) {
       let attribute_value = "Paginate($('" + DIV_name + "').clone(), $('.list_container')," + (i + 1) + "), changePage($(this))"   //each page link will call the paginate and changePage function
       let page = $("<a>").attr("onclick", attribute_value).html(i + 1);                //we then create the actual page links and assign the proper attributes
       $(".pagination").append(page);                                                   //we then append the created page links onto the container

       if(i == 0)                                                                       //we always assign the first page link with the class "currentPage"
            $(".pagination a").attr("class", "currentPage");                            
    }
}

//this function will display a green block on the page we are currently on
function changePage(node) {
    $(".pagination a").attr("class", "");                                               
    node.attr("class", "currentPage");
}

//will trigger a click even on the "next" page link
function next_page() {
    let number_of_pages = $.makeArray($(".pagination a"));                              //getting all the page links into an array
    let current_page;                                           

    for(let i = 0; i < number_of_pages.length; i++) {
            if($(number_of_pages[i]).attr("class") == "currentPage") {                  //iterating through the array until we find a page link with the class "currentPage"
                current_page = i;                                                       //we assign the index, in the array, that has the page link with class "currentPage" to the variable
                if(number_of_pages[i+1] != undefined)                                   //this "if" statement makes sure that we are not in the last element of the array, we dont want to remove "currentPage" when we reached the end of array
                    $(number_of_pages[i]).attr("class", "");                            //we remove the class "currentPage" from this specific page link                         
            }
    }
    if((current_page + 1) < number_of_pages.length) {                                   //this "if" statement makes sure that we do not index an element that doesnt exist in the array
        $(number_of_pages[current_page + 1]).attr("class", "currentPage");              //we assign the next "page link", in the array, with the class "currentPage"
        $(number_of_pages[current_page + 1]).click();                                   //we trigger the click even programatically
    }
}

//will tigger a click event on the "previous" page link
function previous_page() {
    let number_of_pages = $.makeArray($(".pagination a"));
    let current_page;

    for(let i = 0; i < number_of_pages.length; i++) {
            if($(number_of_pages[i]).attr("class") == "currentPage") {
                current_page = i;
                if((i-1) >= 0)                                                          //this "if" statement will make sure that we dont delete the class "currentPage" from the first page link in the array
                    $(number_of_pages[i]).attr("class", "");            
            }
    }
    if((current_page - 1) >= 0) {                                                       //this "if" statement will make sure that we dont index an undefined element 
        $(number_of_pages[current_page - 1]).attr("class", "currentPage");              //we assign the previous link with class "currentPage"
        $(number_of_pages[current_page - 1]).click();                                   //we trigger the click event 
    }
}

//this function will filter certain DIVS on the screen
function filterItems() {
    let men = "#DIV_array div.men";
    let women = "#DIV_array div.women";
    let unisex = "#DIV_array div.hoodie_unisex";
    let regular_hats = "#DIV_array div.regular_hats";
    let bucket_hats = "#DIV_array div.bucket_hats";
    let bags = "#DIV_array div.bags";
    let all = "#DIV_array div";

    if($(".filter_one").val() == "men") {
        $(".list_container").html("");
        Paginate($("#DIV_array div.men").clone(), $('.list_container'), 1);    
        CreatePages($("#DIV_array div.men"), men);                                           
    }
    else if($(".filter_one").val() == "women") {    
        $(".list_container").html("");
        Paginate($("#DIV_array div.women").clone(), $('.list_container'), 1);
        CreatePages($("#DIV_array div.women"), women);
    }
    else if($(".filter_one").val() == "unisex_hoodies") {
        $(".list_container").html(""); 
        Paginate($("#DIV_array div.hoodie_unisex").clone(), $('.list_container'), 1);
        CreatePages($("#DIV_array div.hoodie_unisex"), unisex);
    }
    else if($(".filter_one").val() == "regular_hats") {
        $(".list_container").html("");
        Paginate($("#DIV_array div.regular_hats").clone(), $(".list_container"), 1);
        CreatePages($("#DIV_array div.regular_hats"), regular_hats);
    }
    else if($(".filter_one").val() == "bucket_hats") {
        $(".list_container").html("");
        Paginate($("#DIV_array div.bucket_hats").clone(), $(".list_container"), 1);
        CreatePages($("#DIV_array div.bucket_hats"), bucket_hats);
    }
    else if($(".filter_one").val() == "bags") {
        $(".list_container").html("");
        Paginate($("#DIV_array div.bags").clone(), $(".list_container"), 1);
        CreatePages($("#DIV_array div.bags"), bags);
    }
    else {
        $(".list_container").html("");
        Paginate($("#DIV_array div").clone(), $('.list_container'), 1);
        CreatePages($("#DIV_array div"), all);                                                          
    }
}


function sortItems() {
    let DIVarrayClone = $("#DIV_array div").clone();                     // all the DIV elements are in an array

    if($("section select.filter_two").val() == "A-Z") {  
        $("#DIV_array").html("");   
        let sorted = DIVarrayClone.sort(ascendingSort);                  // sorting the array in ascending order 
        $.each(sorted, (i, value) => {$("#DIV_array").append(value)} );
        filterItems();                                                   //checking to see if the user has changed the value in the filter box 
    }    
    else if($("section select.filter_two").val() == "Z-A") {
        $("#DIV_array").html("");   
        let sorted = DIVarrayClone.sort(descendingSort);                 // sorting the array in descending order 
        $.each(sorted, (i, value) => {$("#DIV_array").append(value)} );
        filterItems();                                                   //checking to see if the user has changed the value in the filter box
    }   
    else {
        $("#DIV_array").html("");   
        let sorted = DIVarrayClone.sort(originalOrder);                  // sorting the array in original order 
        $.each(sorted, (i, value) => {$("#DIV_array").append(value)} );
        filterItems();                                                   //checking to see if the user has changed the value in the filter box
    }
}

function ascendingSort (a, b) {                                 
    if (a.dataset.sort < b.dataset.sort)        //dataset.sort is accessing the value assigned to the attribute "data-sort"
        return -1;
    else if (a.dataset.sort > b.dataset.sort)
        return 1;
    else
        return 0;
}

function descendingSort (a, b) {
    if (a.dataset.sort < b.dataset.sort)        //dataset.sort is accessing the value assigned to the attribute "data-sort"
        return 1;
    else if (a.dataset.sort > b.dataset.sort)
        return -1;
    else
        return 0;
}

function originalOrder (a, b) {
    if (parseInt(a.dataset.index) < parseInt(b.dataset.index))        
        return -1;
    else if (parseInt(a.dataset.index) > parseInt(b.dataset.index))
        return 1;
    else
        return 0;
}