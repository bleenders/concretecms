// Import the frontend foundation for themes.
import '@concretecms/bedrock/assets/bedrock/js/frontend';

// Import the CMS foundation in order to support editing, toolbar, panel functionality
import '@concretecms/bedrock/assets/cms/js/base';

// My Account
import '@concretecms/bedrock/assets/account/js/frontend';

// Calendar
import '@concretecms/bedrock/assets/calendar/js/backend';

// Other
import './jquery-bootstrap-select-to-button';
import './translator';
import './remote-marketplace';

var setupResultMessages = function() {
    if ($('#ccm-dashboard-result-message').length > 0) {
        if ($('.ccm-pane').length > 0) {
            var pclass = $('.ccm-pane').parent().attr('class');
            var gpclass = $('.ccm-pane').parent().parent().attr('class');
            var html = $('#ccm-dashboard-result-message').html();
            $('#ccm-dashboard-result-message').html('<div class="' + gpclass + '"><div class="' + pclass + '">' + html + '</div></div>').fadeIn(400);
        }
    } else {
        $("#ccm-dashboard-result-message").fadeIn(200);
    }
};

var setupFavorites = function() {
    var $addFavorite = $('a[data-bookmark-action=add-favorite]'),
        $removeFavorite = $('a[data-bookmark-action=remove-favorite]'),
        url = false,
        $link;

    if ($addFavorite.length) {
        url = CCM_DISPATCHER_FILENAME + '/ccm/system/panels/dashboard/add_favorite';
        $link = $addFavorite;
    } else if ($removeFavorite.length) {
        url = CCM_DISPATCHER_FILENAME + '/ccm/system/panels/dashboard/remove_favorite';
        $link = $removeFavorite;
    }

    if (url) {
        $link.on('click', function(e) {
            e.preventDefault();
            $.concreteAjax({
                dataType: 'json',
                type: 'GET',
                data: {'cID': $(this).attr('data-page-id'), 'ccm_token': $(this).attr('data-token')},
                url: url,
                success: function(r) {
                    if (r.action == 'remove') {
                        $link.attr('data-bookmark-action', 'add-favorite');
                        $link.find('.icon-bookmark').removeClass('bookmarked');
                    } else {
                        $link.attr('data-bookmark-action', 'remove-favorite');
                        $link.find('.icon-bookmark').addClass('bookmarked');
                    }
                    $link.off('click');
                    setupFavorites();
                }
            });
        });
    }
};

var setupDetailsURLs = function() {
    $('tr[data-details-url]').each(function() {
        $(this).hover(
            function() {
                $(this).addClass('ccm-search-select-hover');
            },
            function() {
                $(this).removeClass('ccm-search-select-hover');
            }
        )
            .on('click', function(e) {
                if ($(e.target).is('td')) {
                    window.location.href = $(this).data('details-url');
                }
            });
    });
    $('div.ccm-details-panel[data-details-url]').each(function() {
        $(this)
            .on('click', function() {
                window.location.href = $(this).data('details-url');
            });
    });
};

var setupTooltips = function() {
    if ($("#ccm-tooltip-holder").length == 0) {
        $('<div />').attr('id','ccm-tooltip-holder').attr('class', 'ccm-ui').prependTo(document.body);
    }
    $('.launch-tooltip').tooltip({'container': '#ccm-tooltip-holder'});
};

var setupDialogs = function() {
    $('.dialog-launch').dialog();

    $('div#ccm-dashboard-page').on('click', '[data-dialog]', function() {
        if ($(this).attr('disabled')) {
            return false;
        }

        var width = $(this).attr('data-dialog-width');
        if (!width) {
            width = 320;
        }
        var height = $(this).attr('data-dialog-height');
        if (!height) {
            height = 'auto';
        }
        var title;
        if ($(this).attr('data-dialog-title')) {
            title = $(this).attr('data-dialog-title');
        } else {
            title = $(this).text();
        }
        var element = 'div[data-dialog-wrapper=' + $(this).attr('data-dialog') + ']';
        jQuery.fn.dialog.open({
            element: element,
            modal: true,
            width: width,
            title: title,
            height: height
        });
    });

};

var setupPrivacyPolicy = function() {

    $('div#ccm-dashboard-page').on('click', 'button[data-action=agree-privacy-policy]', function() {
        $('div.ccm-dashboard-privacy-policy').hide();
        var url = CCM_DISPATCHER_FILENAME + '/ccm/system/accept_privacy_policy';
        $.concreteAjax({
            dataType: 'json',
            data: {'ccm_token': $(this).attr('data-token')},
            type: 'POST',
            url: url,
            success: function(r) {

            }
        });
    });
};

var setupHeaderMenu = function() {
    var $buttons = $('.ccm-dashboard-header-buttons'),
        $menu = $('header div.ccm-dashboard-header-menu');
    if ($buttons.length) {
        if ($buttons.parent().get(0).nodeName.toLowerCase() == 'form') {
            $menu.append($buttons.parent());
        } else {
            $menu.append($buttons);
        }
    }
};

var setupSiteListMenuItem = function() {
    $('select[data-select=ccm-header-site-list]').show().selectize({
        'onItemAdd': function(option) {
            window.location.href = option;
        }
    });
};

var setupSelects = function() {
    $('select[data-select=bootstrap]').bootstrapSelectToButton();
};

setupTooltips();
setupResultMessages();
setupSiteListMenuItem();
setupDialogs();
setupSelects();
setupDetailsURLs();
setupFavorites();
setupHeaderMenu();
setupPrivacyPolicy();
