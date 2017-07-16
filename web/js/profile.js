/**
 * Created by Cyriaque on 15/07/2017.
 */
$(function () {
    var id_user_profile = $('#id_user_profile').val();

    console.log("id_user_profile : " + id_user_profile);


    $('.alert-contact').click(function () {
        $('.alert-contact').empty();
    })
    // Modal pour la demande d'échange

    $('.open-exchange').click(function(){
       var idMedia =  $(this).attr("data-id-media");
       var url = "/get-book-info/"+idMedia;

       //Récupération des infos du livre selectionner

       $.getJSON(url,function (data) {

           data = JSON.parse(data);

            var img = data.img;
            var description = data.description;
            var title_book = data.name;
            var author = data.author;

            $(".img-modal-book").val('src',img);
            $(".title-book").text(title_book);
            $(".author-book").text(author);
            $(".description-book").text(description);
       })
    }
    );

    // Contact Utilisateur Formulaire

    $('.send_message').click(function(){

        console.log("click send message OK");

        var name = $("#name_user").val();
        var mail = $("#mail_user").val();
        var subject = $("#subject_user").val();
        var message = $("#message_user").val();

        if(name == "" || mail == "" || subject == "" || message == ""){
            $('.alert-contact').html('<div class="alert alert-danger" role="alert">Tous les champs doivent être remplie</div>');
        }
        else{
            $.post("/message/private/send",{name:name,mail:mail,subject:subject,message:message,target_user:id_user_profile},function (data){
                data = JSON.parse(data);
                if(data){
                    $('.alert-contact').html('<div class="alert alert-success" role="alert">Message bien à bien été envoyé.</div>');

                    // Vider les champs
                    $("#name_user").val('');
                    $("#mail_user").val('');
                    $("#subject_user").val('');
                    $("#message_user").val('');
                }
                else{
                    $('.alert-contact').html('<div class="alert alert-danger" role="alert">Une erreur est survenue lors de l\'envoie du message.</div>');
                }
            })
        }
    })

})