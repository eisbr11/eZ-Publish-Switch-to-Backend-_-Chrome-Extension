$(document).ready(function() {
   
    // read saved settings out of local Storage and convert them from JSON to a JS-Object
    saved_settings = $.parseJSON(localStorage["settings"]);
   
    $('#btnAdd').click(function() {
        var num     = $('.url_lines').length; // how many "duplicatable" input fields we currently have
        var newNum  = new Number(num + 1);      // the numeric ID of the new input field being added
    
        // create the new element via clone(), and manipulate it's ID using newNum value
        var newElem = $('#input' + num).clone().attr('id', 'input' + newNum);
    
        // manipulate the name/id values of the input inside the new element
        newElem.children(':first').attr('id', 'furl' + newNum).attr('name', 'furl' + newNum).val("");
        newElem.children(':last').attr('id', 'burl' + newNum).attr('name', 'burl' + newNum).val("");
    
        // insert the new element after the last "duplicatable" input field
        $('#input' + num).after(newElem);
    
        // enable the "remove" button
        $('#btnDel').removeAttr('disabled');
    
        // business rule: you can only add 5 names
        if (newNum == 15){
            $('#btnAdd').attr('disabled','disabled');
        }
        message_empty();
    });
    
    $('#btnDel').click(function() {
        var num = $('.url_lines').length; // how many "duplicatable" input fields we currently have
        $('#input' + num).remove();     // remove the last element
    
        // enable the "add" button
        $('#btnDel').removeAttr('disabled');
    
        // if only one element remains, disable the "remove" button
        if (num-1 <= 1){
            $('#btnDel').attr('disabled','disabled');
        }
        message_empty();
    });
    
    function add_line_with_content(line){
        $('#ezpswitcher_settings div.url_lines:last input[id^=furl]').val(line.frontend_url);
        $('#ezpswitcher_settings div.url_lines:last input[id^=burl]').val(line.backend_url);
        $('#btnAdd').click();
    }

    // is executed, when the page is loaded first
    function init(){
        if(saved_settings != null && saved_settings != undefined){
            $.each(saved_settings.lines,function(){
                if (this.frontend_url && this.backend_url){
                    add_line_with_content(this);    
                }
            });
            if(saved_settings.lines.length==0){
                $('#btnDel').attr('disabled','disabled');
            }
        } else {
            $('#btnDel').attr('disabled','disabled');
        }
        message_empty();
    }
    
    // todo: Kontrolle, wenn ein Feld leer, dann nicht aufgenommen
    $('#btnSave').click(function(){
        var save_json = '{"lines": [';
        $('#ezpswitcher_settings div.url_lines').each(function(index){
            save_json += '{"frontend_url":"' + $(this).children('input[name^="furl"]').val() + '",';
            save_json += '"backend_url":"' + $(this).children('input[name^="burl"]').val() + '"}';
            if ($('#ezpswitcher_settings div.url_lines').length != (index + 1) ){
               save_json +=','; 
            }
        });
        save_json += ']}';
        localStorage["settings"] = save_json;
        message_success();
    });
    init();
});

function message_success(){
    $('#message-box').html("The changes were saved succesfully");
}

function message_empty(){
    $('#message-box').html("");
}

// JSON MODELL:
/*
[{
    "lines": [
        {
            "frontend_url":"",
            "backend_url": ""
        },
        {
            "frontend_url":"",
            "backend_url": ""
        }
    ]
    
}]
*/