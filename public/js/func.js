/**
 * Created by yuan on 2016/4/5.
 */
$('.nav-tabs li a').on('click', function () {
    var href = $(this).attr('data-href');
    console.log(href);
    $(this).parents('.tabbable').find('.tab-pane').removeClass('active');
    $(this).parents('.tabbable').find('#'+href).addClass('active');
});