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

    $('.welcome-next').click(function() {
        $('html, body').animate({'scrollTop': $('.games').offset().top});
    });

    $(window).on('load resize scroll', function() {
        $('.contest').each(function() {
            $(this).height($('.contest-step.active').height());
        });
    });

    var img = new Image();
    var imgWidth  = 0;
    var imgHeight = 0;
    var imgZoom = 1;
    var imgRotate = 0;
    var imgLeft = 0;
    var imgTop = 0;
    var TO_RADIANS = Math.PI/180;
    var exifOrientation = 0;

    $('.contest-photo-upload-field input').on('change', function(e) {
        var file = this.files[0];
        var reader = new FileReader;
        reader.onload = function(event) {
            if (file.type.match("image.*")) {
                EXIF.getData(file, function () {
                    switch (this.exifdata.Orientation) {
                        case 1:
                            exifOrientation = 0;
                            break;
                        case 2:
                            exifOrientation = 0;
                            break;
                        case 3:
                            exifOrientation = 180;
                            break;
                        case 4:
                            exifOrientation = 180;
                            break;
                        case 5:
                            exifOrientation = 90;
                            break;
                        case 6:
                            exifOrientation = 90;
                            break;
                        case 7:
                            exifOrientation = -90;
                            break;
                        case 8:
                            exifOrientation = -90;
                            break;
                        default:
                            exifOrientation = 0
                    }
                });
                var dataUri = event.target.result;
                var canvas = document.getElementById('photo-editor');
                var context = canvas.getContext('2d');
                img.onload = function() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    imgWidth  = img.width;
                    imgHeight = img.height;
                    imgZoom = 1;
                    imgRotate = 0;
                    imgLeft = 0;
                    imgTop = 0;
                    var newWidth  = 419;
                    var newHeight = 419;
                    var newX = -210;
                    var newY = -210;
                    if (imgWidth > imgHeight) {
                        var diffHeight = newHeight / imgHeight;
                        newWidth = imgWidth * diffHeight;
                        newX = -(newWidth - 419) / 2 - 210;
                    } else {
                        var diffWidth = newWidth / imgWidth;
                        newHeight = imgHeight * diffWidth;
                        newY = -(newHeight - 419) / 2 - 210;
                    }
                    context.save();
                    context.translate(210, 210);
                    context.rotate(exifOrientation * TO_RADIANS);
                    context.drawImage(img, newX, newY, newWidth, newHeight);
                    context.restore();
                    $('.contest-list').addClass('contest-list-editor');
                    $('.contest-step.active').removeClass('active');
                    $('.contest-step-2').addClass('active');
                    $('.contest').height($('.contest-step.active').height());
                };
                img.src = dataUri;
            }
        }
        reader.readAsDataURL(file);
    });

    var localstream;

    $('.contest-photo-camera-field').click(function() {
        $('.contest-photo').addClass('camera');
        window.navigator = window.navigator || {};
         navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || null;
        if (navigator.getUserMedia !== null) {
            var createSrc = window.URL ? window.URL.createObjectURL : function(stream) { return stream; };
            navigator.getUserMedia(
                {
                    audio: false,
                    video: true
                },
                function(stream) {
                    var video = document.getElementById('camera-stream');
                    video.src = createSrc(stream);
                    localstream = stream;
                    video.play();
                },
                function(err){
                    alert('Ошибка: ' + err.name, err);
                    $('.contest-photo').removeClass('camera');
                }
            );
        } else {
            $('.contest-photo').removeClass('camera');
        }
    });

    $('.contest-camera-btn').click(function(e) {
        var video = document.getElementById('camera-stream');
        video.pause();
        var canvas = document.getElementById('photo-editor');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        imgWidth  = video.videoWidth;
        imgHeight = video.videoHeight;
        var newWidth  = 419;
        var newHeight = 419;
        var newX = 0;
        var newY = 0;

        var canvasTemp = document.getElementById('video-temp');
        var contextTemp = canvasTemp.getContext('2d');
        canvasTemp.width = video.videoWidth;
        canvasTemp.height = video.videoHeight;

        contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
        contextTemp.drawImage(video, 0, 0, canvasTemp.width, canvasTemp.height);
        img.src = canvasTemp.toDataURL('image/jpeg');

        imgZoom = 1;
        imgRotate = 0;
        imgLeft = 0;
        imgTop = 0;

        if (imgWidth > imgHeight) {
            var diffHeight = newHeight / imgHeight;
            newWidth = imgWidth * diffHeight;
            newX = -(newWidth - 419) / 2;
        } else {
            var diffWidth = newWidth / imgWidth;
            newHeight = imgHeight * diffWidth;
            newY = -(newHeight - 419) / 2;
        }
        context.drawImage(video, newX, newY, newWidth, newHeight);
        video.src = '';
        localstream.getTracks()[0].stop();

        $('.contest-photo').removeClass('camera');
        $('.contest-list').addClass('contest-list-editor');
        $('.contest-step.active').removeClass('active');
        $('.contest-step-2').addClass('active');
        $('.contest').height($('.contest-step.active').height());

        e.preventDefault();
    });

    function redrawImg() {
        var canvas = document.getElementById('photo-editor');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        var newWidth  = 419 * imgZoom;
        var newHeight = 419 * imgZoom;
        var newX = -210 * imgZoom;
        var newY = -210 * imgZoom;
        if (imgWidth > imgHeight) {
            var diffHeight = newHeight / imgHeight;
            newWidth = imgWidth * diffHeight;
            newX = -(newWidth - 419 * imgZoom) / 2 - 210 * imgZoom;
        } else {
            var diffWidth = newWidth / imgWidth;
            newHeight = imgHeight * diffWidth;
            newY = -(newHeight - 419 * imgZoom) / 2 - 210 * imgZoom;
        }

        context.save();
        context.translate(210 + imgLeft, 210 + imgTop);
        context.rotate((exifOrientation + imgRotate) * TO_RADIANS);
        context.drawImage(img, newX, newY, newWidth, newHeight);
        context.restore();
    }

    $('.contest-photo-editor-zoom-inc').click(function(e) {
        imgZoom += 0.1;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-zoom-dec').click(function(e) {
        imgZoom -= 0.1;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-rotate').click(function(e) {
        imgRotate += 90;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-move').click(function(e) {
        $('.contest-photo-editor').addClass('moving');
        e.preventDefault();
    });

    $('.contest-photo-editor-move-left').click(function(e) {
        imgLeft -= 10;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-move-right').click(function(e) {
        imgLeft += 10;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-move-up').click(function(e) {
        imgTop -= 10;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-move-down').click(function(e) {
        imgTop += 10;
        redrawImg();

        e.preventDefault();
    });

    $('.contest-photo-editor-moving-close').click(function(e) {
        $('.contest-photo-editor').removeClass('moving');
        e.preventDefault();
    });

    $('.contest-photo-editor-change').click(function(e) {
        $('.contest-list').removeClass('contest-list-editor');
        $('.contest-step.active').removeClass('active');
        $('.contest-step-1').addClass('active');
        $('.contest').height($('.contest-step.active').height());
        e.preventDefault();
    });

    $('.contest-photo-item-next').click(function(e) {
        $('.contest-list').removeClass('contest-list-editor').addClass('contest-list-describe');
        $('.contest-step.active').removeClass('active');
        $('.contest-step-3').addClass('active');
        $('.contest').height($('.contest-step.active').height());
        var canvas = document.getElementById('photo-editor');
        $('.describe-img img').attr('src', canvas.toDataURL('image/jpeg'));
        $('.share-img img').attr('src', canvas.toDataURL('image/jpeg'));
        e.preventDefault();
    });

    $('.contest-welcome-title-prev-to-photo').click(function(e) {
        $('.contest-list').removeClass('contest-list-describe contest-list-share').addClass('contest-list-editor');
        $('.contest-step.active').removeClass('active');
        $('.contest-step-2').addClass('active');
        $('.contest').height($('.contest-step.active').height());
        e.preventDefault();
    });

    $('.contest-welcome-title-prev-to-describe').click(function(e) {
        $('.contest-list').removeClass('contest-list-share').addClass('contest-list-describe');
        $('.contest-step.active').removeClass('active');
        $('.contest-step-3').addClass('active');
        $('.contest').height($('.contest-step.active').height());
        e.preventDefault();
    });

    $('.describe-next a').click(function(e) {
        if ($('.describe-textarea textarea').val() != '') {
            // json с картинками в base64 и текстом
            var dataTransfer = {
                "curText": $('.share-textarea textarea').val()
            };

            $('.contest-list').removeClass('contest-list-describe').addClass('contest-list-share');
            $('.contest-step.active').removeClass('active');
            $('.contest-step-4').addClass('active');
            $('.contest').height($('.contest-step.active').height());
            $('.share-textarea textarea').val($('.describe-textarea textarea').val());

            var canvas = document.getElementById('social-editor');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillRect(0, 0, canvas.width, canvas.height);

            var newWidth  = 419 * imgZoom;
            var newHeight = 419 * imgZoom;
            var newX = -210 * imgZoom;
            var newY = -210 * imgZoom;
            if (imgWidth > imgHeight) {
                var diffHeight = newHeight / imgHeight;
                newWidth = imgWidth * diffHeight;
                newX = -(newWidth - 419 * imgZoom) / 2 - 210 * imgZoom;
            } else {
                var diffWidth = newWidth / imgWidth;
                newHeight = imgHeight * diffWidth;
                newY = -(newHeight - 419 * imgZoom) / 2 - 210 * imgZoom;
            }

            context.save();
            context.translate(210 + imgLeft + 331, 210 + imgTop + 31);
            context.rotate((exifOrientation + imgRotate) * TO_RADIANS);
            context.drawImage(img, newX, newY, newWidth, newHeight);
            context.restore();
            var imgTheme = new Image();
            imgTheme.onload = function() {
                context.drawImage(imgTheme, 0, 0, canvas.width, canvas.height);
                $('#social-editor-img').attr('src', canvas.toDataURL('image/jpeg'));

                dataTransfer["curIMG"] = $('#social-editor-img').attr('src');
            };
            imgTheme.src = $('.share-img-to-social').data('border');

            var canvas2 = document.getElementById('social-editor2');
            var context2 = canvas2.getContext('2d');
            context2.clearRect(0, 0, canvas2.width, canvas2.height);
            context2.fillRect(0, 0, canvas2.width, canvas2.height);

            var newWidth2  = 687 * imgZoom;
            var newHeight2 = 687 * imgZoom;
            var newX2 = -343 * imgZoom;
            var newY2 = -343 * imgZoom;
            if (imgWidth > imgHeight) {
                var diffHeight2 = newHeight2 / imgHeight;
                newWidth2 = imgWidth * diffHeight;
                newX2 = -(newWidth2 - 687 * imgZoom) / 2 - 343 * imgZoom;
            } else {
                var diffWidth2 = newWidth2 / imgWidth;
                newHeight2 = imgHeight * diffWidth2;
                newY = -(newHeight2 - 687 * imgZoom) / 2 - 343 * imgZoom;
            }

            context2.save();
            context2.translate(343 + imgLeft + 197, 343 + imgTop + 198);
            context2.rotate((exifOrientation + imgRotate) * TO_RADIANS);
            context2.drawImage(img, newX2, newY2, newWidth2, newHeight2);
            context2.restore();
            var imgTheme2 = new Image();
            imgTheme2.onload = function() {
                context2.drawImage(imgTheme2, 0, 0, canvas2.width, canvas2.height);
                $('#social-editor-img2').attr('src', canvas2.toDataURL('image/jpeg'));

                dataTransfer["curIMG2"] = $('#social-editor-img2').attr('src');
            };
            imgTheme2.src = $('.share-img-to-social').data('border2');

        } else {
            alert('Необходимо ввести текст');
        }
        e.preventDefault();
    });

    $('.share-link-item-with-link').click(function(e) {
        $('.share-link').removeClass('open');
        $(this).parent().addClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.rating-item-info', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    var clipboard = new Clipboard('.copy-button');
    clipboard.on('success', function(e) {
        alert('Промо-код скопирован в буфер');
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

function windowOpen(linkWindow, dataWindow, callbackWindow) {
    var curPadding = $('.wrapper').width();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});

    if ($('.window').length == 0) {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
    }
}