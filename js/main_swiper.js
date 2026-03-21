//메인스와이퍼
var news_ajax_call_index=[];
var week_ajax_call_index=[];
var mainSwiper = {
    swiper_news         : null,
    swiper_hot          : null,
    swiper_shopping     : null,
    swiper_hot_week     : null,
    swiper_hot_month    : null,
    swiper_tubemoa      : null,

    init:  function () {

        news_ajax_call_index = [0, 1];

        var swiperNewsInitialSlide = ( $.cookie('m_main_news_menu') ) ? parseInt($.cookie('m_main_news_menu')) : 0;
        // if (typeof swiperNewsInitialSlide == 'undefined') swiperNewsInitialSlide = 0;
        var swiperNewsWeb = new Swiper('.swiper_news',{
            initialSlide: swiperNewsInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideNews();
                    this.update();
                }
            } 
        });
        mainSwiper.swiper_news = swiperNewsWeb;


        var swiperTubeMoaInitialSlide = ( $.cookie('m_main_tubemoa_menu') ) ? parseInt($.cookie('m_main_tubemoa_menu')) : 0;
        var swiperWeb = new Swiper('.swiper_tube',{
            initialSlide: swiperTubeMoaInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideTubeMoa();
                }
            } 
        });
        mainSwiper.swiper_tubemoa = swiperWeb;
        

        //swiperHotInitialSlide [_main_new_hot.html 에서 지정]
        if (typeof swiperHotInitialSlide == 'undefined') swiperHotInitialSlide = 0;
        var swiperWeb1 = new Swiper('.swiper_hot',{
            initialSlide: swiperHotInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideHot();
                }
            } 
        });
        mainSwiper.swiper_hot = swiperWeb1;

        var swiperMonthInitialSlide = ( $.cookie('main_shopping_tab') != 0 ) ? 0 : 1;
        $.cookie('main_shopping_tab', swiperMonthInitialSlide);

        var swiperWeb2 = new Swiper('.swiper_shopping',{
            initialSlide: swiperMonthInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            watchOverflow: false,
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideShopping();
                }
            } 
        });
        mainSwiper.swiper_shopping = swiperWeb2;

        var swiperWeekInitialSlide = ( $.cookie('m_main_hot_week_page') ) ? parseInt($.cookie('m_main_hot_week_page')) : 0;
        week_ajax_call_index.push(swiperWeekInitialSlide);
        var swiperWeb3 = new Swiper('.swiper_hot_week',{
            initialSlide: swiperWeekInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideHotWeek();
                }
            } 
        });
        mainSwiper.swiper_hot_week = swiperWeb3;

        var swiperMonthInitialSlide = ( $.cookie('m_main_hot_month_page') ) ? parseInt($.cookie('m_main_hot_month_page')) : 0;
        var swiperWeb4 = new Swiper('.swiper_hot_month',{
            initialSlide: swiperMonthInitialSlide, //Index number of initial slide.
            direction: "horizontal" , //Could be 'horizontal' or 'vertical'
            autoHeight: true        ,
            loop: true              ,
            touchAngle: 30          , //Allowable angle in degrees to trigger touch move
            threshold: 20           , //Threshold value in px. If "touch distance" will be lower than this value then swiper will not move
            a11y: true              , //Accessibility,
            touchMoveStopPropagation: true, //If enabled, then propagation of "touchmove" will be stopped
            on: {
                slideChangeTransitionEnd: function () {
                    mainSwiper.afterSlideHotMonth();
                }
            } 
        });
        mainSwiper.swiper_hot_month = swiperWeb4;


        $("#main_menu_hot_button li").off("click").on("click", function (e) {
            var index = $(this).index();

            if( index == 0 && $("#main_tab_pop").attr("class") == 'community-board-tab-text on' )
            {
                if( BbsListThumb.isFeedOn() ){
                    window.location.href = "/new/pop_feed.php";
                }else{
                    window.location.href = "/new/pop_bbs.php";
                }
                return;
            }else if( index == 1 && $("#main_tab_new").attr("class") == 'community-board-tab-text on' ){
                window.location.href = "/new/all_bbs.php";
                return;
            }else if( index == 2 && $("#main_tab_market").attr("class") == 'community-board-tab-text on' ){
                window.location.href = "/new/market_bbs.php";
                return;
            }

            $("#main_menu_hot_button li").removeClass("on");
            $("#main_menu_hot_button li:eq(" + index + ")").addClass('on');
            $("#main_menu_hot_button li").attr("aria-selected", "false");
            $("#main_menu_hot_button li:eq(" + index + ")").attr("aria-selected", "true");
            mainSwiper.swiper_hot.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });

        $("#news_cate_nav li").off("click").on("click", function (e) {
            if ($(this).hasClass("news-board-tab-on")) return false;

            var index = $(this).index();
            $("#news_cate_nav li").removeClass("news-board-tab-on").attr("aria-selected", "false");
            $("#news_cate_nav li:eq(" + index + ")").addClass('news-board-tab-on').attr("aria-selected", "true");
            mainSwiper.ajaxNewsCall(index);
            mainSwiper.swiper_news.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });

        $("#tube_cate_nav li").off("click").on("click", function (e) {
            if ($(this).hasClass("news-board-tab-on")) return false;

            var index = $(this).index();
            $("#tube_cate_nav li").removeClass("news-board-tab-on").attr("aria-selected", "false");
            $("#tube_cate_nav li:eq(" + index + ")").addClass('news-board-tab-on').attr("aria-selected", "true");
            mainSwiper.swiper_tubemoa.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });

        //쇼핑몰/통신업체 메뉴클릭
        $("#main_menu_shopping_button li").off("click").on("click", function (e) {
            var index = $(this).index();

            if( index == 0 && ($("#main_menu_shopping").attr("class") == 'shopping-board-tab-text on' ))
            {
                location.href = '/new/bbs_list.php?id=shopping';
            }else if( index == 1 && $("#main_menu_internet").attr("class") == 'shopping-board-tab-text on' ){
                location.href = '/new/bbs_list.php?id=pmarket3';
            } else {

                $("#main_menu_shopping_button li").removeClass("on").attr("aria-selected", "false");
                $("#main_menu_shopping_button li:eq(" + index + ")").attr("aria-selected", "true");
            }
            mainSwiper.swiper_shopping.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });

        //주간/월간 베스트 메뉴클릭
        $("#main_menu_hot_week_month_button li").off("click").on("click", function (e) {
            var index = $(this).index();

            $("#main_menu_hot_week_month_button li").removeClass("on").attr("aria-selected", "false");
            $("#main_menu_hot_week_month_button li:eq(" + index + ")").addClass('on').attr("aria-selected", "true");

            var menu_id = $(this).data('id');
            if( menu_id == 'best_time_week' )
            {
                $("#div_swiper_hot_month").hide();
                $("#div_swiper_hot_week").show();
                mainSwiper.swiper_hot_week.update();
            }else{
                $("#div_swiper_hot_month").show();
                $("#div_swiper_hot_week").hide();
                mainSwiper.swiper_hot_month.update();
            }
            $.cookie('m_main_hot_month_menu', menu_id);            
        });

        //주간 베스트 페이징클릭
        $("#swiper_hot_week_page li").off("click").on("click", function (e) {
            var index = $(this).index();
            // $.cookie('m_main_hot_week_page', index);
            mainSwiper.swiper_hot_week.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });
        //월간 베스트 페이징클릭        
        $("#swiper_hot_month_page li").off("click").on("click", function (e) {
            var index = $(this).index();
            // $.cookie('m_main_hot_month_page', index);            
            mainSwiper.swiper_hot_month.slideTo(index + 1, 0); //slideTo(index,speed,callback)
        });        

        //더보기
        $('.shopping-board-more.swiper_shopping_more').click(function() {
            mainSwiper.shopping_more_show(); //WEB-6920 요청사항으로 통합
            mainSwiper.swiper_shopping.slideTo(1, 0);
            // $('#swiper_shopping-swiper-wrapper').css('height','auto');
        });

        //더보기        
        $('.shopping-board-more.swiper_internet_more').click(function() {
            mainSwiper.shopping_more_show(); //WEB-6920 요청사항으로 통합
            mainSwiper.swiper_shopping.slideTo(2, 0);
            // mainSwiper.swiper_shopping.slideTo(2, 0); //slideTo(index,speed,callback)
            // $('#swiper_shopping-swiper-wrapper').css('height','auto');
        });
    },

    initSlideNewHot: function () {
        $.each($('#div_main_new_hot #mainList'), function (i, item) {
            $(item).css("display",'block');
        });
    },

    initSlideHotWeekMonth: function () {
        var week_page_cnt  = $('#swiper_hot_week_page').data('page_cnt');
        
        $.each($('#swiper_hot_week_page li'), function (i, item) {
            if( i < week_page_cnt ) $(item).show();
        });

        $.each($('#div_main_new_hot #mainList'), function (i, item) {
            var hot_week_month_menu_no = 0;
            $("#main_menu_hot_week_month_button li:eq(" + hot_week_month_menu_no + ")").click();
        });
    },

    afterSlideNews: function () {
        var index  = parseInt($(".swiper_news .swiper-slide-active").attr("data-swiper-slide-index"));

        $("#news_cate_nav li").removeClass("news-board-tab-on").attr("aria-selected", "false");
        $("#news_cate_nav li:eq(" + index + ")").addClass('news-board-tab-on').attr("aria-selected", "true");

        //뒤로가기에서는 필스로 먼저 적용
        this.ajaxNewsCall(index);        

        $.each($(".swiper_news .swiper-slide-active .news-board-gellery-img"), function (i, item) {
            $(item).css('background-image', 'url('+$(item).data('src')+')');
        });
        
        if( $("#news_cate_nav").width() < $("#news_cate_nav")[0].scrollWidth )
        {
            var _scrollX = ( index >= 4 ) ? $("#news_cate_nav")[0].scrollWidth - $("#news_cate_nav").width() : 0;
            $("#news_cate_nav").animate({"scrollLeft":_scrollX}, 500);
        }
        // $.cookie('m_main_news_menu', 0); //초기화
    },

    ajaxNewsCall: function(index){
        var tab_ids= ['today_issue', 'all', 'news_broadcast','news_sports', 'news_pol_eco','news_economy','news_society','news_culture','news_life','news_travel','news2'];

        if( !news_ajax_call_index.includes(index) || ! news_ajax_call_index.includes(index+1) ){

            var call_index = index + 1;
            if     ( ! news_ajax_call_index.includes(index)  ) call_index = index;
            else if( ! news_ajax_call_index.includes(index+1)) call_index = index+1;
            else return false;

            if( tab_ids.length <= call_index ) return false;

            // console.log('$("#main_news_'+tab_ids[index+1]+'").html()');
            // $("#main_news_"+tab_ids[index+1]).load("/new/ajax/_ajax_main_news_tab.php?tab_id="+tab_ids[index+1]);
            $.ajax({
                "url":"/new/ajax/_ajax_main_news_tab.php",
                "type":"post",
                "async":false,
                "data":{"tab_id":tab_ids[call_index]},
                "dataType":"html",
            }).done(function(res){
                var $res = $(res);
                $(".js-main_news_"+tab_ids[call_index]).find(".news-board-gellery").html(
                    $res.find(".news-board-gellery").html() 
                );
                $(".js-main_news_"+tab_ids[call_index]).find(".news-board-list").html(
                    $res.find(".news-board-list").html() 
                );
                news_ajax_call_index.push(call_index);
                if( ! news_ajax_call_index.includes(index+1) && tab_ids.length < index ) mainSwiper.ajaxNewsCall(index+1);
            });
        }
    },

    ajaxHotWeekCall: function(index){

        if( !week_ajax_call_index.includes(parseInt(index)) ){
            $.ajax({
                "url":"/new/ajax/_ajax_main_hot_week_tab.php",
                "type":"post",
                "async":false,
                "data":{"print_page":index},
                "dataType":"html",
            }).done(function(res){
                var $res = $(res);
                $(".js-week_"+index).html(
                    $res.eq(index).html()
                );

                week_ajax_call_index.push(parseInt(index));
            });
        }
    },

    afterSlideTubeMoa: function () {

        var index = $(".swiper_tube .swiper-slide-active").attr("data-swiper-slide-index");

        $("#tube_cate_nav li").removeClass("news-board-tab-on").attr("aria-selected", "false");
        $("#tube_cate_nav li:eq(" + index + ")").addClass('news-board-tab-on').attr("aria-selected", "true");

        $.each($(".swiper_tube .swiper-slide-active .news-board-gellery-img"), function (i, item) {
            $(item).css('background-image', 'url('+$(item).data('src')+')');
        });
        
        if( $("#tube_cate_nav").width() < $("#tube_cate_nav")[0].scrollWidth )
        {
            var _scrollX = ( index >= 5 ) ? $("#tube_cate_nav")[0].scrollWidth - $("#tube_cate_nav").width() : 0;
            $("#tube_cate_nav").animate({"scrollLeft":_scrollX}, 500);
        }

        $.cookie('m_main_tubemoa_menu', 0); //초기화
    },

    afterSlideHot: function () {
        var index = $(".swiper_hot .swiper-slide-active").attr("data-swiper-slide-index");

        let appType = getAppType();

        if( G_IS_NAVER_APP_AD_OPEN && (appType == 'Android' || appType == 'iOS') ){
            if(! $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html() ){
                let type     = ( index == 0 ) ? 'main_hot' : 'main_new';

                var comment_google_ad05_html = '<center><iframe id="if_ad0005" src="/banner/naver_apsspads.html?type='+type+'" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" width="320px" height="70px"></iframe></center>';
                if(! $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html() ) $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html(comment_google_ad05_html);

                
                // let nm     = ( index == 0 ) ? 'hot' : 'new';
                // let div_id = "div-apsspads_" + appType.toLowerCase() + "_main_" + nm;
                // let html   = "<center><div id='"+div_id+"'></div></center>";
                // $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html(html);
                
                // if ( typeof ApsspAdsOpenDivList != "undefined" && ApsspAdsOpenDivList.includes(div_id) === false ){
                //     if (window.apsspads && apsspads.isReady) {
                //         ApsspAdsNam.ApsspAdsView([div_id]);
                //     }                    
                // }
            }
        }else{
            if( $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").length > 0 ){
                var comment_google_ad05_html = '<center><iframe id="if_ad0005" src="/banner/google_ad.html?pos=2005&gb=first" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" style="width:336px;height:280px;"></iframe></center>';
                // var comment_google_ad05_html = '<center><iframe id="if_ad0005" src="/banner/google_ad.html?pos=2005&gb=first" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" width="320px" height="100px"></iframe></center>';                
                if(! $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html() ) $(".swiper_hot .swiper-slide-active #main_bbs_list_ad").html(comment_google_ad05_html);
            }
        }


        $("#main_menu_hot_button li").removeClass("on");
        $("#main_menu_hot_button li:eq(" + index + ")").addClass("on").attr("aria-selected", "true");

        switch(index)
        {
            case '0' : $.cookie('m_main_new_menu', 'pop_bbs');     break;
            case '1' : $.cookie('m_main_new_menu', 'new');         break;
            case '2' : $.cookie('m_main_new_menu', 'market');      break;
            case '3' : $.cookie('m_main_new_menu', 'hot_comment'); break;
        }
    },

    afterSlideShopping: function () {
        var index = $(".swiper_shopping .swiper-slide-active").attr("data-swiper-slide-index");

        if( index == 0 )
        {
            $("#main_menu_internet").removeClass('on');
            $("#main_menu_shopping").addClass('on');
        }else{
            $("#main_menu_shopping").removeClass('on');
            $("#main_menu_internet").addClass('on');
        }
    },

    changeSlideHotWeek: function () {
        var index = $(".swiper_hot_week .swiper-slide-active").attr("data-swiper-slide-index");
        this.ajaxHotWeekCall(index);
    },

    afterSlideHotWeek: function () {
        var index = $(".swiper_hot_week .swiper-slide-active").attr("data-swiper-slide-index");
        this.ajaxHotWeekCall(index);
        $("#swiper_hot_week_page li").find('button').removeClass('on');
        $("#swiper_hot_week_page li:eq("+index+")").find('button').addClass('on');

        $.each($(".swiper_hot_week .swiper-slide-active .best-board-img"), function (i, item) {
            $(item).css('background-image', 'url('+$(item).data('src')+')');
        });
        $.cookie('m_main_hot_week_page', index);
    },

    afterSlideHotMonth: function () {
        var index = $(".swiper_hot_month .swiper-slide-active").attr("data-swiper-slide-index");
        $("#swiper_hot_month_page li").find('button').removeClass('on');
        $("#swiper_hot_month_page li:eq("+index+")").find('button').addClass('on');

        $.each($(".swiper_hot_month .swiper-slide-active .best-board-img"), function (i, item) {
            $(item).css('background-image', 'url('+$(item).data('src')+')');
        });
        $.cookie('m_main_hot_month_page', index);        
    },

    shopping_more_show: function () {
        $('.shopping-board-more.swiper_internet_more').hide();
        $('.shopping-board-more.swiper_shopping_more').hide();

        var li_cnt = $('#main_shopping_list > li').size();
        $('#main_shopping_list > li').each( function(i) {
            $(this).show();
            $(this).removeClass("none-boder");

            if( li_cnt == (i+1) || (li_cnt/2) == (i+1) ){
                $(this).addClass("none-boder");
            }                     
        });
        
        var li_cnt = $('#main_internet_list > li').size();
        $('#main_internet_list > li').each( function(i) {
            if( $(this).css("display") == 'none' ){
                $(this).show();
            }
            $(this).removeClass("none-boder");                
            if( li_cnt == (i+1) || (li_cnt/2) == (i+1) ){
                $(this).addClass("none-boder");
            } 
        });
    },
};

/* News Today Issue START */
var NewsTodayIssue = new class {
    constructor(){
        this.isCall = false;
    }

    except(bbsId, bbsNo){
        if( this.isCall ) return false;
        if( !confirm('기사를 비노출 하겠습니까?') ) return false;
        this.isCall = true;

        $.ajax({
            "url":"/ajax/ajax_news_today_issue.php",
            "data":{"bbs_id":bbsId, "bbs_no":bbsNo},
            "type":"post",
            "dataType":"json",
            "context":this,
        }).done(function(res){
            if( res.code == 'OK' ){
                alert(res.msg);
            }else if( res.code == 'ERR' ){
                alert(res.msg);
            }else{
                console.error(res);
            }
        }).fail(function(err){
            console.error(err);
        }).always(function(){
            this.isCall = false;
        });

        return false;
    }
};

$(document).on('touchstart', '#main_news_today_issue .cate-keyword', function(e){
    mainSwiper.swiper_news.detachEvents()
}).on('touchend', '#main_news_today_issue .cate-keyword', function(e){
    mainSwiper.swiper_news.attachEvents()
});
/* News Today Issue END */

//-------------------------------------------------------------------
// NEWS 
//-------------------------------------------------------------------
$(document).ready(function(){
    var m_main_news_menu = ( $.cookie('m_main_news_menu') != 0 ) ? 0 : 1;
    $.cookie('m_main_news_menu', m_main_news_menu);
});
//-------------------------------------------------------------------

//-------------------------------------------------------------------
// 인기 더보기
//-------------------------------------------------------------------
$(document).on("click", "#id_main-board-more", function(e) {
    let url = $(this).attr("href");

    // 빈 링크 또는 javascript 링크는 무시
    if (!url || url.startsWith("javascript:") || url === "#") return;

    if (url.includes("/new/pop_bbs.php?page=2") && BbsListThumb.isFeedOn() ) {
        e.preventDefault(); // 원래 이동 막기

        let newUrl = url.replace("/new/pop_bbs.php?page=2", "/new/pop_feed.php?page=2");
        location.href = newUrl;
    }
});
//-------------------------------------------------------------------