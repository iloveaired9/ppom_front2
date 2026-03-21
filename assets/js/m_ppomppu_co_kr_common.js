// menu
window.onload = function() {
	var menuIco = document.getElementById('menuIco');
	var menuBtn = document.getElementById('menuBtn');
	if ( !!menuIco && !!menuBtn )
	{
		if (menuIco.style.display == 'none') {
			menuBtn.className = 'close';
		} else {
			menuBtn.className = 'open';
		}
	}
}

function menuOpen(value) {

	var menuIco = document.getElementById('menuIco');
	var menuBtn = document.getElementById('menuBtn');
	var searchIco = document.getElementById('searchIco');
	var searchBtn = document.getElementById('searchBtn');

	if (value == 1) {

		if (menuIco.style.display == 'none') { // on

			menuIco.style.display = '';
			menuBtn.className = 'open';

			document.getElementById('menu_on').style.display = 'block';
			document.getElementById('menu_off').style.display = 'none';

		} else { // off
			menuIco.style.display = 'none';
			// menuBtn.className = 'close';
			document.getElementById('menu_off').style.display = 'block';
			document.getElementById('menu_on').style.display = 'none';

		}

	} else if (value == 2) {

		if (searchIco.style.display == 'none') {
			searchIco.style.display = '';
			searchBtn.className = 'open';

			document.getElementById('search_on').style.display = 'block';
			document.getElementById('search_off').style.display = 'none';
		} else {
			searchIco.style.display = 'none';
			searchBtn.className = 'close';
			document.getElementById('search_off').style.display = 'block';
			document.getElementById('search_on').style.display = 'none';

		}
	}
}

/*
 * function searchOpen(value){
 *
 * var searchIco = document.getElementById('searchIco'); var searchBtn =
 * document.getElementById('searchBtn');
 * document.getElementById('search_on').style.display = 'block';
 * document.getElementById('search_off').style.display = 'none';
 * if(searchIco.style.display == 'none'){ searchIco.style.display = '';
 * searchBtn.className = 'open'; } else { searchIco.style.display = 'none';
 * searchBtn.className = 'close';
 * document.getElementById('search_off').style.display = 'block';
 * document.getElementById('search_on').style.display = 'none';
 *  }
 *
 * var menuIco = document.getElementById('menuIco'); var menuBtn =
 * document.getElementById('menuBtn');
 * document.getElementById('menu_on').style.display = 'block';
 * document.getElementById('menu_off').style.display = 'none';
 * if(menuIco.style.display == 'none'){ menuIco.style.display = '';
 * menuBtn.className = 'open'; } else { menuIco.style.display = 'none';
 * menuBtn.className = 'close';
 * document.getElementById('menu_off').style.display = 'block';
 * document.getElementById('menu_on').style.display = 'none'; } }
 */

// forum
function forum(value) {
	if (document.getElementById('forum' + value).style.display == 'none') {
		document.getElementById('forum' + value).style.display = '';
		document.getElementById('forumTt' + value).style.background = 'url(asset/images/common/bullet_arrow3.gif)no-repeat right';
	} else {
		document.getElementById('forum' + value).style.display = 'none';
		document.getElementById('forumTt' + value).style.background = 'url(asset/images/common/bullet_arrow2.gif)no-repeat right';
	}
}

function category_change(obj) {
	var myindex = obj.selectedIndex;
	document.search.category.value = obj.options[myindex].value;
	document.search.submit();
	return true;
}

function link_category(id, obj) {
	if (id == 'phone' && obj.value == 'phone_mgr') {
		location.replace("/new/phone_mgr.php");
	} else if (id == 'kakao_game' && obj.value == 'kakao_invite') {
		location.replace("/new/bbs_list.php?id=kakao_invite");
	} else if (id == 'game' && obj.value == 'invitation') {
		location.replace("/new/bbs_list.php?id=invitation");
	} else if (id == 'diablo' && obj.value == 'party') {
		location.replace("/new/bbs_list.php?id=party");
	} else if (id == 'adult' && obj.value == 6) {
		location.replace("/new/bbs_list.php?id=back_gallery");
	} else if (id == 'market_phone' && obj.value == 'market_data') {
		location.replace("/new/bbs_list.php?id=market_data");
	} else if (id == 'onmarket' && obj.value == 'market_data') {
		location.replace("/new/bbs_list.php?id=market_data");
	} else {
		category_change(obj);
	}

}

function category2_change(obj) {
	var myindex = obj.selectedIndex;

	document.search.category2.value = obj.options[myindex].value;
	document.search.submit();

	return true;
}

function category2_change_baseball_club(obj) {
	var myindex = obj.selectedIndex;
	var category_value = obj.options[myindex].value;
	;

	if (isNaN(category_value)) {
		location.href = "/new/bbs_list.php?id=" + category_value;
	} else if (category_value > 0 || category_value == '') {
		document.search.category2.value = obj.options[myindex].value;
		document.search.submit();
	}
	return true;
}

function confirm_href(msg, url, url2)
{
    if( !msg || !url ){
        return false;
    }

    if( !confirm(msg) ){
        if( url2 ){
            document.location.href = url2;
        }

        return false;
    }

    document.location.href = url;

    return true;
}

function searchValidation(frm) {
	if ($.trim($("input[type='text']", frm).val()) == '') {
		alert('검색어를 입력하세요');
		return false;
	}
}

var currentPage;
var HashLocationName = document.location.hash;

function checkForHash() {
	if (document.location.hash) {
		HashLocationName = HashLocationName.replace("#", "");
	}
}
function m_link() {
	document.location.hash = "#" + currentPage;
}

if (!get_cookie && typeof get_cookie != 'function') {
	/**
	 * 쿠키 가져오기
	 */
    function get_cookie(name) {
        // 1. 찾으려는 쿠키 이름에 '='를 붙여 준비합니다.
        var nameEQ = name + "=";

        // 2. 전체 쿠키 문자열을 ';' 기준으로 쪼개 배열로 만듭니다.
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            // 3. 쿠키 문자열 앞뒤의 불필요한 공백을 제거합니다.
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }

            // 4. 쿠키 이름으로 시작하는 데이터를 찾았다면 값을 반환합니다.
            if (c.indexOf(nameEQ) == 0) {
                // unescape 대신 decodeURIComponent를 사용하여 한글 깨짐 방지
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }

        // 5. 찾는 쿠키가 없다면 null을 반환합니다.
        return null;
    }
}

if (!set_cookie && typeof set_cookie != 'function') {
    /**
     * 쿠키를 설정합니다.
     * @param {string} name - 쿠키 이름
     * @param {string} value - 쿠키 값
     * @param {number} [days] - 유효 기간 (일 단위, 미입력 시 세션 쿠키)
     */
    function set_cookie(name, value, days){
        let expires = "";

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }

        // encodeURIComponent를 사용하여 한글 및 특수문자 완벽 대응
        // SameSite=Lax는 최신 브라우저의 보안 정책을 준수합니다.
        document.cookie = `${name}=${encodeURIComponent(value) || ""}${expires}; path=/; SameSite=Lax`;
    }
}

/**
 * 어플타입
 */
function getAppType() {
	if(navigator.userAgent.indexOf("PPOMBrowser/") != -1 && navigator.userAgent.indexOf("android") != -1){
		return "Android";
	}
	if(navigator.userAgent.indexOf("PPOMBrowser/") != -1 && navigator.userAgent.indexOf("ios") != -1){
		return "iOS";
	}
	return 'Default';

	var appType = get_cookie("app_type");
	if (!!appType)
		return appType;
	else
		return 'Default';
}

/**
 * 어플버전
 */
function getAppVersion() {
	var appVersion = get_cookie("app_version");
	if (!!appVersion)
		return parseInt(appVersion, 10);
	else
		return '0';
}

/**
 * 어플상세버전
 */
function getAppVersionStr() {
	var appVersionStr = get_cookie("app_version_str");
	if (!!appVersionStr)
		return appVersionStr;
	else
		return '0.0.0';
}

/**
 * 로그인
 *
 * @param s_url
 *            로그인 후 이동할 url
 *
 */
function auth_login(s_url) {
	s_url = '/new/login.php?s_url=' + encodeURIComponent(s_url);
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			window.HTMLOUT_IOS.appNotify('login', s_url);
		} else if (getAppType() == 'Android') {
			document.location.href = s_url;
		}
	} else {
		document.location.href = s_url;
	}
}

/**
 * 절약모드
 */
function auth_save_mode(mode) {
	var s_url = '/new/save_mode.php';

	if(mode == "web"){
		document.location.href = s_url;
		return;
	}

	if (getAppType() == 'iOS' && getAppVersion() >= 102) {
		window.HTMLOUT_IOS.appNotify('save_mode', s_url);
	}
	else {
		if(is_ppomppu_app_version("android","2.2.3")){
			window.HTMLOUT.setSaveMode();
		} else {
			if ( mode == 'dark' ) {
				var msg = '다크모드로 변경하시겠습니까?\n(다크모드 변경 후 하단에 있는 라이트모드를 클릭하면 다시 라이트모드로 변경 가능합니다.)';
			} else if ( mode == 'light' ) {
				var msg = '라이트모드로 변경하시겠습니까?\n(라이트모드 변경 후 하단에 있는 다크모드를 클릭하면 다시 다크모드로 변경 가능합니다.)';
			}
			if ( !!msg ){
				if ( confirm(msg) ) {
					document.location.href = s_url;
				}
			}
		}
	}
}

function auth_save_mode_callback() {
	var s_url = '/new/save_mode.php';
	document.location.href = s_url;
}

function zb_login_check_submit() {
    var $user_id = document.getElementById('user_id');
    var $password = document.getElementById('password');

    if ($('#user_id').val() === "") {
        alert("아이디를 입력해주십시요");
        $('#user_id').focus();
        return false;
    }
    if ($('#password').val() === "") {
        alert("비밀번호를 입력해주십시요");
        $('#password').focus();
        return false;
    }
    document.zb_login.submit();
}

/**
 * 회원가입
 */
function auth_join() {
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			window.HTMLOUT_IOS.appNotify('regist', G_MOB_SSL_URL
					+ '/new/auth/join.php');
		} else if (getAppType() == 'Android') {
			if (getAppVersion() > 110)
				window.HTMLOUT.openInAppPopup(G_MOB_SSL_URL
						+ '/new/auth/join.php');
			else
				alert('어플에서는 회원가입을 하실 수 없습니다.\n웹브라우저를 이용해주세요.');
		}
	} else {
		document.location.href = G_MOB_SSL_URL + '/new/auth/join.php';
	}
}

//뽐뿌 앱 버전 체크
if(!is_ppomppu_app_version){
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
}


/* 뽐뿌앱 셋팅창 열기 */
function app_open_setting(){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "119"){
					window.HTMLOUT_IOS.appNotify('setting','');
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.openSetting();
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 하단 댓글수 표기 */
function app_comment_cnt(cnt){
	if(!cnt){
		cnt = "0";
	}
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "119"){
					window.HTMLOUT_IOS.appNotify('view_comment_cnt',cnt);
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.viewCommentCnt(cnt);
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 뽐개팅 오픈 */
function app_open_chat(){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				// version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				// if(version >= "119"){
				// 	window.HTMLOUT_IOS.appNotify('view_comment_cnt',cnt);
				// } else {
				// 	return false;
				// }
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.openChat();
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 하단 이전글 사용여부 flag : Y, N */
function app_prev_use_yn(flag){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "129"){
					window.HTMLOUT_IOS.appNotify('view_prev_use_yn',flag);
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.viewPrevUseYN(flag);
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 하단 다음글 사용여부 flag : Y, N */
function app_next_use_yn(flag){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "119"){
					window.HTMLOUT_IOS.appNotify('view_next_use_yn',flag);
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.viewNextUseYN(flag);
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 왼쪽메뉴 열기 */
function app_open_left_menu(){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "119"){
					window.HTMLOUT_IOS.appNotify('open_left_menu','');
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				window.HTMLOUT.openLeftMenu();
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
}

/* 뽐뿌앱 셋팅창 열기 사용 가능 여부 */
function app_open_setting_check(){
	if (getAppType() == 'iOS' || getAppType() == 'Android') {
		if (getAppType() == 'iOS') {
			try{
				version = navigator.userAgent.split("PPOMBrowser/")[1].split(" (ios;")[0].replace(/\./g,"");
				if(version >= "119"){
					return true;
				} else {
					return false;
				}
			}catch(e){
				return false;
			}
		} else if (getAppType() == 'Android') {
			try{
				if(window.HTMLOUT && window.HTMLOUT.openSetting){
					return true;
				}
			}
			catch(e){
				return false;
			}
		}
	} else {
		return false;
	}
	return false;
}

function bbs_list_click_event_setting(save_mode){

	$.each($(".hybrid-skin-li"), function(k,v){
		if($(v).data("click_event_touchstart")){
			return;
		}

		$(v).on("click",function(){
			if($(v).data("touchModeSetTimeout")){
				clearTimeout($(v).data("touchModeSetTimeout"));
				$(v).data("touchModeSetTimeout",false);
			}
			$(v).stop();
			$(v).css("backgroundColor",(save_mode?'#333':'#eee'));
			$(v).data("animate",true);
			$(v).animate({
				backgroundColor:$(v).data("backColor")
			} ,200, function(){
				$(v).data("animate",false);
			});
		});

		$(v).on("touchstart",function(){
			if(!$(v).data("backColor")){
				$(v).data("backColor",$(v).css("backgroundColor"));
			}
			var a = setTimeout(function(){
				$(v).css("backgroundColor",(save_mode?'#333':'#eee'));
				$(v).data("touchMode",true);
			},150);

			$(v).data("touchModeSetTimeout",a);


		});

		$(v).on("touchmove touchend",function(){
			//$(v).stop();
			if($(v).data("touchModeSetTimeout")){
				clearTimeout($(v).data("touchModeSetTimeout"));
				$(v).data("touchModeSetTimeout",false);
			}
			if($(v).data("animate")){
				return;
			}
			$(v).data("animate",true);
			$(v).animate({
				backgroundColor:$(v).data("backColor")
			} ,200, function(){
				$(v).data("animate",false);
			});
		});

		$(v).data("click_event_touchstart",true);
	});

	if($(window).data("set_event")){
		return;
	}
	$(window).on("touchmove touchend",function(){

		$.each($(".hybrid-skin-li"), function(k,v){
			//$(v).stop();
			if($(v).data("backColor") != $(v).css("backgroundColor")){
				if($(v).data("touchModeSetTimeout")){
					clearTimeout($(v).data("touchModeSetTimeout"));
					$(v).data("touchModeSetTimeout",false);
				}
				if($(v).data("animate")){
					return;
				}
				$(v).data("animate",true);
				$(v).animate({
					backgroundColor:$(v).data("backColor")
				} ,200, function(){
					$(v).data("animate",false);
				});
			}
		});
	});

	$(window).data("set_event",true);


}

//ios 뽐뿌앱 검색 개선 --> 1.4.0 이상버전 적용
$(document).ready(function(){
	if(is_ppomppu_app_version("ios","1.4.0") && false ){
		$("select[name=search_type]").on("touchstart", function(){
			window.HTMLOUT_IOS.appNotify('open_search','Y');
		});

		$("input[name=keyword]").on("focus click", function(){
			window.HTMLOUT_IOS.appNotify('open_search');
		});
	}

	if(is_ppomppu_app_version("android","2.8.1") && false ){
		$("select[name=search_type]").on("touchstart", function(){
			return;
			// window.HTMLOUT_IOS.appNotify('open_search','Y');
			if(window.HTMLOUT && window.HTMLOUT.openSearch){
				$(this).blur();
				window.HTMLOUT.openSearch("Y");
			}
		});

		$("input[name=keyword]").on("focus", function(){
			// window.HTMLOUT_IOS.appNotify('open_search');
			if(window.HTMLOUT && window.HTMLOUT.openSearch){
				$(this).blur();
				var type = $("select[name=search_type]").length > 0 ? $("select[name=search_type]").val() : '';
				window.HTMLOUT.openSearch("N", type);
			}
		});
	}
});


$(function() {

	checkForHash();

	$("#style_thumb").click(function() {

		if ($("#style_thumb").attr("class") == 'first on02') {
			location.href = '/new/menu_list.php?menu=7';
		}

		$("#free_picture_thumb").removeClass();
		$("#mobile_gallery_thumb").removeClass();
		$("#style_thumb").addClass('first on02');
		$("#thumb_mainList").load("/new/_ajax_main_thumb.php?param=style");
	});

	$("#mobile_gallery_thumb").click(function() {

		if ($("#mobile_gallery_thumb").attr("class") == 'first on01') {
			location.href = '/new/bbs_list.php?id=mobile_gallery';
		}

		$("#mobile_gallery_thumb").addClass('first on01');
		$("#free_picture_thumb").removeClass();
		$("#style_thumb").removeClass();
		$("#thumb_mainList").load("/new/_ajax_main_thumb.php?param=mobile_gallery");

	});

	$("#free_picture_thumb").click(function() {

		if ($("#free_picture_thumb").attr("class") == 'first on') {
			location.href = '/new/bbs_list.php?id=free_gallery';
		}

		$("#free_picture_thumb").addClass('first on');
		$("#mobile_gallery_thumb").removeClass();
		$("#style_thumb").removeClass();

		$("#thumb_mainList").load("/new/_ajax_main_thumb.php?param=free_gallery");

	});
});

$(document).ready(function() {

	$('#KH_Content table').css('width', '100%');

	var banner = $('.sidebar .floating-banner');
    var $zb_login = $("form[name='zb_login']");
    var winWidth = $(window).width();

	setTimeout(function(){
		$zb_login.find('#user_id').focus();
	},50);


    $zb_login.find('.tbt a').on('click', function() {
        var index = $(this).index();
        var check01 = $('.keyboard_hangle').css('display');
        var check02 = $('.keyboard_special').css('display');

        if (index == 0) {
            $('.keyboard_hangle').toggle();
            $('.keyboard_special').hide();

        } else if (index == 1) {
             $('.keyboard_hangle').hide();
           $('.keyboard_special').toggle();
        }

         if (check01 == 'none' && index == 0) {
               $zb_login.find('.keyBtn1').attr('src', '/images/keyButton01.png');
             $zb_login.find('.keyBtn2').attr('src', '/images/keyButton_on_01.png');
         } else if (check01 == 'block' && index == 0) {
             $zb_login.find('.keyBtn1').attr('src', '/images/keyButton_on_01.png');
             $zb_login.find('.keyBtn2').attr('src', '/images/keyButton_on_01.png');
          } else if (check02 == 'none' && index == 1) {
             $zb_login.find('.keyBtn1').attr('src', '/images/keyButton_on_01.png');
             $zb_login.find('.keyBtn2').attr('src', '/images/keyButton01.png');
          } else if (check02 == 'block' && index == 1) {
             $zb_login.find('.keyBtn1').attr('src', '/images/keyButton_on_01.png');
             $zb_login.find('.keyBtn2').attr('src', '/images/keyButton_on_01.png');
          }
    });

    if (winWidth>800) {
        $('.tbt').hide();
    }

    $(window).on('scroll', function() {

		var scrollTop = $(this).scrollTop();

		if (scrollTop >= 104) {
			banner.css({
				"position" : "fixed",
				"top" : "9px"
			});
		} else if (scrollTop < 104) {
			banner.css({
				"position" : "relative",
				"top" : "112px"
			});
		}

	});

	if (getAppType() == 'iOS' && !window.HTMLOUT_IOS) {

		//if(webkit && webkit.messageHandlers) webkit.messageHandlers.scriptHandler.postMessage("appNotify|^|login|^|"+s_url);
		//window.HTMLOUT_IOS.setSocialAccountInfo(
		window.HTMLOUT_IOS = {};
		window.HTMLOUT_IOS.appNotify = function(key, value){
			if(webkit && webkit.messageHandlers) webkit.messageHandlers.scriptHandler.postMessage("appNotify|^|"+key+"|^|"+value);
		};
		window.HTMLOUT_IOS.setSocialAccountInfo = function(key, value){
			if(webkit && webkit.messageHandlers) webkit.messageHandlers.scriptHandler.postMessage("setSocialAccountInfo|^|"+key+"|^|"+value);
		};
		window.HTMLOUT_IOS.setTossAuth = function(key, value){
			if(webkit && webkit.messageHandlers) webkit.messageHandlers.scriptHandler.postMessage("setTossAuth|^|"+key+"|^|"+value);
		};
	}
});


function pvAdClick(url)
{
    try
    {
        var iframe      = document.createElement("iframe");
        var temp_iframe = document.getElementById("_pv_ad_iframe_");
        if(temp_iframe) temp_iframe.parentNode.removeChild(temp_iframe);

        iframe.setAttribute('id'   , '_pv_ad_iframe_');
        iframe.setAttribute('style', 'height:0;width:0;border:0;border:none;visibility:hidden;');
        iframe.setAttribute('src'  , url);
        document.body.appendChild(iframe);
    }
    catch ( e1 ){}
}

function resizeMediaPlayer(){
    try
    {
		$("iframe").each(function(){ if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} });
		$("iframe").each(function(){ if( /^https?:\/\/play-tv.kakao.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} });
		$("iframe").each(function(){ if( /^https?:\/\/tv.naver.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} });
	}
	catch ( e1 ){}
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})'+ // domain name
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?','i'); // fragment locator
  return !!pattern.test(str);
}

function validSubject(subject){
    // 스마트따옴표를 일반따옴표로 변환하여 검증
    subject = subject.replace(/[\u{2018}\u{2019}]/ug, "'").replace(/[\u{201C}\u{201D}]/ug, '"').replace(/\u{2026}/ug, '...');

    var pattern = /[^\u{0020}-\u{007E}\u{3131}-\u{3163}\u{AC00}-\u{D7A3}]/u;
    var patternDot = /\.{4,}/;
    var patternOther = /(([\u{0021}-\u{002F}\u{003A}-\u{0040}\u{005B}-\u{0060}\u{007B}-\u{007E}]){2})[\u{0021}-\u{002F}\u{003A}-\u{0040}\u{005B}-\u{0060}\u{007B}-\u{007E}]+/ug; // '.'(0x2E) 제외한 특수문자
    var pattern3 = /([\u{3131}-\u{314E}]{2})[\u{3131}-\u{314E}]+/u;

    return !pattern.test(subject) && !patternDot.test(subject) && !patternOther.test(subject) && !pattern3.test(subject);
}

function sanitizeSubject(subject){
    // 스마트따옴표를 일반따옴표로 변환
    subject = subject.replace(/[\u{2018}\u{2019}]/ug, "'").replace(/[\u{201C}\u{201D}]/ug, '"').replace(/\u{2026}/ug, '...');

    var pattern = /[^\u{0020}-\u{007E}\u{3131}-\u{3163}\u{AC00}-\u{D7A3}]/ug;
    var patternDot = /\.{4,}/g;
    var patternOther = /(([\u{0021}-\u{002F}\u{003A}-\u{0040}\u{005B}-\u{0060}\u{007B}-\u{007E}]){2})[\u{0021}-\u{002F}\u{003A}-\u{0040}\u{005B}-\u{0060}\u{007B}-\u{007E}]+/ug; // '.'(0x2E) 제외한 특수문자
    var pattern3 = /([\u{3131}-\u{314E}]{2})[\u{3131}-\u{314E}]+/ug;

    // 특수문자 반복 처리(온점 4개 이상은 3개로, 기타 특수문자 3개 이상은 2개로)
    return subject.replace(pattern, '')
                  .replace(pattern3, '$1')
                  .replace(patternDot, '...')
                  .replace(patternOther, '$1')
                  .replace(/\s+/g, ' ');
}

function getByteLength(s,b,i,c){
    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
    return b;
}

function get_copy_clipboard(id){
	var copy_text = $("#"+id).val();
	var textarea = document.createElement("TEXTAREA");
    var result = 0;
	textarea.style.width="1px";
	textarea.style.height="1px";
	textarea.style.position="absolute";
	textarea.style.top="-100px";
	textarea.value = copy_text;
	$(document.body).append(textarea);
	$(textarea).select();

	try {
		var successful = document.execCommand('copy');
		if(successful){
            result = 1;
		} else {
            result = 0;
		}
	} catch (err) {
        result = -1;
	}

	$(textarea).remove();

    return result;
}

function get_copy_cmt_url_clipboard(id, cno){
	var copy_text = $("#"+id).val();
	var textarea = document.createElement("TEXTAREA");
    var result = 0;
	textarea.style.width="1px";
	textarea.style.height="1px";
	textarea.style.position="absolute";
	textarea.style.top="-100px";
	copy_text = copy_text + '&cno='+cno+'&cpcmt=y';
	textarea.value = copy_text;
	$(document.body).append(textarea);
	$(textarea).select();

	try {
		var successful = document.execCommand('copy');
		if(successful){
            result = 1;
		} else {
            result = 0;
		}
	} catch (err) {
        result = -1;
	}

	$(textarea).remove();

    return result;
}

function localStorageAvailable(){
    try {
        var storage = window.localStorage;
        var x = '__ppom_storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        // 22 || 1014 || QuotaExceededError || QuotaExceededError 는 저장용량 다 찬 상태
        // Safari 에서는 사생활 보호모드시 위 에러 발생
        console.log(e.code);
        return false;
    }
}

//-------------------------------------------------------------------
//오픈포럼 start
//-------------------------------------------------------------------
function chkGuestName(name){
    var obj = {
        flag : false,
        msg : ''
    };
    //체크 제외대상
    const exclude_bbs_list = ['tele_consult', 'consulting', 'etc_consult', 'security_guard_consult', 'wedding_consult','aircon_consult','tax_consult','pc_consult','car_service','move_consult','loan_consult', 'card_consult','rental_consult'];

    if(!name){
        obj.msg = '닉네임을 입력해주세요.';
    }else if(/^[a-z0-9]*$/.test(name) && name.length < 4){
        obj.msg = '닉네임을 영문,숫자는 4자 이상 입력해 주세요.';
    }else if(name.length < 2 || name.length > 20){
        obj.msg = '닉네임을 2~20자를 입력해주세요.';
    }else if(typeof G_BBS_ID !== "undefined" && ! exclude_bbs_list.includes(G_BBS_ID) && name.indexOf(' ') > -1){
        obj.msg = '닉네임은 공백을 입력할 수 없습니다.';
    }else if(typeof G_BBS_ID !== "undefined" &&  ! exclude_bbs_list.includes(G_BBS_ID) && name.search(/[^~!\-_+@\=\u3131-\u314E|\u314F-\u3163|\uAC00-\uD7A3|a-z|A-Z|0-9]/gi) != -1 ){
        obj.msg = '닉네임은 특수문자 _-@!~+= 만 사용 가능합니다.';
    }else if(name.search(/1=1/) > -1){
        obj.msg = '닉네임은 \'1=1\'은 사용할 수 없습니다.';
    }else{
        obj.flag = true;
    }

    return obj;
}


function set_nickname_selected(nick_selected){

    if( nick_selected.length == 0 ) return;

    try{
        let key            = 'guest_forum_nickname';
        let comparison_key = 'bbs_id';
        let items          = JSON.parse(localStorage.getItem(key)) || [];
        let set_data       = { bbs_id: G_BBS_ID, nick_selected:nick_selected};
        let itemIndex      = items.findIndex(item => item[comparison_key] === set_data[comparison_key]);

        if (itemIndex > -1){
            items[itemIndex].nick_selected = nick_selected;
        }else{
            items.push(set_data);
        }
        localStorage.setItem(key, JSON.stringify(items));
    }catch (e){
        console.log('set_nickname_selected Fail');
    }
}

function get_nickname_selected(){

    try{
        let key            = 'guest_forum_nickname';
        let comparison_key = 'bbs_id';
        let items          = JSON.parse(localStorage.getItem(key)) || [];
        let itemIndex      = items.findIndex(item => item[comparison_key] === G_BBS_ID );

        if (itemIndex > -1){
            return items[itemIndex].nick_selected;
        }else{
            return 'guest_nickname';
        }
    }catch (e){
        console.log('set_nickname_selected Fail');
    }
}

function get_guest_forum_nickname_info_stat(){
    try{
		let key = 'guest_forum_nickname_info';
		let rst = localStorage.getItem(key) || '';
		rst = ( rst == 'hidden' ) ? 'hidden' : 'view';
		return rst;
    }catch (e){
        console.log('get_guest_forum_nickname_info_stat Fail');
    }
}
function set_guest_forum_nickname_info_stat(gb){
    try{
		let val = ( gb == 'hidden' || gb == 'view' ) ? gb : '';
        let key = 'guest_forum_nickname_info';
		localStorage.setItem(key, val);
    }catch (e){
        console.log('set_nickname_selected Fail');
    }
}

function guest_forum_nickname_info_show(gb){
    try{
		if( gb == 'N' ){
			$(".area-sign").hide();
			return;
		}

        let stat = get_guest_forum_nickname_info_stat();
		if( stat != 'hidden' ){
			$(".area-sign").show();
		}
    }catch (e){
        console.log('set_nickname_selected Fail');
    }
}

var OpenForumToolTip = new class {
    show(){
        $('.js_openforum_tooltip').show();
    }

    hide(){
        $('.js_openforum_tooltip').hide();
    }

    visible(){
        $('.js_openforum_tooltip').css('visibility', 'visible');
    }

    invisible(){
        $('.js_openforum_tooltip').css('visibility', 'hidden');
    }

    setHide24(){
        var now = new Date().getTime();
        localStorage.setItem('openforum_tooltip_hide', now + 24 * 60 * 60 * 1000);
    }

    isHide24(){
        var until = localStorage.getItem('openforum_tooltip_hide');
        var now = new Date().getTime();
        return until && now < until;
    }

    binding(){
        // show
        $('select[name=guest_nickname_sel]').live('change', (e)=>{
            if( e.target.value == 'guest_nickname' ){
                if( !this.isHide24() ) this.show();
            }else{
                this.hide();
            }
        });

        // close
        $('.js_openforum_tooltip .js_close').live('click', (e)=>{
            this.setHide24();
            this.hide();
        });
    }
};

$(document).ready(function(){
    // 오픈포럼 게시판
    if( typeof G_IS_GUEST_BOARD !== 'undefined' && G_IS_GUEST_BOARD ){
        OpenForumToolTip.binding();

        $('select[name=guest_nickname_sel]').live('change', function(){
            let nick_selected = $(this).val();
            let name          = $(this).data(nick_selected);
            $(this).next('[name="guest_nickname"]').val(name);

            if( nick_selected == 'guest_nickname' ){
                $(this).next('[name="guest_nickname"]').prop("readonly", false);
            }else{
                $(this).next('[name="guest_nickname"]').prop("readonly", true);
            }
            set_nickname_selected(nick_selected);
        });

        //오픈게시판 로그인 사용자만 적용
        var urlObj = new URL(location.href);
        if( urlObj.searchParams.get('mode') != 'modify' ){
            if( G_IS_GUEST !== 1 && $('select[name=guest_nickname_sel]').length > 0 ){
                let nick_selected = get_nickname_selected();
                $('select[name=guest_nickname_sel]').val(nick_selected).change();
            }else{
                if( urlObj.pathname == '/new/bbs_write.php' ){
                    $('.js_openforum_tooltip').css('bottom', '178px');
                }
                if( !OpenForumToolTip.isHide24() ) OpenForumToolTip.show();
            }
        }
    }
});
//-------------------------------------------------------------------
//오픈포럼 end
//-------------------------------------------------------------------

var ScrollAction = (function(){
    var lastScrollTop = 0;
    var lastDirection = 'inplace'; // up, down, inplace
    var upActionList = [];
    var downActionList = [];
    var stopActionList = [];
    var timeoutScrolling;
    var isBinded = false; // true, false

    return {
        addUpAction : function(callback, mode){
            action = callback;
            mode = typeof mode == 'undefined' ? 'new' : mode; // new, once
            upActionList.push({"action":action, "mode":mode});
        },
        addDownAction : function(callback, mode){
            action = callback;
            mode = typeof mode == 'undefined' ? 'new' : mode; // new, once
            downActionList.push({"action":action, "mode":mode});
        },
        addStopAction : function(callback){
            action = callback;
            stopActionList.push({"action":action});
        },
        binding : function(){
            if( isBinded ) return;

            isBinded = true;

            $(window).scroll(function(e){
                var scrollTop = $(this).scrollTop();

                // stop
                clearTimeout(timeoutScrolling);
                timeoutScrolling = setTimeout(function(){
                    stopActionList.forEach(function(item){
                        item.action(scrollTop);
                    });
                    lastDirection = 'inplace';
                }, 100);

                // up
                if( scrollTop < lastScrollTop ){
                    upActionList.forEach(function(item){
                        if( item.mode != 'once' || lastDirection != 'up' ){
                            item.action(scrollTop);
                        }
                    });
                    lastDirection = 'up';

                // down
                }else{
                    downActionList.forEach(function(item){
                        if( item.mode != 'once' || lastDirection != 'down' ){
                            item.action(scrollTop);
                        }
                    });
                    lastDirection = 'down';
                }

                lastScrollTop = scrollTop;
            });
        },
    };
})();

/* PV(C) Log START */
function informAdClick(url)
{
    try
    {
        var iframe      = document.createElement("iframe");
        var temp_iframe = document.getElementById("_inform_temp_iframe_");
        if(temp_iframe) temp_iframe.parentNode.removeChild(temp_iframe);

        iframe.setAttribute('id'   , '_inform_temp_iframe_');
        iframe.setAttribute('style', 'height:0;width:0;border:0;border:none;visibility:hidden;');
        iframe.setAttribute('src'  , url);
        document.body.appendChild(iframe);
    }
    catch ( e1 ){}
}

var PVchecker = new class {
    constructor(){
        this.calledUrlList = [];
    }

    log(url){
        if( this.calledUrlList.indexOf(url) > -1 ) return false;
        this.calledUrlList.push(url);

        try{
            var iframe = document.getElementById("_pv_checker_iframe_");
            if( iframe ) iframe.remove();

            var iframe = document.createElement("iframe");
            iframe.setAttribute('id'   , '_pv_checker_iframe_');
            iframe.setAttribute('style', 'height:0;width:0;border:0;border:none;visibility:hidden;');
            iframe.setAttribute('src'  , url);
            document.body.appendChild(iframe);
        }catch( e1 ){
        }
    }
};
/* PV(C) Log END */

/* 모니터 아이콘 설정 START */
function set_new_icon_monitor()
{
	if ( monitor_new == false && mycmt_new == false  && ppomcoupon_new == false )
    {
        monitor_new    = true;
        mycmt_new      = true;
        ppomcoupon_new = true;

        $.ajax({
        //$.memoizedAjax({
            type: "POST",
            dataType: "json",
            cache:false,
            url: "/new/myinfo/ajax_header_my_monitor.php",
        }).done(function(data){
            if(data.my)
            {
                $(".new_my_article").show();       //상단
                $(".new_icon_myinfopage").show();  //마이페이지 모니터링 표시
                $("#site-header-member-mypage").addClass('site-header-member-mypage-on');
            }

            if(data.mycomm)
            {
                $(".new_my_comment").show();
                $(".new_icon_mycomment").show();
                $("#site-header-member-mypage").addClass('site-header-member-mypage-on');
            }

            if(data.ppomcoupon)
            {
                $(".new_icon_ppomcoupon").show();
                $(".new_ico.ppomcoupon_new").show();
            }
        });
    }
}

function set_ppomcoupon_new()
{
	if ( !ppomcoupon_new )
    {
        $.memoizedAjax({
            type: "POST",
            dataType: "json",
            localStorage: true,
            cacheKey: 'ajax_monitor',
            ttl:1000,
            url: "/new/myinfo/ajax_my_ppomcoupon_monitor.php",
        }).done(function(data){
            if (data.code == 0 && data.result > 0)
            {
                ppomcoupon_new = true;
                $(".new_icon_ppomcoupon").show();
                $(".new_ico.ppomcoupon_new").show();
                return ;
            }
        });
    }
    ppomcoupon_new = true;
}
/* 모니터 아이콘 설정 END */

/* 검색 키워드 START */
function show_keyword(){
    if($("#keyword_list").css("display") == 'none'){
        $("#keyword_list").find('img').each( function() {
            $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
        });
        $("#keyword_list").css('display','block');
        $("#search-bar-icon-keyword").css({"background-image":"url(/images/new_main/icon_search_arrow2.png)"});
    }else{
        $("#keyword_list").css('display','none');
        $("#search-bar-icon-keyword").css({"background-image":"url(/images/new_main/icon_search_arrow.png)"});
    }
}
/* 검색 키워드 END */

/* 공시사항 START */
function setNoticeLayers(name,value,expiredays){
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + parseInt(expiredays));
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}
function closeNoticeLayers(cookiename,layername,closename,expiredays) {
    if (document.getElementById(closename).checked == true) {
        setNoticeLayers(cookiename, "done" ,expiredays);
    }
    document.getElementById(layername).style.display = "none";
}
/* 공시사항 END */

/* UserMemo START */
function decodeURL(str){
     var s0, i, j, s, ss, u, n, f;
     s0 = "";                // decoded str
     for (i = 0; i < str.length; i++){   // scan the source str
         s = str.charAt(i);
         if (s == "+"){s0 += " ";}       // "+" should be changed to SP
         else {
             if (s != "%"){s0 += s;}     // add an unescaped char
             else{               // escape sequence decoding
                 u = 0;          // unicode of the character
                 f = 1;          // escape flag, zero means end of this sequence
                 while (true) {
                     ss = "";        // local str to parse as int
                         for (j = 0; j < 2; j++ ) {  // get two maximum hex characters for parse
                             sss = str.charAt(++i);
                             if (((sss >= "0") && (sss <= "9")) || ((sss >= "a") && (sss <= "f"))  || ((sss >= "A") && (sss <= "F"))) {
                                 ss += sss;      // if hex, add the hex character
                             } else {--i; break;}    // not a hex char., exit the loop
                         }
                     n = parseInt(ss, 16);           // parse the hex str as byte
                     if (n <= 0x7f){u = n; f = 1;}   // single byte format
                     if ((n >= 0xc0) && (n <= 0xdf)){u = n & 0x1f; f = 2;}   // double byte format
                     if ((n >= 0xe0) && (n <= 0xef)){u = n & 0x0f; f = 3;}   // triple byte format
                     if ((n >= 0xf0) && (n <= 0xf7)){u = n & 0x07; f = 4;}   // quaternary byte format (extended)
                     if ((n >= 0x80) && (n <= 0xbf)){u = (u << 6) + (n & 0x3f); --f;}         // not a first, shift and add 6 lower bits
                     if (f <= 1){break;}         // end of the utf byte sequence
                     if (str.charAt(i + 1) == "%"){ i++ ;}                   // test for the next shift byte
                     else {break;}                   // abnormal, format error
                 }
             s0 += String.fromCharCode(u);           // add the escaped character
             }
         }
    }
    return s0;
}

var UserMemo = function(mLevel, memNo, nameEncoded) {
    this.mLevel = mLevel,
    this.memNo = memNo,
    this.nameEncoded = nameEncoded,
    this.mIsExpend = false,
    this.checkMemoAdd = function() {
        if ($("ul[id='userMemoView'] > li[flag='B']").length == 0 || this.mLevel > 0) {
            $("ul[id='userMemoAddView']").show();
        } else {
        	$("ul[id='userMemoAddView']").hide();
        }
    };
    this.expend = function(obj) {
        if (this.mIsExpend == false) {

            $.ajax({
                type: "POST",
                data: "cmd=expend&member_no="+this.memNo,
                dataType: "text",
                url: "/new/ajax_user_memo.php",
                success: function(html) {
                    obj.text("[줄이기]");
                    $("ul[id='userMemoExpendView']").html(html);
                }
            });
        } else {
            obj.text("[더보기]");
            $("ul[id='userMemoExpendView']").html("");
        }
        this.mIsExpend = !this.mIsExpend;
    };
    this.add = function() {
        msg = prompt("회원메모를 등록하고 있습니다. 참고할만한 멘트를 적으시고 확인을 누르세요.", '');
        if ( msg == null ) {
            return false;
		 }else if( msg == '' ){
            alert('내용을 입력해주세요.');
            this.add();
            return false;
		 }

        msg = encodeURIComponent(msg);
        msg = msg.replace(/%C2%A0+/g, '');

        $.ajax({
            type: "POST",
            data: "cmd=add&member_no="+this.memNo+"&name="+this.nameEncoded+"&memo="+msg,
            dataType: "text",
            url: "/new/ajax_user_memo.php",
            context: this,
            success: function(html) {
                $("ul[id='userMemoView']").append( html );
                this.checkMemoAdd();
            }
        });
    };
    this.add_with_msg = function(msg,ismember,fn) {
        //msg = prompt("회원메모를 등록하고 있습니다. 참고할만한 멘트를 적으시고 확인을 누르세요.", '');
        if ( msg == null ) {
            return false;
		 }else if( msg == '' ){
            alert('내용을 입력해주세요.');
            //this.add();
            return false;
		 }

        $.ajax({
            type: "POST",
            data: "cmd=add&member_no="+ismember+"&name="+this.nameEncoded+"&memo="+encodeURIComponent(msg),
            dataType: "text",
            url: "/new/ajax_user_memo.php",
            context: this,
            success: function(html) {

                //$("ul[id='userMemoView']").append( html );
                //this.checkMemoAdd();

                if(fn) setTimeout(fn,10);
            }
        });
    };
    this.modify = function(no) {
        var str = $("textarea[id='userMemoMsgArea_"+no+"']").val().trim();
        msg = prompt("회원메모를 수정하고 있습니다. 참고할만한 멘트를 적으시고 확인을 누르세요.", decodeURL(str));
        if ( msg == null ) {
            return false;
		 }else if( msg == '' ){
            alert('내용을 입력해주세요.');
            this.modify();
            return false;
		 }

        msg = encodeURIComponent(msg);
        msg = msg.replace(/%C2%A0+/g, '');

        $.ajax({
            type: "POST",
            data: "cmd=modify&member_no="+this.memNo+"&mno="+no+"&memo="+msg,
            dataType: "json",
            url: "/new/ajax_user_memo.php",
            success: function(obj) {
                $("span[id='userMemoMsg_"+no+"']").attr('title', obj.memo);
                $("textarea[id='userMemoMsgArea_"+no+"']").val(obj.memo);
                $("span[id='userMemoMsg_"+no+"'] > span").text(obj.cut_memo);
            }
        });
    };

    this.modify_with_msg = function(no,msg,fn) {
        //var str = $("span[id='userMemoMsg_"+no+"']").attr('title');
        //msg = prompt("회원메모를 수정하고 있습니다. 참고할만한 멘트를 적으시고 확인을 누르세요.", decodeURL(str));
        if ( msg == null ) {
            return false;
		 }else if( msg == '' ){
            alert('내용을 입력해주세요.');
            this.modify();
            return false;
		 }

        $.ajax({
            type: "POST",
            data: "cmd=modify&member_no="+this.memNo+"&mno="+no+"&memo="+encodeURIComponent(msg),
            dataType: "json",
            url: "/new/ajax_user_memo.php",
            success: function(obj) {
                if( obj && typeof obj == 'object' ){
                    $("span[id='userMemoMsg_"+no+"']").attr('title', obj.memo);
                    $("span[id='userMemoMsg_"+no+"'] > span").text(obj.cut_memo);
                }

                if(fn) setTimeout(fn,10);
            }
        });
    };
    this.del = function(no) {
        if (!confirm('삭제 하시겠습니까?')) return;

        if( !this.mLevel ){
            $(".user_memo").hide();
        }

        $.ajax({
            type: "POST",
            data: "cmd=del&member_no="+this.memNo+"&mno="+no,
            dataType: "text",
            url: "/new/ajax_user_memo.php",
            context: this,
            success: function(html) {
                if( html == 'SUCCESS') {
                    $("li[id='userMemo_"+no+"']").remove();
                } else {
                    alert('삭제 도중 오류가 발생하였습니다.');
                }
                this.checkMemoAdd();
            }
        });
    };

    this.del_with_fn = function(no,fn) {
        if (!confirm('삭제 하시겠습니까?')) return;

        $.ajax({
            type: "POST",
            data: "cmd=del&member_no="+this.memNo+"&mno="+no,
            dataType: "text",
            url: "/new/ajax_user_memo.php",
            context: this,
            success: function(html) {
                if( html == 'SUCCESS') {
                    $("li[id='userMemo_"+no+"']").remove();
                } else {
                    alert('삭제 도중 오류가 발생하였습니다.');
                }
                this.checkMemoAdd();
                if(fn) setTimeout(fn,10);
            }
        });
    };
};
/* UserMemo END */

/* 키워드 알림 앱 팝업 START */
function moveToAppOrStore(){

    let agg;
    agg = navigator.userAgent;
    if(agg == undefined) {
        alert("invalid!");
        return;
    }
    let purl;
    let storeUrl;
    try {
        if(agg.toLowerCase().indexOf("PPOMBrowser") != -1)
		{
            console.log("it is PPOMBrowser");
            return;
        } else if(/iPhone|iPad|iPod/i.test(agg.toLowerCase()))
		{
            console.log("it is ios web");
            purl = "ppomppu" + "app://aaa";
            storeUrl = "https://apps.apple.com/kr/app/pp/id1135654356";
        } else
        {
            console.log("it is android web");
            purl = "ppomppu://googleappindexing";
            storeUrl = "https://play.google.com/store/apps/details?id=com.ppomppu.android";
        }
		window.location = storeUrl;
    } catch( e){
            console.log('errr');
            window.location = storeUrl;
	}

	closePopupAppStoreInfo();
}

function openAppOrStore(appScheme, playStoreUrl, appStoreUrl) {
    // 모바일 기기 확인
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // 딥링크를 통한 앱 실행 시도
        const now = new Date().valueOf();

        setTimeout(function () {
            if (new Date().valueOf() - now > 100) return;
            if (/Android/i.test(navigator.userAgent)) {
                window.location = playStoreUrl;
            } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location = appStoreUrl;
            }
        }, 50);

        window.location = appScheme;
    } else {
        // 데스크톱의 경우 웹사이트로 이동하거나 다른 동작 수행
        alert("이 기능은 모바일 기기에서만 사용 가능합니다.");
    }
}

function openPopupAppStoreInfo(){
	$('.js-popupAppStoreInfo').show();
}
function closePopupAppStoreInfo(){
	$('.js-popupAppStoreInfo').hide();
}

function hide_ppomppu_install_popup() {
	//alert('??');
	console.log('??');
    let checked = $('.popup-check > input')[0].checked;
	if(checked) {
		set_cookie('hide_ppom_popup', 'on', 7);
	}
	$('#popup').css('display', 'none');
}
function hide_ppomppu_install_popup_maybe_until_seven_days() {
	//alert("h");
	console.log('!!');
	hide_ppomppu_install_popup();
}
/* 키워드 알림 앱 팝업 END */

/* Ask App Usage START */
var AskAppUsage = new class {
    constructor(){
        this.app_type = getAppType();
        this.asked = this._getAsked();
    }

    draw(){
        var html = `
<div class="ppom-popup" id="ask_app_usage_popup">
    <div class="path-box">
        <h1><b>앱</b>에서는 <b>실시간</b>으로</h1>
        <span><strong>정보 알림 기능</strong>을 사용할 수 있어요!</span>
        <button type="button" onclick="AskAppUsage.useApp();">편하게 뽐뿌 앱으로 보기 &gt;</button>
        <small onclick="AskAppUsage.useWeb();">불편해도 모바일웹으로 보기</small>
    </div>
</div>
`;
        if( this.app_type == 'Default' && !this.asked && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ){
            $('body').append( html );
        }
    }

    useApp(){
        this._setAsked();
        window.location = 'https://ppomppu.page.link/Eit5';
        $('#ask_app_usage_popup').hide();
    }

    useWeb(){
        this._setAsked();
        $('#ask_app_usage_popup').hide();
    }

    _getAsked(){
        return localStorage.getItem('AppUsageAsked');
    }

    _setAsked(){
        localStorage.setItem('AppUsageAsked', 1);
    }
};
/* Ask App Usage END */

/* 뽐뿌게시판 쿠팡최저가 상품 추가 검색기준 및 정렬 */
$(document).ready(function(){
    $('.bbsTop.bbsTop_options .opt').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);
        var idx = $this.index();

        var $opts = $('.bbsTop.bbsTop_options .opt');
        $opts.removeClass('on')
             .eq(idx)
             .addClass('on');

        $.cookie('ppom_price_sort', $this.data("ppom_price_sort"), { expires: 365, path: '/' });

        location.reload();
    });

    $('#ppom_price_term').on('change', function() {
        var term = $(this).val();      // 선택된 value 값
        var text = $(this).find('option:selected').text();  // 선택된 텍스트

        console.log('선택된 기간:', term, text);
        $.cookie('ppom_price_term', term, { expires: 365, path: '/' });

        location.reload();
    });
});

/* Ppom Prompt START */
class PpomPrompt {
    constructor(){
        this.title = null;
        this.fn_ok = null;
        this.fn_cancel = null;
        this.$prompt = null;
        return this;
    }

    setTitle(title){
        this.title = title;
        return this;
    }

    setOk(fn){
        this.fn_ok = fn;
        return this;
    }

    setCancel(fn){
        this.fn_cancel = fn;
        return this;
    }

    draw(){
        var html = `
<div>
    <div class="js_overlay" style="position:absolute;top:0;left:0;z-index:1000;width:100%;height:100%;background:#000;opacity:0.5;"></div>
    <div style="position:fixed;z-index:1001;top:10%;left:50%;transform:translate(-50%, 0);padding:20px;background:#fff;border-radius:10px;text-align:center;">
        <div style="margin:0 0 4px 0;">${this.title}</div>
        <div style="margin:0 0 4px 0;"><input type="text" class="js_input" style="width:250px;"></div>
        <div>
            <button type="button" class="js_cancel" style="padding:3px 15px;border-radius:5px;border:1px solid #999;">취소</button>
            <button type="button" class="js_ok" style="padding:3px 15px;background:#ccc;border-radius:5px;border:1px solid #999;">확인</button>
        </div>
    </div>
</div>
`;
        if( !this.$prompt ){
            this.$prompt = $(html);
            $('body').append(this.$prompt);
        }
        return this;
    }

    binding(){
        this.$prompt.find('.js_ok').on('click', ()=>{
            var txt = this.$prompt.find('.js_input').val();
            this.fn_ok(txt);
            this.$prompt.hide();
        });

        this.$prompt.find('.js_cancel').on('click', ()=>{
            this.fn_cancel();
            this.$prompt.hide();
        });

        this.$prompt.find('.js_overlay').on('click', ()=>{
            this.$prompt.hide();
        });
    }
};
/* Ppom Prompt END */

//랜덤숫자
function random4DigitsSecure() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 10000).toString().padStart(4, '0');
}

/* 게시판 댓글 영역 */
var PpomCmtToolTip = new class {
    show(){
        $('#ppomppu_cmt_tooltip').show();
        //$('#ppomppu_cmt_tooltip').css('display', 'block !important');
    }

    hide(){
        $('#ppomppu_cmt_tooltip').hide();
        //$('#ppomppu_cmt_tooltip').css('display', 'none !important');
    }

    visible(){
        $('#ppomppu_cmt_tooltip').css('visibility', 'visible');
    }

    invisible(){
        $('#ppomppu_cmt_tooltip').css('visibility', 'hidden');
    }

    setHide24(){
        var now = new Date().getTime();
        localStorage.setItem('ppomppu_cmt_tooltip_hide', now + 24 * 60 * 60 * 1000);
    }

    isHide24(){
        var until = localStorage.getItem('ppomppu_cmt_tooltip_hide');
        var now = new Date().getTime();
        return until && now < until;
    }

    binding(){
        // show
    	if( this.isHide24() ) 	this.invisible();
    	else 					this.visible();

        // close
        $('#ppomppu_cmt_tooltip .js_close').live('click', (e)=>{
            this.setHide24();
            this.invisible();
        });
    }
};

$(document).ready(function(){
    // 뽐뿌 게시판
    if( typeof G_BBS_ID !== 'undefined' && G_BBS_ID == 'ppomppu' ){
        PpomCmtToolTip.binding();
    }
});
