$(document).ready(function() {


  var books = [
    {isbn: 9781781101032},
    {isbn: 9781623150273},
    {isbn: 9782747073288},
    {isbn: 9782266223690},
    {isbn: 9782747073288},
    {isbn: 9782747021067},
    {isbn: 9782747073288},
    {isbn: 9782747073288},
    {isbn: 9782747064903},
  ]

  // $.each(books,function(index, value) {
  //   $.ajax({
  // 		url:"../script/test.php",
  // 		datatype:"jsonp",
  // 		method:'POST',
  // 		data:{url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + value.isbn},
  //     crossDomain: true,
  // 		async:false,
  // 		success:function(data){
  // 			var result = JSON.parse(data);
  //       var item = result.items[0].volumeInfo;
  //       var template = `<li class='book-wrapper'>
  //                       <div class="cover" style='background-image: url("`+(item.imageLinks != null?item.imageLinks.thumbnail:'noexist.jpg') +`")'></div>
  //                       <div class="name info-book">`+ item.title +`</div>
  //                       <div class="author info-book">`+ item.authors[0] +`</div>
  //                       <div class="rating info-book">
  //                         <img src="../assets/star_plain.svg" alt="">
  //                         <img src="../assets/star_plain.svg" alt="">
  //                         <img src="../assets/star_plain.svg" alt="">
  //                         <img src="../assets/star_half.svg" alt="">
  //                         <img src="../assets/star_empty.svg" alt="">
  //                       </div>
  //                     </li>`;
  //       $("#books-une").append(template);
  // 		}
  // 	});
  //
  // });



  $(document).click(function(){
    $('.popup-box').hide().attr('state','false');
  })

  $(window).resize(function(event) {
    $('.popup-box').hide().attr('state','false');
  });



  $("body").on('click','.popup-bouton',function(event){
    event.stopPropagation();
    var popupName = $(this).attr("popup");
    var state = $("#" + popupName).attr('state');


    if (state == 'false') {
      $('.popup-box').hide().attr('state','false');
      var width = $(this).outerWidth();
      var position = Math.round($(this).offset().left);

      var popupWidth = $("#" + popupName).width();
      var outputLeft = position + width / 2 - popupWidth / 2;
      var windowWidth = $(window).width();

      if((outputLeft + popupWidth) > (windowWidth - 10)){
        outputLeft = windowWidth - popupWidth - 10;
        left = position - outputLeft + (width/2)
        $("#" + popupName).find('#pin').css({left: left})
      }

      $("#" + popupName).css({
        left: outputLeft,
        display: 'block'
      }).attr('state','true')
    }
    else{
      $("#" + popupName).attr('state','false').hide();
    }
  })


  $(".popup-box").click(function(event){
    event.stopPropagation();
  })

  







});
