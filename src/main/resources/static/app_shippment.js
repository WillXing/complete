    //////////////////////////////////////////////////////////////////////
    //Below are Global Variables to  js functions in this app_shippment.js
    //////////////////////////////////////////////////////////////////////
    var shipsheet = "";
    var printContent = "";
    var shipID = "shipment"+id;
    var id=0;   var counter = 0;    var number = 0;
    var seperator = "-";    var joint = "||";
    //////////////////////////////////////////////////////////////////////
    function alertingMessage() {
        alert("i am here for you!!");
    }
    function getNumberOfCategories() {
       var noCat = $('.numberOfCategories').text();
       return (noCat);
    }
    function forEach(list,callback) {
      var length = list.length;
      for (var n = 0; n < length; n++) {
        callback.call(list[n]);
      }
    }
    function stopSumbitOnEter() {
        var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
         if ( chCode == 13 ) {
            event.preventDefault();
            alert("you can press ENTER");
            return false;
         }
    }

    function popupShipmentDetails(shipNo) {
        alert("tesing");
        $('.modal').toggleClass('active');
        $('#shipmentNo').text(shipNo);
        //popupShippment(shipNo);
        var ajaxGetShippmentURL = "/ajaxpPrintShippmentURL?shipNo="+shipNo;
        //var ajaxGetShippmentURL = "/ajaxGetShippmentURL?shipNo="+shipNo;
        printContent = "";
        $.ajax({url: ajaxGetShippmentURL, success: function(popupShippment_result){
            var getShippment = popupShippment_result;
            var shipNo = getShippment.shipNo;
            var weight= getShippment.weight;
            var products = getShippment.products;
            var enabled = getShippment.enabled;
            var order_id = getShippment.order_id;
            var weightContent = "weight: <input type=text size=3 class=ontheleft/>";
            var productsContent = parserShipContent(products);
            var shipNoButton = '<button class="button-border toggleModal" onclick="popupShipmentDetails('+shipNo+')"><span class="icon"></span>show new</button>';
            var shipContent = '<p>Ship NO: '+shipNo+' || '+weightContent+' || '+shipNoButton+'</p><div>'+productsContent+'</div><br/>';
            printContent = "<div class='divSelection divSelectionNew'>"+shipContent+"</div>";
            //alert("printContent: "+printContent);
            //$( "div.orderShippment" ).prepend(content);
            //alert(content);
        }})
        .fail(function() {
                   alert( "error" );
                   });
        alert("printContent: "+printContent);
    }
    function PopupToPrint() {
        var mywindow = window.open('', 'Print Shippment Slip', 'height=400,width=600');
		//var printContent = "<div id=''mydiv'>i just print.</div>";
        mywindow.document.write('<html><head><title>Print Shippment Slip</title>');
        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('</head><body >');
        var shipNo = $('#shipmentNo').text();
        popupShippment(shipNo);
        alert("printContent: "+printContent);
        var shippmentDetail = printContent;
        mywindow.document.write(shippmentDetail);
		//mywindow.document.write(data);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

        return true;
    }
    function popupShippment(shipNo) {
        var ajaxGetShippmentURL = "/ajaxpPrintShippmentURL?shipNo="+shipNo;
        //var ajaxGetShippmentURL = "/ajaxGetShippmentURL?shipNo="+shipNo;
        printContent = "";
        $.ajax({url: ajaxGetShippmentURL, success: function(popupShippment_result){
            var getShippment = popupShippment_result;
            var shipNo = getShippment.shipNo;
            var weight= getShippment.weight;
            var products = getShippment.products;
            var enabled = getShippment.enabled;
            var order_id = getShippment.order_id;
            var weightContent = "weight: <input type=text size=3 class=ontheleft/>";
            var productsContent = parserShipContent(products);
            var shipNoButton = '<button class="button-border toggleModal" onclick="popupShipmentDetails('+shipNo+')"><span class="icon"></span>show new</button>';
            var shipContent = '<p>Ship NO: '+shipNo+' || '+weightContent+' || '+shipNoButton+'</p><div>'+productsContent+'</div><br/>';
            printContent = "<div class='divSelection divSelectionNew'>"+shipContent+"</div>";
            //alert("printContent: "+printContent);
            //$( "div.orderShippment" ).prepend(content);
            //alert(content);
        }})
        .fail(function() {
        alert( "error" );
        });
        //return content;
    }

    function calculateAssignedQTY(shipQTY_id) {
        var shipQTY = $($(shipQTY_id).parentsUntil("tbody")[1]).find("input");
        var assignedQTY = 0;
        forEach(shipQTY, function(){
            assignedQTY = assignedQTY + Number(this.value);
        });
        $($($($(shipQTY_id).parentsUntil("tbody")[1]).find("p"))[4]).text(assignedQTY);

    }

    function addShippmentOrder(shipQTY_id, shipNumber_id) {
        var shipNo = $("."+shipNumber_id).val();
        var enabled = 1;
        var order_id = order.id;

        var products = "";
        var QTYlist = document.getElementsByClassName(shipQTY_id);

        $.each(QTYlist, function( index, qty ) {
            var productName = trans[index].product_name;
            var productQTY  = qty.value;
            if(products != "") {
                products = products + joint + productQTY+"*"+productName;
            } else  products = productQTY+"*"+productName;
        });
        var updateShippment =  0;
        var shippmentDetails = shipNo +seperator+ products +seperator+ order_id +seperator+ enabled;
        //Below: Ajax call to update Shippment.
        var ajaxUpdateShippmentURL = "/insertNewShippmentURL?shippmentDetails="+shippmentDetails;
        $.ajax({url: ajaxUpdateShippmentURL, success: function(ajaxUpdateShippment_result){
            number++;
            updateShippment = ajaxUpdateShippment_result;
            if(updateShippment != 0) {
                addNewShippmentIntoHtml(shipNo); //another ajax call to open the new shippment just created
            }
        }});
    }
    function parserShipContent(shipContent) {
        var formattedContent = "";
        var contentList = shipContent.split("||");
        for(key in contentList){
            if(formattedContent != "") {
                 formattedContent = formattedContent + "<tr><td>"+contentList[key].split("*")[0]+"</td><td>---</td><td>"+contentList[key].split("*")[1]+"</td></tr>";
            } else  formattedContent = "<tr><td>"+contentList[key].split("*")[0]+"</td><td>---</td><td>"+contentList[key].split("*")[1]+"</td></tr>";
        }
        formattedContent = "<table class='innerProductDiv' >"+formattedContent+"</table>";
        return formattedContent;
    }
    function addNewShippmentIntoHtml(shipNo) {
        var ajaxGetShippmentURL = "/ajaxGetShippmentURL?shipNo="+shipNo;
        $.ajax({url: ajaxGetShippmentURL, success: function(addNewShippmentIntoHtml_result){
            var getShippment = addNewShippmentIntoHtml_result;
            var shipNo = getShippment.shipNo;
            var weight= getShippment.weight;
            var products = getShippment.products;
            var enabled = getShippment.enabled;
            var order_id = getShippment.order_id;
            var weightContent = "weight: <input type=text size=3 class=ontheleft/>";
            var productsContent = parserShipContent(products);
            //var shipNoButton = '<button class="button-border toggleModal" onclick="popupShipmentDetails("'+shipNo+'")"><span class="icon"></span>shownew</button>';
            var shipNoButton = "<button class=button-border toggleModal onclick=popupShipmentDetails('"+shipNo+"')><span class=icon></span>Freight</button>";
            var shipContent = '<p>Ship NO: '+shipNo+' || '+weightContent+' || '+shipNoButton+'</p><div>'+productsContent+'</div><br/>';
            var content = "<div class='divSelection divSelectionNew'>"+shipContent+"</div>";
            $( "div.orderShippment" ).prepend(content);
        }});
    }
    function loadExistingShippments(id) {
        var content = null;
        var weightContent = null;
        var testURL    = "/ajaxShippmentsListURL?id="+id;
        $.ajax({url: testURL, success: function(loadExistingShippments_result){
            var ShippmentsList = loadExistingShippments_result;
            forEach(ShippmentsList, function(){
                var shipNo = this.shipNo;
                var weight= this.weight;
                var products = this.products;
                var enabled = this.enabled;
                var order_id = this.order_id;
                if(weight == 0 || weight == null) weightContent = "weight: <input type=text size=3 value='"+this.weight+"'/>";
                else weightContent = "weight: <input type=text disabled size=3 value='"+this.weight+"'/>";
                var productsContent = parserShipContent(products);
                var shipNoButton = "<button class=button-border toggleModal onclick=popupShipmentDetails('"+shipNo+"')><span class=icon></span>Freight</button>";
                var shipContent = '<p>Ship NO: '+shipNo+' || '+weightContent+' || '+shipNoButton+'</p>'+productsContent+'<br/>';
                content = "<div class='divSelection'>"+shipContent+"</div>";
                $( "div.orderShippment" ).append(content);
            });
        }});
    }

    $( document ).ready(function() {
        loadExistingShippments(order.id);

    $('.toggleModal').on('click', function(e) {
        $('.modal').toggleClass('active');
    });

        $('#icol').click(function(){
            //if($('#col').val()){
                $('#mtable tr').append($("<td>"));
                $('#mtable thead tr>td:last').html('<input name=shipNumber class=shipNumber_'+counter+' type=text size=20 onkeypress=stopSumbitOnEter()  onclick=addShippmentOrder("shipQTY_"+'+counter+',"shipNumber_"+'+counter+') />');
                $('#mtable thead tr>td:last input').val($('#col').val());
                $('#col').val("");
                $('#mtable tbody tr').each(function(){
                    $(this).children('td:last').append($('<input name="shipQTY_'+counter+'" class="shipQTY_'+counter+'" type="number" value="0" size="4" onchange=calculateAssignedQTY('+"this"+') onkeypress="stopSumbitOnEter()">'))
                });
                counter++;
            //}else{alert('Enter Text');}
        });
        $('#irow').click(function(){
            if($('#row').val()){
                $('#mtable tbody').append($("#mtable tbody tr:last").clone());
                //$('#mtable tbody').append($("#mtable tbody tr:last").append("<td><input type='text'/></td>"));
                //$('#mtable tbody tr:last td:first').html(('<input type="text"/>').val($('#row').val()));
                $('#mtable tbody tr:last td:first').html(('<input name="shipQTY" type="text" onkeypress="stopSumbitOnEter()"/>'));
                $('#mtable tbody tr:last td:first input').val($('#row').val());
            }else{alert('Enter Text');}
        });

        $('.addShippmentButton').click(function() {
            ///////////////////////////////////////////////////////////////////////////////////////
            var trans_dropdown_potions = "";

            forEach(trans, function(){
                trans_dropdown_potions = trans_dropdown_potions + "<option value="+this.product_name+">"+this.product_name+"</option>";
            });
            var trans_dropdown = "<select>" + trans_dropdown_potions + "</select>";
            var trans_content = "<table><tr><td><div>"+ trans_dropdown +"</div></td><td><input type='number' size='4' id='trans_qty' name='trans_qty' min='1' max='10'/></td></tr></table>";
            temp = trans_content;
            //////////////////////////////////////////////////////////////////////////////////////
            var order_content = "<div class='divSelection' id="+shipID+" onlick='addTransactionSelection()'><input type='text' name='shippmentNumnber' onkeypress='stopSumbitOnEter()'/><input type='radio' name='shippmentDiv' checked/></div>";

            $( "div.orderShippment" ).append(order_content);
            id++;
            shipID = "shipment"+id;
        });
        $('.addProductButton').click(function() {
            shipsheet = $("input:checked").parent();
            $(shipsheet).append(temp);
        });/**/ //addShippmentButton() and addProductButton() commented and disabled with addTransactionSelection()
    });

    function addTransactionSelection() {
            var trans_dropdown_potions = "";
            forEach(trans, function(){
                trans_dropdown_potions = trans_dropdown_potions + "<option value="+this.product_name+">"+this.product_name+"</option>";
            });
           var trans_dropdown = "<select>" + trans_dropdown_potions + "</select>";
            var trans_content = "<table><tr><td><div>"+ trans_dropdown +"</div></td></tr></table>";
            var temp = trans_content;
    };