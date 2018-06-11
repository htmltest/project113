$(document).ready(function() {

    $('.video-play').click(function(e) {
        $('.video').addClass('play');
        player.playVideo();
        e.preventDefault();
    });

    $('.auth-form-input input, .rating-form-input input').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    $('body').on('focus', '.auth-form-input input, .rating-form-input input', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.auth-form-input input, .rating-form-input input', function() {
        if ($(this).val() == '') {
            if ($(this).parent().filter('.auth-form-input-date').length == 0) {
                $(this).parent().removeClass('focus');
            } else {
                window.setTimeout(function() {
                    $('.auth-form-input-date input').each(function() {
                        if ($(this).val() == '') {
                            $(this).parent().removeClass('focus');
                        }
                    });
                }, 100);
            }
        }
    });

    $('form').each(function() {
        $(this).validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            },
            submitHandler: function(form) {
                form.submit();
            }
        });
    });

    var dateFormat = 'dd.mm.yy';

    $('.auth-form-input-date input').datepicker({
        dateFormat: dateFormat
    });

    $('body').on('click', '.reg-form-password-show', function(e) {
        var curInput = $(this).parent().find('input');
        if (curInput.attr('type') == 'password') {
            curInput.prop('type', 'text');
        } else {
            curInput.prop('type', 'password');
        }
        e.preventDefault();
    });

});

function checkErrors() {
    $('.auth-form-checkbox').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}