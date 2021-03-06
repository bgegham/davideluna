$(document).ready(function () {

    $(".removeHeader").bind("click", function () {
        var id = $(this).attr("data-remove").replace(/\"/g, "");

        if(id && confirm("Are you sure?") ){
            $.ajax({
                type: 'POST',
                url: '/control/admin/footers/remove',
                dataType: 'json',
                data: {
                    id : id
                },
                success: function () {
                    document.location.reload();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    document.location.reload();
                }
            });
        }
    });

    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function (event, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var _id = $(input).attr("data-preview");
                $('#'+_id).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function (event) {
                    $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $(".inputFile").change(function () {
        readURL(this);
    });
    $('.inputFileImages').on('change', function () {
        $("div.inputFileImages-gallery").html("");
        imagesPreview(this, 'div.inputFileImages-gallery');
    });


});