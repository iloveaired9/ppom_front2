var is_side_menu_load = false;
$(document).ready( function () {

    // $("#div_side_menu").click(function () { 
    $(document).on('click', '#div_side_menu', function(e) {

        if(is_ppomppu_app_version("ios","1.2.8") || is_ppomppu_app_version("android","2.1.3")){
            app_open_left_menu();
            return;
        }

        if( is_side_menu_load === false ){
            $('#side-menu').load('/new/_ajax_side_menu.php', function() {
                side_menu_open_click();
                is_side_menu_load = true;
            });
        }else{
            side_menu_open_click();
        }
    }); 

    $(document).on('keydown', '#keyword_side', function(e) {
        if (e.key === "Enter"){
            $( "#id-search-bar-icon-search_side" ).click();
        }
    });

    $(document).on('keydown', '#side_search_board_favorite_etc,#side_search_board_favorite_forum,#side_search_board_favorite_forum_unoff', function(e) {
        if (e.key === "Enter"){
            $(this).find('#id-search-bar-icon-search').trigger('click');
        }
    });

    // $("#side_menu_close").click(function () { 
    $('#side-menu').on('click', '#side_menu_close', function(){
        // 저장버튼 노출X
        $("#side_menu_save").css('display','none');

        $("#side-menu,html,#side-menu_back").removeClass("open"); // open 클래스를 지워 원래대로 돌린다.        

        history.back();
    });

    $('#side-menu').on('click', '#side_menu_write', function(){
        s_url = $(this).attr("s_url");
        login_url = $(this).attr("login_url");
        write_url = $(this).attr("write_url");

        if($(this).attr("is_login") == "true"){
            location.href=write_url;
        } else {
            if(!confirm('로그인 이후에 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?') ){
                return false;
            }

            location.href=login_url + s_url;
        }
    });

    //즐겨찾기 링크설정
    $('#side-menu').on('click', '#side_favorite_forum li a,#side_favorite_forum_unoff li a,#side_favorite_etc li a', function(){
        var is_del_mode = $(this).parents('li').find('.side_forum-favorite-delbtn').is(':visible');
        if( is_del_mode ){ 
            $(this).parents('li').find('.side_forum-favorite-delbtn').trigger('click');
        }else{
            document.location.href = $(this).data('href');
            return false;
        }
	});

    //즐겨찾기 위아래 선택
    $('#side-menu').on('click', '.side_bbs_menu_view_top_down', function(){        
        var stat  = $(this).data('state');
        var ul_id = $(this).data('ul_id');

        if( stat == 'on' ){
            $("#"+ul_id).hide();
            $(this).css({"background":"url(asset/images/common/bullet_arrow2.gif)no-repeat right"});
            $(this).data('state','off');
        }else{
            $("#"+ul_id).show();
            $(this).css({"background":"url(asset/images/common/bullet_arrow3.gif)no-repeat right"});            
            $(this).data('state','on');
        }
    });


    //즐겨찾기 삭제버튼 클릭
    $('#side-menu').on('click', '.side_forum-favorite-delbtn', function(){
        side_del_favorite(this);
        return false;
    });


    //즐겨찾기 추가버튼 클릭
    $('#side-menu').on('click', '.side_forum-favorite-addbtn', function(){
        if( $(this).hasClass('active') == true ){
            var bbs_id = $(this).data('id');
            $('.side_forum-favorite-delbtn').each(function(){
                if( $(this).data('id') == bbs_id ) return side_del_favorite(this);
            });
        }else{
            side_add_favorite(this);
        }

        return false;
    });
       
    //즐겨찾기 편집/취소 버튼 클릭
    $('#side-menu').on('click', '.side_forum-favorite-editbtn', function(){        

        var type = $(this).data('type');

        if( $(this).text() == '편집' ){

            //즐겨찾기 폼 선택 ( 포럼외 / 포럼 )
            if( type == 'favorite_etc' ) {
                $('#div_side_favorite_etc_form').show();
                $('#div_side_favorite_forum_form').hide();
                $('#div_side_favorite_forum_unoff_form').hide();
            }else if( type == 'favorite_forum_unoff' ){
            	$('#div_side_favorite_etc_form').hide();
                $('#div_side_favorite_forum_form').hide();
                $('#div_side_favorite_forum_unoff_form').show();
            }else{
                $('#div_side_favorite_etc_form').hide();
                $('#div_side_favorite_forum_form').show();
                $('#div_side_favorite_forum_unoff_form').hide();
            }

            $('.side_forum-favorite-delbtn.side_delbtn_'+type).show();  //즐겨찾기 삭제이미지 보이기
            $('#side_menu_save').show();                                //즐겨찾기 저장 보이기
            $(this).text( '취소' );                                     //편집 버튼 취소버튼으로 텍스트변경

            $('#side_search_board_'+type).show();                       //즐겨찾기 검색 보이기
            
            $("#side_favorite_forum_none").css("margin-bottom", "0px");

            var html = get_side_drawing_bbs_list_html( type, '' );      //즐겨찾기 보이기
            $('#div_bbslist_'+type).html(html);
            side_favorite_stat_img();                                   

        }else{
            $('#div_side_favorite_etc_form').show();
            $('#div_side_favorite_forum_form').show();
            $('#div_side_favorite_forum_unoff_form').show();

            $('.side_forum-favorite-delbtn.side_delbtn_'+type).hide();
            $('#side_menu_save').hide();
            $('#side_search_board_'+type).hide();
            $('#side_search_board_'+type+'_txt').hide();

            $(this).text( '편집' );
            $('#div_bbslist_'+type).html('');

            side_favorite_forum = get_side_favorite('favorite_forum');  //쿠키데이터로 초기화
            side_favorite_etc   = get_side_favorite('favorite_etc');    //쿠키데이터로 초기화
            
            side_drawing_favorite(type);
            // drawing_favorite_forum();
            
            // WEB-6246 rollback
            //$("#side_favorite_forum_none").css("margin-bottom", "200px");
            //$(".recent-visit").css("margin-bottom", "200px");
        }
    });

    // 즐겨찾기 저장버튼 클릭
    $('#side-menu').on('click', '#side_favorite-savebtn', function(){
        // 게시판리스트 노출x        
        $('#div_bbslist_favorite_etc').html('');            //초기화
        $('#div_bbslist_favorite_forum').html('');          //초기화
        $('#div_bbslist_favorite_forum_unoff').html('');          //초기화

        // 검색창 노출x
        $('#side_search_board_favorite_etc').hide();
        $('#side_search_board_favorite_etc_txt').hide();
        $('#side_search_board_favorite_forum').hide();
        $('#side_search_board_favorite_forum_txt').hide();
        $('#side_search_board_favorite_forum_unoff').hide();
        $('#side_search_board_favorite_forum_txt_unoff').hide();

        // 편집버튼 초기화
        $('.side_forum-favorite-editbtn').eq(0).text( '편집' );
        $('.side_forum-favorite-editbtn').eq(1).text( '편집' );
        $('.side_forum-favorite-editbtn').eq(2).text( '편집' );

        // 저장버튼 노출X
        $("#side_menu_save").css('display','none');

        // 데이터 저장
        set_side_favorite('favorite_forum');       // 공식포럼 데이터저장
        set_side_favorite('favorite_forum_unoff'); // 비공식포럼 데이터저장
        set_side_favorite('favorite_etc');         // 포럼외 데이터저장

        // 즐겨찾기 설정
        side_drawing_favorite('favorite_forum');
        side_drawing_favorite('favorite_forum_unoff');
        side_drawing_favorite('favorite_etc');

        // 폼 전체 보이기
        $('#div_side_favorite_etc_form').show();
        $('#div_side_favorite_forum_form').show();
        $('#div_side_favorite_forum_unoff_form').show();
    });

    // 즐겨찾기 검색버튼 클릭
    $('#side-menu').on('click', '.search-bar-icon-search.side_icon_search', function(){
        var type    = $(this).data('type');
        var keyword = $('#side_search_keyword_'+type).val();

        if( keyword == '' )
        {
            alert('키워드를 입력하세요.');
            return;
        }
        $('#div_bbslist_'+type).html('');

        var html = get_side_drawing_bbs_list_html( type, keyword );
        $('#div_bbslist_'+type).html(html);
        side_favorite_stat_img();

        // var keyword = $('#side_search_keyword_'+type).val('');
        
        $('#side_search_board_'+type).hide();
        $('#side_search_board_'+type+'_txt').show();
        var search_html = keyword + '<img class="xbt" onClick="set_side_search_return(\''+type+'\')" src="/images/x_btn.svg" alt="x버튼">';
        $('#side_search_board_'+type+'_txt .keywords').html(search_html);
        $('#side_search_keyword_'+type).val('');    //검색후 초기화
    });


    // 즐겨찾기 / 최근방문  버튼 클릭시  
    $('#side-menu').on('click', '.recent-visit-title', function(){
        $(".recent-visit-title").removeClass('on');
        $(this).addClass('on');

        if( $(this).data('type') == 'favorite' )
        {
            if( ! side_bbs_info ) set_side_menu_bbs_info();
            side_drawing_favorite('favorite_forum');
            side_drawing_favorite('favorite_forum_unoff');
            side_drawing_favorite('favorite_etc');

            $("#div_side_menu_visit").hide();
            $("#div_side_menu_favorite").show();
            $.cookie('side_menu_type', 'favorite', { expires: 365 });
            $(".recent-visit").css("margin-bottom", "0");
        }else if( $(this).data('type') == 'visit' ){
            $("#div_side_menu_visit").show();
            $("#div_side_menu_favorite").hide();
            $("#side_menu_save").css('display','none');
            $.cookie('side_menu_type', 'visit', { expires: 365 });
            
            // WEB-6246 rollback
            //if ( $(".recent-visit-list").length == 0 ) $(".recent-visit").css("margin-bottom", "200px");
        }else{
            location.href="/new/bookmark_list.php";
        }
    });

    if( app_open_setting_check() )
    {
        $("#app_open_setting_button").show();
        $(".write_iconbox").addClass("write_app");
    }else{
        $("#app_open_setting_button").hide();
    }

    $('#side-menu').on('click', '#app_open_setting_button', function(){    
        app_open_setting();
    });

    $('#side-menu').on('click', '#search-bar-icon-keyword_side', function(){
        show_keyword_side_menu();
    });

    $('#side-menu').on('click', '#id-search-bar-icon-search_side', function(){
        var side_keyword = $("#keyword_side").val();
        $("#search_all [name='keyword']").val(side_keyword);
        $("#search_all").submit();
    });

    $('#side-menu').on('click', "[name='visit_delete_icon']", function(){    
        var id = $(this).parents('li').data('bbs_id');
        if( id.length < 2 ) return;

        //삭제대상으로 변경
        $(this).parents('li').data('delete', 'true');

        //최근방문기록 삭제
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/new/_ajax_visit_board.php",
            data: "id="+id,
            success: function(data) {
                if(data.status == true){
                    //삭제처리
                    side_visit_list_delete();
                }
                return;
            }
        });
    });    
    
    // WEB-6246 rollback
    //$("#side_favorite_forum_none").css("margin-bottom", "200px");
});

function is_ppomppu_app_version($os, $version,$mode){
    if(["ios","android"].indexOf($os.toLowerCase()) == -1){
        return false;
    }

    if(!$mode){
        $mode = "upper";
    }

    $version = $version.split(".").join("");

    if(!$.isNumeric($version)){
        return false;
    }

    var agent = navigator.userAgent;

    $agent_ver = null;

    if($os == "android" && agent.indexOf("android") == -1 ){
        return false;
    }
    if($os == "ios" && agent.indexOf("ios") == -1 ){
        return false;
    }

    if(agent.indexOf("PPOMBrowser") != -1){
        //$agent_ver = explode("PPOMBrowser/",$_SERVER['HTTP_USER_AGENT']);
        //$agent_ver = explode(" ", $agent_ver[1]);
        //$agent_ver = $agent_ver[0];
        //$agent_ver = str_replace(".","",$agent_ver);

        $agent_ver = agent.split("PPOMBrowser/");
        $agent_ver = $agent_ver[1].split(" ");
        $agent_ver = $agent_ver[0];
        $agent_ver = $agent_ver.split(".").join("");
    } else {
        return false;
    }

    if($agent_ver == ""){
        return false;
    }
    if(!$.isNumeric($agent_ver)){
        return false;
    }

    switch($mode){
        case "upper":
            if($version <= $agent_ver){
                return true;
            }
            break;
        case "lower":
            if($version >= $agent_ver){
                return true;
            }
            break;
        case "same":
            if($version == $agent_ver){
                return true;
            }
            break;
    }

    return false;
}


function set_side_search_return( type )
{
    var html = get_side_drawing_bbs_list_html( type, '' );
    $('#div_bbslist_'+type).html(html);
    side_favorite_stat_img();
    $('#side_search_keyword_'+type).val('');
    $('#side_search_board_'+type+'_txt .keywords').html('');
    $('#side_search_board_'+type+'_txt').hide();
    $('#side_search_board_'+type).show();
}

var side_bbs_info = null;
function set_side_menu_bbs_info()
{
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/new/_ajax_menu_list.php",
        data: "",
        async : false,      //여기서만 사용 기본은 true
        success: function(data) {
            if(data) side_bbs_info = data;            
            return;
        }
    });
}

function get_side_favorite( key )
{
    if( localStorageAvailable() ){
        var str_data = window.localStorage.getItem(key) || '';
        // 기존 데이타 보존을 위해서
        if( !str_data ){
            var str_data = get_cookie(key) || '';
        }
    }else{
        var str_data = get_cookie(key) || '';
    }

    var arr_data = str_data ? str_data.split('|') : [];

    return arr_data;
}

var side_favorite_forum 		= get_side_favorite('favorite_forum');
var side_favorite_etc   		= get_side_favorite('favorite_etc');
var side_favorite_forum_unoff 	= get_side_favorite('favorite_forum_unoff');


/* unofficial forum issue */
for( var i = 0; i < side_favorite_forum_unoff.length; i++ ){
	side_favorite_forum.push(side_favorite_forum_unoff[i]);
}

side_favorite_forum = side_favorite_forum.filter(function(value, index, self){
    return self.indexOf(value) === index;
});

side_favorite_forum_unoff = [];
set_side_favorite('favorite_forum');
/* end of unofficial forum issue */


function set_side_favorite( key )
{
    if( key == 'favorite_forum' )
        var str_data = side_favorite_forum.join('|');
    else if( key == 'favorite_forum_unoff' )
    	var str_data = side_favorite_forum.join('|');
    else 
        var str_data = side_favorite_etc.join('|');

    if( localStorageAvailable() ){
        window.localStorage.setItem(key, str_data);
        set_cookie(key, ''); // 쿠키 -> 로컬스토리지 이관을 위해서
    }else{
        set_cookie(key, str_data, 9999);
    }
}


// del favorite
function side_del_favorite(el)
{
    var $el    = $(el);
    var bbs_id = $el.data('id');
    var type   = $el.data('type');

    if ( type == 'favorite_forum' )
    {
        side_favorite_forum = side_favorite_forum.filter(function(value, index){
            return value != bbs_id;
        });
    } else if ( type == 'favorite_forum_unoff' ) {
		side_favorite_forum = side_favorite_forum.filter(function(value, index){
			return value != bbs_id;
		});
	
    } else {
        side_favorite_etc = side_favorite_etc.filter(function(value, index){
            return value != bbs_id;
        });
    }

    $el.parents('li').remove();
    side_make_favorite_even('side_'+type);

    side_favorite_stat_img();

}

function side_add_favorite(el)
{
    var $el      = $(el);
    var bbs_id   = $el.data('id');
    var bbs_name = $el.data('bbsname');
    var type     = $el.data('type');

    if ( type == 'favorite_forum' )
    {
        for( var i = 0; i < side_favorite_forum.length; i++ ){
            if( side_favorite_forum[i] == bbs_id ){
                return false;
            }
        }
        side_favorite_forum.push(bbs_id);
        side_favorite_forum = side_favorite_forum.filter(function(value, index, self){
            return self.indexOf(value) === index;
        });
    } else if ( type == 'favorite_forum_unoff' ) {
        for( var i = 0; i < side_favorite_forum.length; i++ ){
            if( side_favorite_forum[i] == bbs_id ){
                return false;
            }
        }
        side_favorite_forum.push(bbs_id);
        side_favorite_forum = side_favorite_forum.filter(function(value, index, self){
            return self.indexOf(value) === index;
        });
        
    }else{
        for( var i = 0; i < side_favorite_etc.length; i++ ){
            if( side_favorite_etc[i] == bbs_id ){
                return false;
            }
        }
        side_favorite_etc.push(bbs_id);
        side_favorite_etc = side_favorite_etc.filter(function(value, index, self){
            return self.indexOf(value) === index;
        });
    }

    // change img 'plus.svg' -> 'check.svg' & addclass 'active'
    $el.find('.checkBt').find('img').attr('src', '/images/check.svg');
    $el.addClass('active');

    // remove empty li
    // if( !$('#forum_favorite li:last-child').html() ){
    //     $('#forum_favorite li:last-child').remove();
    // }

    side_drawing_favorite(type);    
    $('.side_forum-favorite-delbtn.side_delbtn_'+type).show();
    side_make_favorite_even('side_'+type);
}


function side_favorite_stat_img()
{
    $('.side_forum-favorite-addbtn').each(function(){
        var bbs_id = $(this).data('id');       
        
        // not exists
        if( side_favorite_forum.indexOf(bbs_id) === -1 && side_favorite_etc.indexOf(bbs_id) === -1 ){
            $(this).find('.checkBt').find('img').attr('src', '/images/plus.svg');
            $(this).removeClass('active');
        }else{
            $(this).find('.checkBt').find('img').attr('src', '/images/check.svg');
            $(this).addClass('active');
        }
    });
}

function get_side_drawing_favorite_html( bbs_info, type )
{
    var html    = '';
    var row_cnt = 0;
        
    if ( type == 'favorite_forum' ) 			data = side_favorite_forum;
    else if ( type == 'favorite_forum_unoff' ) 	data = side_favorite_forum;
    else 										data = side_favorite_etc;

    for( var i = 0; i < data.length; i++ ){
        var bbs_id = data[i];
        $.each( bbs_info, function(k, v){
            $.each(v.list , function(index, tmp_bbs ){
                if( bbs_id == tmp_bbs.id )
                {
                    html +=  '<li><a data-href="/new/bbs_list.php?id='+bbs_id+'">'+tmp_bbs.name+'</a><span data-id="'+bbs_id+'" data-type="'+type+'" class="checkBt side_forum-favorite-delbtn side_delbtn_'+type+'" style="display:none"><img src="/images/minus.svg" alt="아이콘"></span></li>';
                    row_cnt++;
                } 
            });
        });
    }
    if( row_cnt % 2 == 1 ) html += '<li></li>';

    return html;
}

function side_drawing_favorite( type )
{
    $('#side_'+type).html('');

    if( type == 'favorite_forum' ){
        var html = get_side_drawing_favorite_html( side_bbs_info.forum, type );        
    } else if( type == 'favorite_forum_unoff' ){
    	var html = get_side_drawing_favorite_html( side_bbs_info.forum_unoff, type );
    }else{
        var html = get_side_drawing_favorite_html( side_bbs_info.etc, type );
    }
    $('#side_'+type).append(html);
    side_make_favorite_even('side_'+type);    
}

// make odd to even
function side_make_favorite_even( name )
{
    if( $('#'+name+' li').length % 2 == 1 ){
        if( !$('#'+name+' li:last-child').html() ){
            $('#'+name+' li:last-child').remove();
        }else{
            $('#'+name).append('<li></li>');
        }
    }

    if( $('#'+name+' li').length <= 0 ){
        $('#'+name+'_none').show();
    }else{
        $('#'+name+'_none').hide();
    }
}




function get_side_drawing_bbs_list_html( type, search )
{
    var html    = '';
    var row_cnt = 0;
    var data     = new Array();

    if ( type == 'favorite_forum' ) 			bbs_info = side_bbs_info.forum ;
    else if ( type == 'favorite_forum_unoff' ) 	bbs_info = side_bbs_info.forum_unoff ;
    else 										bbs_info = side_bbs_info.etc ;    

    var tmp_bbs_info = new Array();
    // search = '게시판';
    if( search )
    {
        $.each( bbs_info, function(k, v){ 
            var tmp_data = new Array();
            tmp_data = v.list.filter(function(value, index){
                return value.name.indexOf(search) !== -1;
            });

            if( tmp_data.length > 0 )
            {
                var tmp_info = new Array();
                tmp_info.title = v.title;
                tmp_info.list  = tmp_data;
                data.push(tmp_info);
            } 
        });

    }else{
        data = bbs_info;
    }

    var html    = '';
    $.each( data, function(k, v){
        var row_cnt = 0;
        var ul_id   = 'ul_bbs_list_'+type+'_'+k;
        html +=  '<div class="st"><h4><a style="background: url(/new/asset/images/common/bullet_arrow3.gif) no-repeat right" class="side_bbs_menu_view_top_down" data-state="on" data-ul_id="'+ul_id+'">'+v.title+'</a></h4><ul id="'+ul_id+'">';
        $.each(v.list , function(index, tmp_bbs ){
            var tmp_img = '';

            if( $.inArray(tmp_bbs.id, side_bbs_info.beta)          !== -1 ) var tmp_img = ' <img src="/new/asset/images/ico_beta.gif" alt="beta">';
            else if( $.inArray(tmp_bbs.id, side_bbs_info.renewal)  !== -1 ) var tmp_img = ' <img src="/new/asset/images/r_icon.jpg" alt="renewal">';
            else if( $.inArray(tmp_bbs.id, side_bbs_info.new)      !== -1 ) var tmp_img = ' <img src="/new/asset/images/n_icon.gif" alt="renewal">';
            else var tmp_img = '';

            html +=  '<li data-id="'+tmp_bbs.id+'" data-type="'+type+'" class="side_forum-favorite-addbtn"><a herf="javascript:;">'+tmp_bbs.name+tmp_img+'</a><span class="checkBt" ><img src="/images/plus.svg" alt="아이콘"></span></li>';
            row_cnt++;
        });
        if( row_cnt % 2 == 1 ) html += '<li></li>';
        html +=  '</ul></div>';
    });

    return html;
}

function side_visit_list_delete()
{
    $.each($(".recent-visit-list"), function (i, item) {
        if( $(item).data('delete') == 'true' ) $(item).hide();
    });
}

function side_menu_open_click(){
    $("#side-menu,html,#side-menu_back").addClass("open"); // 메뉴 버튼을 눌렀을때 메뉴, 커버, html에 open 클래스를 추가해서 효과를 준다. 
    window.location.hash = "#open"; // 페이지가 이동한것 처럼 URL 뒤에 #를 추가해 준다. 
    
    var add_param = ($("#side_menu_ad").data("adult_article") == 'Y') ? "&type=19":"";

    // console.log('adult_article ===>', $("#side_menu_ad").data("adult_article"));
    //광고 새로고침
    var ad_html = '<iframe id="if_ad3" src="/banner/google_ad.html?pos=2020&gb=first'+add_param+'" scrolling="no" border="0" marginwidth="0" marginheight="0" frameborder="0" width="320px" height="100px"></iframe>';
    $("#side_menu_ad").html(ad_html);

    if( $.cookie('side_menu_type') == 'visit' ) $(".recent-visit-title").eq(1).click(); else $(".recent-visit-title").eq(0).click();

    if( is_side_menu_load == false ){
        monitor_new    = false;
        mycmt_new      = false;
        ppomcoupon_new = false;    
        set_new_icon_monitor();
    }
}


function show_keyword_side_menu(){
    if($("#keyword_list_side").css("display") == 'none'){
        $("#keyword_list_side").find('img').each( function() {
            $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
        });
        $("#keyword_list_side").css('display','block');
        $("#search-bar-icon-keyword_side").css({"background-image":"url(/images/new_main/icon_search_arrow2.png)"});

    }else{
        $("#keyword_list_side").css('display','none');
        $("#search-bar-icon-keyword_side").css({"background-image":"url(/images/new_main/icon_search_arrow.png)"});
    }
}
