function AjaxGetBooksByTitle(querry) {
    $.ajax({
        url: Routing.generate('library_addSearch'),
        dataType: 'json',
        method: "POST",
        data: {},
        crossDomain: true,
        async: true,
        success: function (data) {
            console.log(data);
            var result = data;
            return result;
        }
    });
}
