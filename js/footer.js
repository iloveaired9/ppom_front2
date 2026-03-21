var title = typeof(G_TOOLBAR_TITLE) != 'undefined' ? G_TOOLBAR_TITLE : '';

/* Subject Preface START */
$(document).ready(function(){
    $('.subject_preface').on('click', function(e){
        e.preventDefault();
        var subject_preface = $(this).text().replace(/[\(\)\[\]]/g, '');
        var url = new URL(location.href);
        var id = url.searchParams.get('id');

        if( id == 'freeboard' ){
            location.href = '/new/bbs_list.php?id=' + id + '&category=2&subject_preface=' + encodeURIComponent(subject_preface);
        }else{
            location.href = '/new/bbs_list.php?id=' + id + '&subject_preface=' + encodeURIComponent(subject_preface);
        }
    });
});
/* Subject Preface END */

/* BBS List More START */
var BbsListMore = new class {
    constructor(){
    }

    init(options){
        this.isCall = false;
        this.page = options.page * 1;
        this.totalPage = options.totalPage * 1;
        this.sel_list_area = options.sel_list_area;
        this.sel_cur_page = options.sel_cur_page;
        this.sel_prev_btn = options.sel_prev_btn;
        this.sel_next_btn = options.sel_next_btn;
    }

    load(btn){
        if( this.isCall ) return;

        this.isCall = true;

        var urlObj = new URL(location.href);
        var page = this.page + 1;

        if( page < 1 ) page = 1;

        urlObj.searchParams.set('page', page);
        if( urlObj.searchParams.get('keyword') ){
            urlObj.searchParams.set('keyword', $('[name=keyword]').val());
        }

        var url = urlObj.toString();

        $.ajax({
            "url":url,
            "type":"get",
            "dataType":"html",
            "context":this,
        }).always(function(){
            this.isCall = false;

        }).done(function(res){
            $(this.sel_list_area).append( $(res).find(this.sel_list_area).html() );

            this.page = page;
            $(this.sel_cur_page).val(page);

            if( page > 1 ){
                $(this.sel_prev_btn).show();
            }else{
                $(this.sel_prev_btn).hide();
            }

            if( page < this.totalPage ){
                $(this.sel_next_btn).show();
            }else{
                $(this.sel_next_btn).hide();
                $(btn).hide();
            }

            window.history.replaceState(null, null, url);

            if( typeof(BbsListThumb) == 'object' ){
                BbsListThumb.pageLoad();
            }

        }).fail(function(err){
            console.log(err);
        });
    }

    beforeToView(obj){
        var urlObj = new URL(obj.href);
        var params = urlObj.searchParams;
        var id = params.get('id');
        var no = params.get('no');
        var fragment = "#" + id + "_" + no;
        var url = location.href.split('#')[0];
        window.history.replaceState(null, null, url + fragment);
    }

    scrollPosFix(){
        var fragment = location.href.split('#')[1];
        if( fragment && $('#'+fragment).length ){
            $(window).on('load', function(){
                $('html, body').animate({
                    scrollTop:$('#'+fragment).offset().top
                }, 100);
            });
        }
    }
};
/* BBS List More END */


/* BBS List Go START */
var BbsListGo = new class {
    constructor(){
    }

    init(options){
        this.isCall = false;
        this.page = options.page * 1;
        this.totalPage = options.totalPage * 1;
        this.sel_list_area = options.sel_list_area;
        this.sel_cur_page = options.sel_cur_page;
        this.sel_prev_btn = options.sel_prev_btn;
        this.sel_next_btn = options.sel_next_btn;
    }

    load(btn){
        if( this.isCall ) return;

        this.isCall = true;

        var urlObj = new URL(location.href);
        var page = this.page + 1;

        if( page < 1 ) page = 1;

        urlObj.searchParams.set('page', page);
        if( urlObj.searchParams.get('keyword') ){
            urlObj.searchParams.set('keyword', $('[name=keyword]').val());
        }

        var url = urlObj.toString();
        // this.sel_next_btn.click();

        $("a.next").click();
    }

    beforeToView(obj){
        var urlObj = new URL(obj.href);
        var params = urlObj.searchParams;
        var id = params.get('id');
        var no = params.get('no');
        var fragment = "#" + id + "_" + no;
        var url = location.href.split('#')[0];
        window.history.replaceState(null, null, url + fragment);
    }

    scrollPosFix(){
        var fragment = location.href.split('#')[1];
        if( fragment && $('#'+fragment).length ){
            $(window).on('load', function(){
                $('html, body').animate({
                    scrollTop:$('#'+fragment).offset().top
                }, 100);
            });
        }
    }
};
/* BBS List Go END */

/* BBS List/View Surfing START */
$(document).ready(function(){
    var urlObj = new URL(location.href);
    var total_page = typeof(G_TOTAL_PAGE) == 'undefined' ? 1 : G_TOTAL_PAGE;

    if( $.inArray(urlObj.pathname, ['/new/bbs_view.php', '/new/bbs_list.php','/new/pop_bbs.php','/new/pop_feed.php','/new/hot_comment.php','/new/all_bbs.php','/new/market_bbs.php','/new/my_comment_list.php','/new/my_write_list.php', '/new/market_bbs.php']) == -1 ){
        return;
    }

    urlObj.searchParams.delete('no');

    if( urlObj.pathname == '/new/bbs_view.php' ){
        urlObj.pathname = '/new/bbs_list.php';
    }

    $("input[id='cur_page']").focus(function() {    
        $(this).val("");
    }).on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();

            var move_page = $.trim($(this).val());
            if (!move_page || isNaN(move_page)) return;

            if (move_page < 1) move_page = 1;

            urlObj.searchParams.set('page', move_page);
            if( urlObj.searchParams.get('keyword') ){
                urlObj.searchParams.set('keyword', $('[name=keyword]').val());
            }
            document.location.href = urlObj.toString();
        }
    });

    $("a.prev").click(function(e) {
    	if ($(this).hasClass("off")) {
    	    e.preventDefault();
    	    return;
    	}

        e.preventDefault();
        var cur_page = $("input[id='cur_page']").val();
        if (isNaN(cur_page)) {
            alert('숫자만 입력해주세요');
            return false;
        }
        var move_page = (cur_page*1)-1;
        if (move_page < 1) move_page = 1;

        urlObj.searchParams.set('page', move_page);
        if( urlObj.searchParams.get('keyword') ){
            urlObj.searchParams.set('keyword', $('[name=keyword]').val());
        }
        document.location.href = urlObj.toString();
    });

    $("a.next").click(function(e) {
    	if ($(this).hasClass("off")) {
    	    e.preventDefault();
    	    return;
    	}

        e.preventDefault();
        var cur_page = $("input[id='cur_page']").val();
        if (isNaN(cur_page)) {
            alert('숫자만 입력해주세요');
            return false;
        }
        var move_page = (cur_page*1)+1;
		if (move_page < 1) move_page = 1;

        urlObj.searchParams.set('page', move_page);
        if( urlObj.searchParams.get('keyword') ){
            urlObj.searchParams.set('keyword', $('[name=keyword]').val());
        }
        document.location.href = urlObj.toString();
	});
});

$(document).ready(function(){
    var urlObj = new URL(location.href);
    var total_page = typeof(G_TOTAL_PAGE) == 'undefined' ? 1 : G_TOTAL_PAGE;

    if( $.inArray(urlObj.pathname, ['/new/bbs_view.php', '/new/bbs_list.php']) == -1 ){
        return;
    }

    urlObj.searchParams.delete('no');

    if( urlObj.pathname == '/new/bbs_view.php' ){
        urlObj.pathname = '/new/bbs_list.php';
    }

	function set_event(){
		$(".bbs").find("a").on("click",function(){
			var data = $(this).attr("href");

            if( typeof(data) == 'undefined' ){
                return;
            }

			if(data.indexOf("bbs_view.php") == -1){
				return ;
			}

			if($(this).data("event_add") == "true"){
				return;
			}

            if( $(this).parents('#bbs_inform').length ){
                return;
            }

            if( $(this).parents('#bbs_notice').length ){
                return;
            }

			data = data.split("?")[1];
			data = data.split("&");

			var submit_data = {};

			$.each(data, function(k,v){
				v_data = v.split("=");
				submit_data[v_data[0]] = v_data[1];
			});

			var last_data = document.location.href;
			var ori_id = "";
			last_data = last_data.split("?")[1];
			last_data = last_data.split("&");

			$.each(last_data, function(k,v){
				v_data = v.split("=");
				if(v_data[0] == "id"){
					ori_id = v_data[1];
				}
			});


			var is_keyword_pass = false;
			var custom_data = [];
			$.each(submit_data, function(k,v){
				if(k == "no")      return;
				if(k == "last_no") return;
				if(k == "keyword" ) {
					if( is_keyword_pass == false ){
						custom_data[custom_data.length] = k+"="+$('[name=keyword]').val();
					}
					return;
				}
				if(k == "id") {
					console.log('ori_id', ori_id);
					console.log('v', v);
					if(v == "sponsor" || v == "ppomppu8"){
						if( v != ori_id ) is_keyword_pass = true;
						v = ori_id;
					}
				}
				custom_data[custom_data.length] = k+"="+v;
			});

			var body_top = $(document).scrollTop();
			var v_top = $(this).offset().top;

			var scroll_add = v_top - body_top;

			if(
				(navigator.userAgent.toLowerCase().indexOf("safari") != -1
			&& navigator.userAgent.toLowerCase().indexOf("chrome") == -1 )
			 ||
			( navigator.userAgent.toLowerCase().indexOf("ppombrowser") != -1
			&& navigator.userAgent.toLowerCase().indexOf("ios") != -1 )
			){
				scroll_add -= 150;
			}

			custom_data[custom_data.length] = "#"+submit_data['no']+","+scroll_add;
			replace_url = custom_data.join("&");

			$("input[id='cur_page']").val(submit_data['page']);

			window.history.replaceState({}, '',"/new/bbs_list.php?"+replace_url);

			$(this).data("event_add","true");
		});
	}

	set_event();

	(function(){
		if(document.location.href.indexOf("#") == -1){
			return;
		}
		var no = document.location.href.split("#")[1].split(",");
		var scroll_add = no[1];
		no = no[0];


		var scroll_expire=false;
		$.each($(".bbs").find("a"), function(k,v){
			
			if ( scroll_expire ) return ;
			
			var data = $(v).attr("href");

            if( typeof(data) == 'undefined' ){
                return;
            }

			if(data.indexOf("bbs_view.php") == -1){
				return ;
			}

			data = data.split("?")[1];
			data = data.split("&");

			var submit_data = {};

			$.each(data, function(k,v){
				v_data = v.split("=");
				submit_data[v_data[0]] = v_data[1];
			});

			if(submit_data['no'] == no){

				scroll_expire = true;
				
				if(!submit_data['page']){
					submit_data['page'] = 1;
				}

				history.scrollRestoration = "manual";
				setTimeout(function(){
					$([document.documentElement, document.body]).animate({
						scrollTop: $(v).offset().top-scroll_add
					}, 0);
				},10);				
			}
		});
	})();

	$(".bbs").find(".add_btn").on("click", function(){

		var list_more_mode = G_MOBILE_LIST_MORE_MODE;

		if( list_more_mode == 'next' ){
			$("a.next").click();
			return;
		}

		var object = $(this);

		if(object.data("loading") == "true"){
			return;
		}

		var google_ad_type = G_IS_ADULT_ARTICLE ? '19' : '';


		var last_data = $(this).prev().find("a").attr("href");
		if($(this).prev().prop('tagName') != "LI"){
			last_data = $(this).prev().prev().find("a").attr("href");
		}
		last_data = last_data.split("?")[1];
		last_data = last_data.split("&");

		var submit_data = {};

		$.each(last_data, function(k,v){
			v_data = v.split("=");
			submit_data[v_data[0]] = v_data[1];
		});
		submit_data['page']++;
		submit_data['last_no'] = submit_data['no'];

		submit_data['google_ad_type'] = google_ad_type;
		submit_data['ad_use']         = object.data("ad_use") ? object.data("ad_use") : 0;
		// submit_data['ad_use']         =1;

		$("input[id='cur_page']").val(submit_data['page']);

		object.data("loading","true");


		$.ajax({
			method:"get",
			data:submit_data,
			dataType:"html",
			url:"/new/_ajax_bbs_list.php",
			success:function(data){
				//console.log(data);

				object.data("loading","");

				if(data == ""){
					$(object).hide();
					return;
				}

				object.before(data);

                if( G_USE_BBS_LIST_CLICK_EVENT ){
                    if(bbs_list_click_event_setting){
                        bbs_list_click_event_setting(get_cookie('mode') == 'save' ? true : false);
                    }
                }

				if(object.data("ad_use") <= "2" || !object.data("ad_use")){
                    if( G_IS_ADULT_BBS ){
                        object.before('<div class="sect0 sect-cmt" style="clear: both;"><center><iframe id="if_ad26" src="/banner/google_ad.html?pos=26&gb=first&type=19" scrolling="no" border="0" marginwidth="0" marginheight="0" frameborder="0" width="320px" height="100px"></iframe></center></div>');
                    }else if( !G_IS_GOOGLE_AD_NON_IFRAME_OPEN ){
                        object.before('<div class="sect0 sect-cmt" style="clear: both;"><center><iframe id="if_ad26" src="/banner/google_ad.html?pos=26&gb=first" scrolling="no" border="0" marginwidth="0" marginheight="0" frameborder="0" width="320px" height="100px"></iframe></center></div>');
                    }
					if( !object.data("ad_use") ){
						object.data("ad_use",1);
					}
					object.data("ad_use",object.data("ad_use")+1);
				} else {
					if( !object.data("ad_use") ){
						object.data("ad_use",1);
					}
                    if( G_IS_ADULT_BBS ){
                        object.before('<div class="sect0 sect-cmt" style="clear: both;"><center><iframe id="if_ad7" src="/banner/google_ad.html?pos=7&gb=first&type=19" scrolling="no" border="0" marginwidth="0" marginheight="0" frameborder="0" width="336px" height="280px"></iframe></center></div>');
                    }else if( !G_IS_GOOGLE_AD_NON_IFRAME_OPEN ){
                        object.before('<div class="sect0 sect-cmt" style="clear: both;"><center><iframe id="if_ad7" src="/banner/google_ad.html?pos=7&gb=first" scrolling="no" border="0" marginwidth="0" marginheight="0" frameborder="0" width="336px" height="280px"></iframe></center></div>');
                    }
					object.data("ad_use",object.data("ad_use")+1);
				}

				var custom_data = [];
				$.each(submit_data, function(k,v){
					if(k == "no") return;
					if(k == "last_no") return;
					if(k == "ad_use") return;
					if(k == "google_ad_type") return;
					if(k == "keyword") {
						custom_data[custom_data.length] = k+"="+$('[name=keyword]').val();
						return;
					}
					custom_data[custom_data.length] = k+"="+v;
				});
				replace_url = custom_data.join("&");

				window.history.replaceState({}, '',"/new/bbs_list.php?"+replace_url);

				set_event();

				if(submit_data['page'] >= total_page){
					$(".bbs").find(".add_btn").hide();					
					$("#paging_menu").find(".next").removeClass('on');
				}

                // BbsListThumb 는 m_footer.php 에 위치
                if (typeof BbsListThumb !== 'undefined' && BbsListThumb.pageLoad) BbsListThumb.pageLoad();
			},
			error:function(){
				object.data("loading","");
				alert("통신이 원활하지 않습니다 다시 시도해주세요.");
			}
		});
	});

	(function(){
		var last_data = $(".bbs").find(".add_btn").prev().find("a").attr("href");
        if( typeof(last_data) == 'undefined' ){
            return;
        }

		if($(".bbs").find(".add_btn").prev().prop('tagName') != "LI"){
			last_data = $(".bbs").find(".add_btn").prev().prev().find("a").attr("href");
		}
		last_data = last_data.split("?")[1];
		last_data = last_data.split("&");

		var submit_data = {};

		$.each(last_data, function(k,v){
			v_data = v.split("=");
			submit_data[v_data[0]] = v_data[1];
		});
		//submit_data['page']++;
		// console.log(total_page +" => " +submit_data['page'])
		if(submit_data['page'] >= total_page){
			$(".bbs").find(".add_btn").hide();
		}
	})();

    if( G_USE_BBS_LIST_CLICK_EVENT ){
        if(bbs_list_click_event_setting){
            bbs_list_click_event_setting(get_cookie('mode') == 'save' ? true : false);
        }
    }

});
/* BBS List/View Surfing END */

/* BBS List Bottom Navigation START */
var BbsListBottomNavi = new class {
    constructor(){
    }

    init(options){
        this.sel_right_button = options.sel_right_button;
        this.sel_left_button = options.sel_left_button;
        this.sel_paging_menu = options.sel_paging_menu;
        this.sel_cur_page = options.sel_cur_page;
        
        this.bindEvents();
    }
    
    bindEvents(){
        var self = this;

        // 포커스 시 값 비우기
        $(this.sel_cur_page).on('focus', function(){
            $(this).val('');
        });

        // 엔터키 입력 시 페이지 이동
        $(this.sel_cur_page).on('keydown', function(e){
            if (e.key === 'Enter') {
                e.preventDefault();

                var page = parseInt($(this).val(), 10);

                if (isNaN(page) || page < 1) {
                    alert('올바른 페이지 번호를 입력해주세요.');
                    return;
                }

                self.moveToPage(page);
            }
        });
    }

    toLeft(){
        set_cookie('m_button', 'right', 365);

        $(this.sel_right_button).show();
        $(this.sel_left_button).hide();
        $(this.sel_paging_menu).css({'text-align':'left'});
    }

    toRight(){
        set_cookie('m_button', 'left', 365);

        $(this.sel_right_button).hide();
        $(this.sel_left_button).show();
        $(this.sel_paging_menu).css({'text-align':'right', 'padding-left':'10px'});
    }

    movePage(direction){
        var queryString = document.location.search;

        if( direction == 'next' ){
            var page = $(this.sel_cur_page).val() * 1 + 1;
        }else if( direction == 'prev' ){
            var page = $(this.sel_cur_page).val() * 1 - 1;
        }else{
            retrun;
        }

        if( page < 1 ) page = 1;

        if( queryString.search(/([?&])page=[0-9]*/) > -1 ){
            queryString = queryString.replace(/([?&])page=[0-9]*/, '$1page='+page);
        }else if( queryString ){
            queryString += '&page='+page;
        }else{
            queryString = '?page='+page;
        }

        document.location.href = queryString;
    }
    
    moveToPage(page){
        var queryString = document.location.search;

        if (queryString.search(/([?&])page=\d+/) > -1) {
            queryString = queryString.replace(/([?&])page=\d+/, '$1page=' + page);
        } else if (queryString) {
            queryString += '&page=' + page;
        } else {
            queryString = '?page=' + page;
        }

        document.location.href = queryString;
    }

    nextPage(){
        this.movePage('next');
    }

    prevPage(){
        this.movePage('prev');
    }
};

function getCookie(name) {
	var from_idx = document.cookie.indexOf(name+'=');
	if (from_idx != -1) {
		from_idx += name.length + 1
		to_idx = document.cookie.indexOf(';', from_idx)
	if (to_idx == -1) {
		to_idx = document.cookie.length
	}
		return unescape(document.cookie.substring(from_idx, to_idx))
	}
}
function setCookie(cookieName, cookieValue){
    var expires = 31;
    var nType = 'number';
    if (expires && (typeof expires == nType) || expires.toUTCString) {
        var date = null;
        if (typeof expires == nType) {
            date = new Date();
            date.setTime(date.getTime() + (expires * 31 * 24 * 60 * 60 * 1000));
        }
        else {
            date = expires;
        }
         expires = '; expires=' + date.toUTCString();
    }
    cookieValue = cookieValue.replace("@", "%40");
    cookieValue = cookieValue.replace(":", "%3A");
    document.cookie = cookieName + "=" + cookieValue + "; path=/; expires=" + expires + ";";
}
function init_button()
{
	//쿠키가 없으면 버튼 왼쪽이 기본값
	if (get_cookie("m_button")!='left' && get_cookie("m_button")!='right'){
		set_cookie('m_button', "left", 365);
	}
	change_button();
}
function change_button(c_flag)
{
	if (c_flag=='left'){
		set_cookie('m_button',"left",365);
	}else if(c_flag=='right'){
		set_cookie('m_button',"right",365);
	}

	if (get_cookie("m_button")=='left'){
        $('#right_button').hide();
        $('#left_button').show();        
	} else if (get_cookie("m_button") == 'right'){
        $('#right_button').show();
        $('#left_button').hide();        
	}
}

$(document).ready(function(){
    init_button();
});
/* BBS List Bottom Navigation END */

/* Biz Partner Skin START */
var BizPartnerSkin = new class{
    constructor(){
        this.skin = '';
    }

    init(selector, data){
        this.selector = selector;
        this.data = data;
    }

    toggle(){
        switch( this.skin ){
            case 'nothumb': this.drawSkinPpomppu(); break;
            case 'ppomppu': this.drawSkinNothumb(); break;
        }
    }

    drawSkinNothumb(){
        this.skin = 'nothumb';

        var html = `<li class="top_name" style="padding:0;"><span style="background:#efefef;padding:1px 6px;display:inline-block;border:1px solid #ccc;border-bottom:0;">비즈파트너</span></li>`;
        if( get_cookie('mode') == 'save' ){
            html = `<li class="top_name" style="padding:0;"><span style="background:#171717;padding:1px 6px;display:inline-block;border:1px solid #606060;border-bottom:0;">비즈파트너</span></li>`;
        }

        for( var i = 0, c = this.data.length; i < c; i++ ){
            var row = this.data[i];
            var li_style = i == 0 ? 'border-top:1px solid #ccc;' : '';
            var cmt_html = '';
            var cate1_name_html = '';
            var down_cnt_html = '';
            var vote_html = '';

            if( row['cmt_cnt'] > 0 ) cmt_html = `<span class="rp">${row['cmt_cnt']}</span>`;

            if( row['cate1_name'] ) cate1_name_html = '['+row['cate1_name']+'] ';

            if( row['down_cnt'] > 0 ) down_cnt_html = '-'+row['down_cnt'];

            if( row['up_cnt'] > 0 || row['down_cnt'] > 0 ){
                vote_html = `<span class="rec blue"><img src="${G_CDN_URL}/images/m_icon_like_blue_new.png" alt="추천">${row['up_cnt']}${down_cnt_html}</span>`;
            }

            html += `
<li class="hybrid-skin-li new_sk off none ${row['li_class']}" style="${li_style}">
    <a class="noeffect" href="${row['href']}">
        <div class="thumb_sec">
            <strong style="${row['subject_style']}">${row['icon_all']}${row['subject']}${cmt_html}</strong>
            <span class="times"><time>${row['reg_date']}</time> | <span class="rec_view"><span class="view"><img src="/images/icon_view.png" alt="조회수">${row['view_cnt']}</span></span>${vote_html}</span><span class="hi"></span>
            <span class="names">${cate1_name_html}${row['nick']}</span>
        </div>
    </a>
</li>`;
        }

        $(this.selector).removeClass('bbsList_new').addClass('bbsList').html( html );
    }

    drawSkinPpomppu(){
        this.skin = 'ppomppu';

        var html = `<li class="top_name"><span style="background:#efefef;padding:1px 6px;display:inline-block;border:1px solid #ccc;border-bottom:0;">비즈파트너</span></li>`;
        if( get_cookie('mode') == 'save' ){
            html = `<li class="top_name" style="padding:0;"><span style="background:#171717;padding:1px 6px;display:inline-block;border:1px solid #606060;border-bottom:0;">비즈파트너</span></li>`;
        }

        for( var i = 0, c = this.data.length; i < c; i++ ){
            var row = this.data[i];
            var li_style = i == 0 ? 'border-top:1px solid #ccc;' : '';
            var cmt_html = '';
            var cate1_name_html = '';
            var down_cnt_html = '';
            var vote_html = '';

            if( row['cmt_cnt'] > 0 ) cmt_html = `<span class="rp">${row['cmt_cnt']}</span>`;

            if( row['cate1_name'] ) cate1_name_html = '['+row['cate1_name']+'] ';

            if( row['down_cnt'] > 0 ) down_cnt_html = '-'+row['down_cnt'];

            if( row['up_cnt'] > 0 || row['down_cnt'] > 0 ){
                vote_html = `<span class="recs blue"><img src="${G_CDN_URL}/images/m_icon_like_blue_new.png" alt="추천">${row['up_cnt']}${down_cnt_html}</span>`;
            }

            html += `
<li class="none-border bbs_list_thumbnail new_sk ${row['li_class']}" style="${li_style}">
    <a href="${row['href']}" class="list_b_01n">
        <div class="thmb_N"><img src="${row['thumb_url']}" onerror="this.src='${row['no_img_url']}'" border="0"></div>
        <div class="thmb_N2">
            <ul>
                <li class="title">
                    <span class="cont" style="${row['subject_style']}">${row['subject']}</span>${cmt_html}
                </li>
                <li class="exp">
                    <time class="">${row['reg_date']}</time>
                    <small class="ty"> | </small>
                    <span class="rec_view">
                        <span class="view"><img src="/images/icon_view.png" alt="조회수">${row['view_cnt']}</span>
                        ${vote_html}
                    </span>
                    <span class="ty"></span>
                </li>
                <li class="names">${cate1_name_html}${row['nick']}</li>
            </ul>
        </div>
    </a>
</li>`;
        }

        $(this.selector).removeClass('bbsList').addClass('bbsList_new').html( html );
    }
};
/* Biz Partner Skin END */

/* BBS List Thumb START */
var BbsListThumb = new class {
    constructor(){
        this.urlObj = new URL(location.href);
        this.lastIdx = -1;
        this.isFeed = 0;
        this.data = this.get();

        var id = this.urlObj.searchParams.get('id');
        var pathName = this.urlObj.pathname;

        if( id ){
            this.key = id;
        }else if( pathName == '/new/all_bbs.php' ){
            this.key = 'p_all_pop';
        }else if( pathName == '/new/pop_bbs.php' ){
            this.key = 'p_all_pop';
            this.isFeed = 1;
        }else if( pathName == '/new/pop_feed.php' ){
            this.key = 'p_all_pop';
            this.isFeed = 1;
        }else if( pathName == '/new/all_news.php' ){
            this.key = 'p_all_news';          
        }else{
            this.key = '';
        }

        if( this.data.indexOf(this.key) > -1 ){
            this.onoff = 'on';
        }else{
            this.onoff = 'off';
        }
    }

    pageLoad(){
        if( typeof G_USE_FEED != 'undefined' && G_USE_FEED && this.isFeed ){
            if( this.onoff == 'off' ){
                this.feedOff();
                return;
            }else{
                this.feedOn();
                return;
            }
        }else{
            if( this.onoff == 'off' ){
                this.off();
                return;
            }else{
                this.on();
                return;
            }
        }
    }

    toggle(){
        if( typeof G_USE_FEED != 'undefined' && G_USE_FEED && this.isFeed ){
            if( this.onoff == 'off' ){
                this.add(this.key);
                this.feedOn();
                return;
            }else{
                this.del(this.key);
                this.feedOff();
                return;
            }
        }else{
            this.lastIdx = -1;
            if( this.onoff == 'off' ){
                this.add(this.key);
                this.on();
                return;
            }else{
                this.del(this.key);
                this.off();
                return;
            }
        }
    }

    on(){
        $('#bbs_list_thumb_toggle_btn').addClass('on');
        if( this.lastIdx >= 0 ){
            $('.hybrid-skin-li.new_sk:gt(' +this.lastIdx+ ')').removeClass('none');
            $('.hybrid-skin-li.new_sk:gt(' +this.lastIdx+ ')').each(function(){
                if( $(this).find('.thumb_img').data('bg_url') ){
                    $(this).removeClass('off');
                }else{
                    $(this).addClass('off');
                }
            });
        }else{
            $('.hybrid-skin-li.new_sk').removeClass('none');
            $('.hybrid-skin-li.new_sk').each(function(){
                if( $(this).find('.thumb_img').data('bg_url') ){
                    $(this).removeClass('off');
                }else{
                    $(this).addClass('off');
                }
            });
        }

        this.onoff = 'on';
        this.lastIdx = $('.hybrid-skin-li.new_sk').length - 1;

        if( typeof G_USE_FEED != 'undefined' && G_USE_FEED ){
            $("a[href$='/new/hot_bbs.php']").attr('href', '/new/pop_feed.php');
            $("a[href$='/new/pop_bbs.php']").attr('href', '/new/pop_feed.php');
        }
    }

    off(){
        $('#bbs_list_thumb_toggle_btn').removeClass('on');
        if( this.lastIdx >= 0 ){
            $('.hybrid-skin-li.new_sk:gt(' +this.lastIdx+ ')').addClass('none').addClass('off');
        }else{
            $('.hybrid-skin-li.new_sk').addClass('none').addClass('off');
        }

        this.onoff = 'off';
        this.lastIdx = $('.hybrid-skin-li.new_sk').length - 1;

        if( typeof G_USE_FEED != 'undefined' && G_USE_FEED ){
            $("a[href$='/new/pop_feed.php']").attr('href', '/new/pop_bbs.php');
        }
    }

    feedOn(){
        if( this.urlObj.pathname != '/new/pop_feed.php' ){
            this.urlObj.pathname = '/new/pop_feed.php';
            location.replace(this.urlObj.href);
        }
    }

    feedOff(){
        if( this.urlObj.pathname != '/new/pop_bbs.php' ){
            this.urlObj.pathname = '/new/pop_bbs.php';
            location.replace(this.urlObj.href);
        }
    }

    isFeedOn(){
        return typeof G_USE_FEED != 'undefined' && G_USE_FEED && this.data.indexOf('p_all_pop') > -1;
    }

    add(key){
        var data = this.get();
        data.push(key);
        this.set(data);
    }

    del(key){
        var data = this.get();
        var idx = data.indexOf(key);
        if( idx > -1 ){
            data.splice(idx, 1);
            this.set(data);
        }
    }

    get(){
        if( typeof this != 'undefined' && 
            this != null &&
            (this.key === 'p_all_pop' || !this.key) && 
            typeof this.beforeGet === 'function')
        {
            this.beforeGet();
        }

        if( localStorageAvailable() ){
            var data = window.localStorage.getItem('bbs_list_thumb_on') || '';
        }else{
            var data = get_cookie('bbs_list_thumb_on') || '';
        }
        data = data.split('|');
        data.filter(function(item, index){ data.indexOf(item) === index; });

        return data;
    }

    set(data){
        data.filter(function(item, index){ data.indexOf(item) === index; });
        data = data.join('|');

        if( typeof this != 'undefined' &&
            this != null &&
            (this.key === 'p_all_pop' || !this.key) &&
            typeof this.beforeSet === 'function')
        {
            this.beforeSet(data);
        }

        if( localStorageAvailable() ){
            window.localStorage.setItem('bbs_list_thumb_on', data);
        }else{
            set_cookie('bbs_list_thumb_on', data, 9999);
        }
    }

    beforeGet(){
        // ppombrowser_bbs_list_thumb_on 과 bbs_list_thumb_on 의 상태가 다른 경우,
        //   bbs_list_thumb_on 의 신규 상태는 ppombrowser_bbs_list_thumb_on 상태로 바꾼다.
        if ( typeof is_PPOMBrowser != 'function' ){
            console.error("assert error. typeof is_PPOMBrowser != function");
            return;
        }
        const android_minimum_version = "3.1.7";
        const ios_minimum_version = "1.6.5";
        if( !is_PPOMBrowser(android_minimum_version, ios_minimum_version) ||
            (this.key != 'p_all_pop' && this.key) ) 
        {
            console.log("beforeGet skip.");
            return;
        }
        const LITERAL__PPOMBROWSER_BBS_LIST_THUMB_ON = 'ppombrowser_bbs_list_thumb_on';
        const LITERAL__BBS_LIST_THUMB_ON = 'bbs_list_thumb_on';
        const LITERAL__P_ALL_POP = 'p_all_pop';

        const isLocalStorageAvailable = localStorageAvailable();

        const has_p_all_pop_in_ppombrowser_bbs_list_thumb_on = 
            (get_cookie(LITERAL__PPOMBROWSER_BBS_LIST_THUMB_ON) || '')
                .split('|')
                .includes(LITERAL__P_ALL_POP);
        const mRaw = isLocalStorageAvailable ? 
            (window.localStorage.getItem(LITERAL__BBS_LIST_THUMB_ON) || '') :
            (get_cookie(LITERAL__BBS_LIST_THUMB_ON) || '');
        const mArr = mRaw.split('|');
        const has_p_all_pop_in_bbs_list_thumb_on = mArr.includes(LITERAL__P_ALL_POP);
        if ( has_p_all_pop_in_bbs_list_thumb_on === has_p_all_pop_in_ppombrowser_bbs_list_thumb_on ) {
            // CASE1. 싱크가 맞는 경우. 상태 변경 안하고 return.
            console.log("sync ok.");
            return;
        }

        // CASE2. ppombrowser_bbs_list_thumb_on 쿠키는 p_all_pop 이 on 상태이지만, bbs_list_thumb_on 에서는 off 인 경우
        //   bbs_list_thumb_on 상태를 on 으로 변경
        //   assert !has_p_all_pop_in_bbs_list_thumb_on
        // CASE3. ppombrowser_bbs_list_thumb_on 쿠키는 p_all_pop 이 off 상태이지만, bbs_list_thumb_on 에서는 on 인 경우
        //   bbs_list_thumb_on 상태를 off 으로 변경
        //   assert has_p_all_pop_in_bbs_list_thumb_on
        //   assert !has_p_all_pop_in_ppombrowser_bbs_list_thumb_on
        const mNewArr = has_p_all_pop_in_ppombrowser_bbs_list_thumb_on ? 
            mArr.concat(LITERAL__P_ALL_POP) :
            mArr.filter(function(el){ return el != LITERAL__P_ALL_POP; });
        
        const mJoined = mNewArr.join('|');

        if( isLocalStorageAvailable ){
            window.localStorage.setItem( LITERAL__BBS_LIST_THUMB_ON, mJoined );
        }else{
            set_cookie( LITERAL__BBS_LIST_THUMB_ON, mJoined, 9999);
        }
    }

    beforeSet(data_string){
        // ppombrowser_bbs_list_thumb_on 쿠키 상태를 업데이트 한다.
        //   data_string 에 'p_all_pop' 이 존재한다면, "|p_all_pop" 값으로 업데이트한다.
        //   존재하지않는다면, "|" 값으로 업데이트한다. 
        if ( typeof is_PPOMBrowser != 'function' ){
            console.error("assert error. typeof is_PPOMBrowser != function");
            return;
        }
        const android_minimum_version = "3.1.7";
        const ios_minimum_version = "1.6.5";
        if( !is_PPOMBrowser(android_minimum_version, ios_minimum_version) || 
            (this.key != 'p_all_pop' && this.key) ) 
        {
            console.log("beforeSet skip.");
            return;
        }
        const LITERAL__PPOMBROWSER_BBS_LIST_THUMB_ON = 'ppombrowser_bbs_list_thumb_on';
        const LITERAL__P_ALL_POP = 'p_all_pop';
        const has_p_all_pop = data_string.split('|').includes(LITERAL__P_ALL_POP);
        const ppomCookieValue = has_p_all_pop ? "|"+LITERAL__P_ALL_POP : '|';
        set_cookie(LITERAL__PPOMBROWSER_BBS_LIST_THUMB_ON, ppomCookieValue, 9999);
    }

};

$(document).ready(function(){
    if( G_USE_BBS_LIST_THUMB ){
        // 페이지 로드시 (더보기 동작은 bbs_list.php 에 위치)
        BbsListThumb.pageLoad();

        // 버튼 클릭시
        $('#bbs_list_thumb_toggle_btn').on('click', function(){
            BbsListThumb.toggle();
            BizPartnerSkin.toggle();
        });
    }

    if( BbsListThumb.isFeedOn() ){
        $("a[href$='/new/hot_bbs.php']").attr('href', '/new/pop_feed.php');
        $("a[href$='/new/pop_bbs.php']").attr('href', '/new/pop_feed.php');
    }
});
/* BBS List Thumb END */

/* PpomCoupon START */
function drawCouponPopup(){
    var html = `
<div class="popup_secret_section" id="">
    <div class="popup_secret_section_view" id="">
        <h2>뽐쿠폰 선물<span class="del_ico"></span></h2>
        <div class="profile_box">
            <p class="dear">받는사람</p>
            <span class="profile_photo"></span><span class="profile_nick_name"></span>
        </div>
        <form name="pass_popup">
        <input type="hidden" name="mod" value="pass" />
        <input type="hidden" name="member_no" value=""/>
        <input type="hidden" name="pop_security_code" id="pop_security_code" value=""/>
        <input type="hidden" name="pop_security_method" id="pop_security_method" value=""/>
        <ul>
            <li class="gift_numbs">선물할 쿠폰수</li>
            <li class="gift_coupon_num"><input type="number" min="1" name="amount" placeholder="정수로만 입력 가능합니다.(소수점불가)"></input></li>
            <li class="select"><span class="secret_numb on"  id="pop_security_method1">보안번호</span><i class="wall_mark"></i><span class="select_btns otp" id="pop_security_method2">Google OTP</span></li>
            <li class="secret_numb_box">
            <input type="password" maxlength="1" class="secret-num" id="secret_num1"></input>
            <input type="password" maxlength="1" class="secret-num" id="secret_num2"></input>
            <input type="password" maxlength="1" class="secret-num" id="secret_num3"></input>
            <input type="password" maxlength="1" class="secret-num" id="secret_num4"></input>
            </li>
            <li class="otp_box"><input type="number" id="opt_num" maxlength="6"></input></li>
            <li class="setting tip_A"><span class="secret">- 보안번호 설정</span><a href="https://m.ppomppu.co.kr/new/bbs_view.php?id=notice&no=918"><i class="tip_mark">!</i></a></li>
            <li class="setting tip_B"><span class="otpset">- Google OTP 설정</span><a href="https://m.ppomppu.co.kr/new/bbs_view.php?id=notice&no=918"><i class="tip_mark">!</i></a></li>
            <li class="gift_numbs msg">메세지 입력<textarea name="pop_ppomcoupon_msg"></textarea></li>
            <li class="send_gift on"><span class="gift_btn" id="pass_confirm_btn">선물하기</span></li>
        </ul>
        </form>
    </div>
</div>
    `;

    if( $('#coupon-popup').text() == '' ){
        $('#coupon-popup').html(html);
    }
}

function openLayer(layername, enc_member_no){
    if(layername == 'coupon_gift'){
        drawCouponPopup();

        document.forms['pass_popup'].member_no.value = enc_member_no;
        set_profile_image();

        document.getElementById('coupon-popup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        $("#popupMemberInfo").css("z-index", "15");
    }
}

function pass_ppom_coupon(){
    var params = $("#coupon-popup form[name='pass_popup']").serialize();
    $.ajax({
        type: "POST",
        data: params,
        dataType: "json",
        url: (G_IS_MOB ? '/new' : '')+"/coupon/ppom_coupon_ajax.php",
        success: function(data) {

            alert(data.msg);

            $('#overlay').hide();
            $('#coupon-popup').hide();

           }
    });
}

function autofocus(formSelector, nextFocus) {
    function validCheck(rulename, val) {
        var isValid = true;
        switch(rulename) {
            case 'number':
            var re = /[^0-9]/g;
            isValid = !re.test(val);
                break;
        }
        return isValid;
    }
    var $inputs = $(formSelector);
    $inputs.each(function(idx) {
        var $input = $(this);
        $input.on('keyup', function(e) {
            var val = $input.val();
            if(!validCheck($input.data('valid'), val)) {
                $input.val(val.substring(0, val.length - 1));
                return;
            }
            if(parseInt($input.attr('maxlength')) == val.length) {
                //$input.off('keyup'); //이벤트 삭제
                if(idx + 1 < $inputs.length) {
                    $inputs[idx + 1].focus(); //다음 요소에 포커스
                }
                else {
                    if(nextFocus)
                    $(nextFocus).focus();
                }
            }
        });
    }).on('focus', function(e) {
        $(this).val(''); //포커스 들어갈때 초기화
    });
}

function set_profile_image()
{
    $("input[name='amount']").val('');
    $("#secret_num1").val('');
    $("#secret_num2").val('');
    $("#secret_num3").val('');
    $("#secret_num4").val('');
    $("#opt_num").val('');
    $("#pop_security_method1").trigger("click");

    member_no = $("input[name='member_no']",$("form[name='pass_popup']")).val();
    var urlencoded_member_no = encodeURIComponent(member_no);
    var params = "mod=getUserName&member_no="+urlencoded_member_no;
    $.ajax({
        type: "POST",
        data: params,
        dataType: "json",
        url: (G_IS_MOB ? '/new' : '')+"/coupon/ppom_coupon_ajax.php",
        success: function(data) {
            if(data.flag == true){
                $(".profile_photo").css({"background":"url("+data.icon+")"});
                $(".profile_nick_name").text(data.name);
            }
        }
    });
}

$(document).ready(function(){
    $('#coupon-popup').on('click', '#pass_confirm_btn', function(){
        var pass_amount = $("input[name='amount']",$("form[name='pass_popup']")).val();
        var pass_name = $(".profile_nick_name").text();
        if (pass_amount <= 0) {
            alert("정확한 수량을 입력해주세요.");
            return;
        }

        pop_security_method = $("#pop_security_method").val();
        if ( pop_security_method == 1)
        {
            security_code = $("#secret_num1").val()+$("#secret_num2").val()+$("#secret_num3").val()+$("#secret_num4").val();
            $("#pop_security_code").val(security_code);
        }
        else
        {
        	security_code = $("#opt_num").val();
            $("#pop_security_code").val(security_code);
        }

        if ( security_code == "" )
        {
            alert('보안번호(또는 구글OTP)를 입력해주세요.');
            return;
        }


        if( confirm(pass_name+"님께 "+pass_amount+"매를 선물하시겠습니까?") ){
            pass_ppom_coupon();
        }else{
            $('#overlay').hide();
            $('#coupon-popup').hide();
        }
    });

    $(document).on('click', '#overlay, .del_ico', function(e) {
    	e.preventDefault();
    	e.stopPropagation();
        $('#overlay').hide();
        $('#coupon-popup').hide();
    });

    autofocus('input[type="password"].secret-num', '#pass_confirm_btn'); //화면에서 호출

    $('#coupon-popup').on('click', "#pop_security_method1", function(){
    	$("#pop_security_method1").addClass("on");
    	$("#pop_security_method2").removeClass("on");
    	$(".secret_numb_box").show();
    	$(".otp_box").hide();
    	$(".setting.tip_A").show();
    	$(".setting.tip_B").hide();
    	$("#pop_security_method").val('1');
    	$("#pop_security_code").val('');
    	$("#secret_num1").val('');
    	$("#secret_num2").val('');
    	$("#secret_num3").val('');
    	$("#secret_num4").val('');
    });

    $('#coupon-popup').on('click', "#pop_security_method2", function(){
    	$("#pop_security_method1").removeClass("on");
    	$("#pop_security_method2").addClass("on");
    	$(".secret_numb_box").hide();
    	$(".otp_box").show();
    	$(".setting.tip_A").hide();
    	$(".setting.tip_B").show();
    	$("#pop_security_method").val('2');
    	$("#pop_security_code").val('');
    	$("#opt_num").val('');
    });
});

$(window).ready(function() {
    $(".secret_numb_box").show();
    $(".otp_box").hide();
    $(".setting.tip_B").hide();
});
/* PpomCoupon END */

/* Layout Popup START */
function drawMemberInfo(){
    var html_member_block = ``;
    var html_nickname_search = ``;

    if( G_USE_MEMBER_CONTENT_BLOCK ){
        html_member_block = `
<li class="user_info_list" id="mcb_i" style="">
    <div>
        <span class="u_id">회원차단</span><!--
        --><span><!--
            --><span ><span class=""><input type="text" id="mcb_reason" placeholder="사유입력" value="" maxlength="150" onkeyup="setMaxLength(this);"></span><span class="mod_memo_btn"><a href="javascript:;" onclick="setMemberContentData();">등록</a></span></span><!--
        --></span>
        <span class="u_l"></span>
    </div>
</li>
<li class="user_info_list" id="mcb_v" style="">
    <div>
        <span class="u_id">회원차단</span><span class="write">적용중: <span id="mcb_date"></span></span><span class="mod_memo_btn on"><a href="javascript:;" onclick="delMemberContentData();">해제</a></span><span class="u_l"></span>
        <div class="block_reason">사유: <span id="reason"></span></div>
    </div>
</li>
        `;
    }

    if( G_BBS_ID ){
        html_nickname_search = `
--><span class="user_btn pop03"><a href="#"><img src="`+G_CDN_URL+`/images/mempop_03.svg"></a><b>닉네임검색</b></span><!--
        `;
    }

    var html = `
<div class="bg"></div>
<div id="memberInfo" class="user_info_p" style="margin-top:5vh;">
    <ul>
        <li class="user_info_title"><span>회원정보</span><span class="u_c" onclick="$('#popupMemberInfo').hide();">닫기</span></li>
        <li class="user_info_list">
            <span class="u_id">아이디</span><span name='u_id'></span><span class="u_l"></span></li>
        <li class="user_info_list">
            <span class="u_id">닉네임</span><span name='u_name'></span><span class="u_l"> | </span><span class="u_i_s">레벨 <img name='u_level' src=""></span></li>
        <li class="user_info_list">
            <span class="u_id">가입일</span><span class="" name='u_reg_date'></span></li>
        <li class="user_info_list">
            <span class="u_id">실명확인</span><span class="u_id_btn"><input type="text" name='input_name'> <a id="check-name-btn" href="javascript:;" onclick="">확인</a></span>
            <span class="u_i_s_03" style="font-size:11px;" name='u_auth_flag'></span>
            <span class="u_i_s_02" name='u_auth_msg'></span>
            <span class="u_i_s_02" name='u_auth_info'></span>
        </li>
        <li class="user_info_list user_info_list_sign">
            <span class="u_id">서명</span><span name="u_comment"></span>
        </li>
        <li class="user_info_list">
            <span class="u_id">포인트</span><span name='u_point'></span></li>
        <li class="user_info_list">
            <span class="u_id">최종접속</span><span name='u_last_login'></span><span class="u_l"></span>
        </li>
        <li class="user_info_list">
            <div >
                <span class="u_id" >회원메모</span><span name="u_memo" ></span><span class="u_l"></span>
            </div>
        </li>
        `+html_member_block+`
        <li class="user_info_btns">
            <span class="user_btn pop01"><a href="#"><img src="`+G_CDN_URL+`/images/icon_ppom_gift_m.png"></a><b>뽐쿠폰선물</b></span><!--
            --><span class="user_btn pop02"><a href="#"><img src="`+G_CDN_URL+`/images/icon_friend_add_m.png"></a><b>친구등록</b></span><!--
            `+html_nickname_search+`
            --><span class="user_btn pop04"><a href="#"><img src="`+G_CDN_URL+`/images/icon_message_send_m.png"></a><b>쪽지보내기</b></span>
        </li>
    </ul>
</div>
    `;

    if( $('#popupMemberInfo').text() == '' ){
        $('#popupMemberInfo').html(html);
    }
}

var memberContentData_no = 0;
var memberContentData_enc_no = '';
function openMemberInfo(member_no, enc_member_no){
	memberContentData_no = member_no;
    memberContentData_enc_no = enc_member_no;

    drawMemberInfo();

	$.ajax({
        type: "GET",
        data: "no="+member_no,
        dataType: "jsonp",
        crossDomain: true,
        url: "/nzboard/get_member_info.php",
    }).done(function(obj){

		if( obj.err_msg != '' ){
            alert(obj.err_msg);
        }else{
            var reg_date = obj.reg_date.split('-');
            var last_login_date = obj.last_login.split('-');
            var auth_msg = '';

            if(parseInt(obj.com_no) > 0){
                auth_msg = '* 사업자 회원입니다.';
            }else if(obj.auth_flag != '1'){
            	auth_msg = '* 실명 미인증 회원입니다.';
            }else if ( obj.auth_flag == 1 && obj.bool_auth_member ) {
            	//obj.ipin_flag   = obj.ipin_flag == 1 ? "I-PIN 본인인증" : "휴대폰 본인인증";
            	auth_msg = "* 실명 가입된 회원입니다.<br>";
            	auth_msg += "* 본인 인증된 회원입니다.";
                //auth_msg += "* " + obj.enroll_date + ' ' + obj.ipin_flag;
                auth_msg += '<a href="'+G_MOB_SSL_URL+'/new/auth_renew.php" target="_blank"><img src="'+G_STATIC_URL+'/www/img/myinfo/n_icon_150730.gif"><a>';
            }else{
                auth_msg = '* 실명 가입된 회원입니다.<br>* 본인 미인증 된 회원입니다. <a href="'+G_MOB_SSL_URL+'/new/auth_renew.php" target="_blank"><img src="'+G_STATIC_URL+'/www/img/myinfo/n_icon_150730.gif"><a>';
            }

            $("span[name='u_id']").html(obj.user_id);
        	$("span[name='u_reg_date']").html(reg_date[0]+'년 '+reg_date[1]+'월 '+reg_date[2]+'일 가입');
        	$("span[name='u_name']").html(obj.name);
        	$("img[name='u_level']").attr('src', G_CDN_URL+'/images/memo/level_'+obj.level+'.gif');
        	$("span[name='u_auth_info']").html(auth_msg);
        	$("span[name='u_point']").html(obj.point_+'점');
        	$("span[name='u_last_login']").html(last_login_date[0]+'년 '+last_login_date[1]+'월 '+last_login_date[2]+'일');
        	$("span[name='u_memo']").html(obj.memo);
        	$("#check-name-btn").attr('onclick', "checkName('"+enc_member_no+"')");

        	$(".user_btn.pop01 a").attr('onclick', 'openLayer("coupon_gift", "'+enc_member_no+'");');
        	$(".user_btn.pop02 a").attr('href', G_MOB_SSL_URL+'/new/memo_friends.php?cmd=add&member_no='+enc_member_no);
        	$(".user_btn.pop04 a").attr('href', 'memo_write.php?exec=write&member_no='+enc_member_no);
        	$(".user_btn.pop03 a").attr('href', '/new/bbs_list.php?id='+G_BBS_ID+'&search_type=name&keyword='+encodeURIComponent(obj.name));

            if( "level_icon" in obj ){
                $("img[name='u_level']").replaceWith(obj.level_icon);
            }

        	if(obj.comment && obj.open_comment){
        		$("li.user_info_list_sign").show();
           		$("span[name='u_comment']").html(obj.comment);
           	}else{
           		$("li.user_info_list_sign").hide();
           	}
        	//social id 여부
           	if(obj.social_gb)
            {
           		$("span[name='u_name']").html(obj.social_icon + obj.name);
           	}

        	$( "#popupMemberInfo" ).show();

        	var layerPopupObj = $("#memberInfo");
            if( !layerPopupObj.css('transform') ){
                var left = (($(window).width() - layerPopupObj.width()) / 2 );
                layerPopupObj.css({'left':left});
            }

			if(obj.level >= 5){
				//
				if(typeof(getMemberContentData) != "undefined"){
					getMemberContentData();
				}
			} else {
				$("#mcb_i").hide();
				$("#mcb_v").hide();
			}

        }
	}).fail(function(error){

	});
}

function checkName(enc_member_no){
	var member_name = $('input[name=input_name]').val();
	$.ajax({
        type: "POST",
        data: "member_no="+enc_member_no+"&cvt_name="+member_name,
        url: "/nzboard/check_member_name.php",
        }).done(function(data){
         	var res = data.res;
         	var pmarket_memo = data.pmarket_memo;

             if (res == 'E1' || res == 'E2') alert('시스템 오류입니다.');
             else if (res == 'E3') alert('인증 오류입니다.');
             else if (res == 'E4') alert('회원 메모를 이미 등록하셨습니다.');
             else
             {
             	$("span[name='u_auth_flag']").html(res);
             	$("span[name='u_auth_msg']").html(pmarket_memo);
             }
    	}).fail(function(error){
    	});

}

function handleOrientation(){
    var layerPopupObj = null;

    if( $("#popupMemberInfo").is(':visible') ){
        layerPopupObj = $("#memberInfo");
    }else if( $("#popupClaim").is(':visible') ){
        layerPopupObj = $("#claimInfo");
    }

    if(layerPopupObj !== null){
        if( !layerPopupObj.css('transform') ){
            var left = (($(window).width() - layerPopupObj.width()) / 2 );
            layerPopupObj.css({'left':left});
        }
    }
}

window.addEventListener("deviceorientation", handleOrientation, true);

var chgMemoForm = function(k) {
    $("#read_memo_"+k).hide();
    $("#mod_memo_btn_"+k).hide();
    $("#mod_memo_"+k).show();
}

var userMemoCtrl = function(type,mno,ismember) {
    if (type == '') return;
    if (type != 'add' && parseInt(mno) <= 0) return;

    var mLevel = typeof(userMemo) == 'object' ? userMemo.mLevel : 0;
    var userMemo = new UserMemo(mLevel, ismember, "");
    var msg;

    if (type == 'add') {
        msg = $("#add_msg").val();
        if (msg.length == 0) alert("회원메모를 입력하세요.");

        userMemo.add_with_msg(msg,ismember,"openMemberInfo('"+ismember+"')");
    } else if (type == 'mod') {
        var msg = $("#mod_msg_"+mno).val();
        if (msg.length == 0) {
            alert("수정할 내용을 입력하세요.");
            return;
        }
    } else {
        //msg = confirm('삭제 하시겠습니까?');

    	userMemo.del_with_fn(mno,"openMemberInfo('"+ismember+"')");
    }
    if (msg == "" || msg == null || msg == false) {
        return;
    }
    //$('#type').val(type);
    //$('#mno').val(mno);
    //$('#msg').val(msg);
    userMemo.modify_with_msg(mno,msg,"openMemberInfo('"+ismember+"')");
    //openMemberInfo(mno);
}

function setMemberContentData(){
    data = {};
    data['mode'] = "set";
    data['reason'] = $.trim($('#mcb_reason').val());
    data['is_member_no'] = memberContentData_no;

    if(data['reason'] == ""){
        alert('사유를 입력해주세요.');
        return;
    }

    if(!confirm('등록하시겠습니까?')){
        return;
    }

    $.ajax({
        url:"/nzboard/ajax_member_content_block.php",
        method:'post',
        dataType:"json",
        data:data,
        success:function(d){
            //console.log(d);
            if(d.status){
                alert('등록되었습니다.');
                $("#reason").html(data['reason']);
                $("#mcb_date").html(d.date);

                $("#mcb_v").show();
                $("#mcb_i").hide();
            } else {
                switch(d.msg){
                    case 'fail - same from_member = is_member':
                        alert('자기 자신은 차단하실 수 없습니다.');
                        break;
                    default:
                        alert('통신이 실패하였습니다.');
                        break;
                }

            }
        },
        error:function(e){
            console.log(e);
        },
    });
}

function getMemberContentData(){
    data = {};
    data['mode'] = "get";
    data['is_member_no'] = memberContentData_no;

    $.ajax({
        url:"/nzboard/ajax_member_content_block.php",
        method:'post',
        dataType:"json",
        data:data,
        success:function(d){
            //console.log(d);
            if(d.status){
                $("#reason").html(d.data['reason']);
                $("#mcb_date").html(d.data.reg_date.substring(0,10));

                $("#mcb_v").show();
                $("#mcb_i").hide();
            } else {
                $('#mcb_reason').val("");
                $("#mcb_v").hide();
                $("#mcb_i").show();
            }
        },
        error:function(e){
            console.log(e);
        },
    });
}

function delMemberContentData(){
    data = {};
    data['mode'] = "del";
    data['is_member_no'] = memberContentData_no;

    if(!confirm('해제 하시겠습니까?')){
        return;
    }

    $.ajax({
        url:"/nzboard/ajax_member_content_block.php",
        method:'post',
        dataType:"json",
        data:data,
        success:function(d){
            console.log(d);
            if(d.status){
                alert('해제되었습니다.');
                $('#mcb_reason').val("");
                $("#mcb_v").hide();
                $("#mcb_i").show();
            } else {
                alert('통신이 실패하였습니다.');
            }
        },
        error:function(e){
            console.log(e);
        },
    });
}

function setMaxLength(o){
    if(o.value.length > o.maxLength){
        o.value = o.value.slice(0, o.maxLength);
    }
}

$(function(){
    $("#mcb_reason").on("focus",function(){
        $("#memberInfo").css("margin-top","-30px");
    });
    $("#mcb_reason").on("blur",function(){
        $("#memberInfo").css("margin-top","5vh");
    });
})

function drawClaimPopup(draw_type){
    var html_reason = ``;

    if( G_IS_MARKET_DEAL_BOARD ){
        html_reason = `
<span id="bbs_claim" style="display:none;">
    <label><input type="radio" name="reason" value="type_f"> 게시판 성격에 부적합</label>
    <label><input type="radio" name="reason" value="type_h"> 가격 미기재/오기재</label>
    <label><input type="radio" name="reason" value="type_i"> 명확한 광고, 업자의 게시물</label>
    <label><input type="radio" name="reason" value="type_j"> 실명불일치, 사기 의심 정황</label>
</span>
        `;
    }else{
        html_reason = `
<span id="bbs_claim" style="display:none;">
    <label><input type="radio" name="reason" value="type_a"> 게시판 성격에 부적합</label>
    <label><input type="radio" name="reason" value="type_b"> 중복 게시물</label>
    <label><input type="radio" name="reason" value="type_c"> 불쾌감(선정성, 욕설, 분란성 등)을 주는 게시물</label>
    <label><input type="radio" name="reason" value="type_d"> 규칙 위반(저작권, 저격, 쪽지 공개 등) 게시물</label>
    <label><input type="radio" name="reason" value="type_e"> 명확한 광고 게시물</label>
    <label style="padding-left:8px;font-weight:bold;">ㆍ&nbsp;&nbsp;불법촬영물 포함 게시물 <a href="/new/bbs_list.php?id=propose&category=1" target="_blank" style="color:#ff5050;">[신고하기]</a></label>
    <div style="padding:0 10px 2px 30px;color:#999;font-size:0.8em;">
        (성적 불법촬영물/ 성적 허위영상물/ 아동청소년성착취물로 전기통신사업법 시행령에 따라 별도 신고로 접수하고 있습니다. <a href="/new/bbs_view.php?id=regulation&no=19" target="_blank" style="color:#1546b4;">불법촬영물 등에 대한 신고절차</a>를 확인해 주세요.)
    </div>
</span>
        `;
    }

    var html = `
<div class="bg"></div>
<div id="claimInfo" class="user_info_p">
    <form name="claimForm" id="claimForm">
    <input type="hidden" name="type"/>
    <input type="hidden" name="bbs_id" value="`+G_BBS_ID+`" />
    <input type="hidden" name="bbs_no" value="`+G_BBS_NO+`" />
    <input type="hidden" name="type3"/>
        <ul>
            <li class="user_info_title"><span id="id_claim_title">신고하기</span><span class="u_c" onclick="closeClaimForm()">닫기</span></li>
            <li class="user_info_list" id='id_user_info_list'>
                <span class="report_n">신고 주신 게시물은 검토 후 삭제 및 이동 조치 됩니다.<br>
                <em>허위로 신고하는 경우 서비스 이용이 제한될 수 있으니<br> 신중하게 신고해주세요.</em></span></li>

            <li class="user_info_list"  id='id_user_info_list_user_claim'>
            <span class="report_n">
                <span id='id_popupClaimTarget'>초기값</span><br>
                <span class="report_box" id='id_popupClaimTitle'></span>
                <span ><em>(허위신고는 서비스 이용이 제한될 수 있습니다.)</em></span>
            </span>
            </li>

            <li class="user_info_list02">
                <span class="u_id02">신고이유</span>
                `+html_reason+`
                <span id="bbs_user_claim" style="display:none;">
                    <label><input type="radio" name="reason" value="type_c"> 불쾌감(선정성,욕설,분란유발 등)</label>
                    <label><input type="radio" name="reason" value="type_d"> 규칙위반(저작권,저격,쪽지공개 등)</label>
                    <label><input type="radio" name="reason" value="type_e"> 광고/업자로 판단</label>
                </span>
                <span id="bbs_company_claim" style="display:none;">
                    <label><input type="radio" name="reason" value="type_c"> 광고/업자로 판단</label>
                </span>
                <span id="comment_user_claim" style="display:none;">
                    <label><input type="radio" name="reason" value="type_a"> 불쾌감(선정성,욕설,분란유발 등)</label>
                    <label><input type="radio" name="reason" value="type_b"> 규칙위반(저작권,저격,쪽지공개 등)</label>
                    <label><input type="radio" name="reason" value="type_c"> 광고/업자로 판단</label>
                </span>
                <span id="comment_company_claim" style="display:none;">
                    <label><input type="radio" name="reason" value="type_c"> 광고/업자로 판단</label>
                </span>
                <span id="comment_claim" style="display:none;">
                    <label><input type="radio" name="reason" value="type_a"> 불쾌감을 주는 코멘트</label>
                    <label><input type="radio" name="reason" value="type_b"> 공지 위반</label>
                    <label><input type="radio" name="reason" value="type_c"> 광고 및 홍보</label>
                    <input type="hidden" name="c_no" value="" />
                </span>
            </li>
            <li class="user_info_list02">
                <span class="u_id02">코멘트</span><textarea cols="35" rows="5" name="comment" id="comment"></textarea>
            </li>
            <li class="report_last" >
                <a class="btn_report_left" onclick="submitClaimForm()"><img src="`+G_CDN_URL+`/images/main/bt_claim.gif" border="0" width="10" height="10"> 신고</a>
                <a class="btn_report_right" onclick="closeClaimForm();">취소</a>
            </li>
        </ul>
    </form>
</div>
    `;

    if( typeof(draw_type) != 'undefined' && draw_type == 'new' ){
        $('#popupClaim').html(html);
    }else if( $('#popupClaim').text() == '' ){
        $('#popupClaim').html(html);
    }
}

function openClaimForm(type, c_no, c_memo, draw_type){
	var claim_title = '신고하기';

    drawClaimPopup(draw_type);

	$("#id_user_info_list" ).hide();
	$("#id_user_info_list_user_claim" ).hide();

	if(type == 'bbs_user' || type == 'comment_user' || type == 'alcohol_info_cmt' )
	{
		claim_title = '사용자 신고하기';

		$("#id_user_info_list_user_claim" ).show();
		if(type == 'bbs_user'){
			$("#id_popupClaimTarget").text('대상 : 게시글 작성자');
			$("#id_popupClaimTitle").text('제목 : '+title);
			$("#claimForm input[name=type]").val('bbs');
			$("#bbs_user_claim" ).show();
		}else if( type == 'comment_user' ){
			$("#id_popupClaimTarget").text('대상 : 코멘트 작성자');
			$("#id_popupClaimTitle").text('코멘트 : '+c_memo);
			$("#claimForm input[name=type]").val('comment');
			$("#claimForm input[name=c_no]").val(c_no);
			$("#comment_user_claim").show();
		}else if( type == 'alcohol_info_cmt' ){
			$("#id_popupClaimTarget").text('대상 : 주류정보 코멘트 작성자');
			$("#id_popupClaimTitle").text('코멘트 : '+c_memo);
			$("#claimForm input[name=type]").val('alcohol_info_cmt');
			$("#claimForm input[name=c_no]").val(c_no);
			$("#comment_user_claim").show();
        }
	}else if(type == 'bbs_company' || type == 'comment_company' ){
		$("#claimForm input[name=type3]").val('company_claim');
		if(type == 'bbs_company'){
			$("#claimForm input[name=type]").val('bbs');
			$("#id_user_info_list" ).show();
			$("#bbs_company_claim" ).show();
		}else{
			$("#claimForm input[name=type]").val('comment');
			$("#claimForm input[name=c_no]").val(c_no);
			$("#comment_company_claim").show();
		}
	}else if(type == 'bbs'){
		$("#claimForm input[name=type]").val('bbs');
		$("#id_user_info_list" ).show();
		$("#bbs_claim" ).show();
	}else if(type == 'comment'){
		$("#claimForm input[name=type]").val('comment');
		$("#claimForm input[name=c_no]").val(c_no);
		$("#id_user_info_list" ).show();
		$( "#comment_claim" ).show();
	}else if(type == 'move'){
        drawMovePopup();
		$("#claimForm input[name=type]").val('bbs');
		$("#id_user_info_list" ).show();
		$("#popupMove" ).show();
	}

	$("#id_claim_title").text(claim_title);

	$( "#popupClaim" ).show();

    var layerPopupObj = $("#claimInfo");
    layerPopupObj.css({
        'transform':'translate(-50%, 0)',
        'top':100+$(window).scrollTop(),
    });
}

function closeClaimForm(){
	$("#bbs_claim").hide();
	$("#bbs_user_claim").hide();
	$("#comment_user_claim").hide();
	$("#comment_claim").hide();
	$("#popupClaim").hide();
	$("#popupMove").hide();
    $('.three-rung-menu').hide();
	$("#id_user_info_list").hide();
	$("#id_user_info_list_user_claim").hide();
	$("#bbs_company_claim").hide();
	$("#comment_company_claim").hide();
	$("#claimForm input[name=type3]").val('');	//초기화
}

function isObjChecked(obj)
{
	var length = obj.length;
	for (var i = 0; i < length; i++) {
		if (obj[i].checked === true)
			return true;
	}
	return false;
}

var claim_prevent_db_click = 1;
var move_prevent_dbclick = 1;

function submitClaimForm(){
	if (isObjChecked(document.getElementsByName("reason")) === false) {
		alert("신고사유를 선택해 주세요.");
		return;
	}

	if ( claim_prevent_db_click == 1)
	{
    	claim_prevent_db_click = 0;

		$.ajax({
	        type: "POST",
	        data: $("#claimForm").serialize(),
	        dataType: "json",
	        url: "/nzboard/claim_ctrl.php",
	        success: function(data) {
	        	closeClaimForm();
	        	claim_prevent_db_click = 1;
	            if(data.msg == 'success'){
	                alert('신고사항은 정상적으로 접수 되었습니다.\n신고하신 게시물은 검토 후 조치하도록 하겠습니다.');
	            }else{
	                if(data.error == 1){
	                	alert('시스템 오류로 인해 접수가 불가능합니다.\n잠시 후 시도해 주십시오.');
	                }else if(data.error == 2){
	                    if(data.flag_yn == 'Y'){
	                        alert('신고하신 게시물은 신고접수 후 정상적으로 처리가 완료되었습니다.\n추가로 신고가 필요하다고 판단되시면 운영게시판에 신고해 주십시오.');
	                    }else{
	                        alert('신고하신 게시물은 신고접수 후 처리 중입니다.\n추가로 신고가 필요하다고 판단되시면 운영게시판에 신고해 주십시오.');
	                    }
					}else if(data.error == 3){
						alert('신고 사유를 선택해주세요.');
	                }else if(data.error == 9){
	                    alert('파라미터 오류입니다. 잠시 후 시도해 주십시오.');
	                }else if(data.error == -1){
	                	alert('이미 신고처리되었습니다.');
	                }else if(data.error == -2){
	                	alert('로그인이 필요한 기능입니다.');
	                }
	            }

	        },
        	error: function(error){
        			claim_prevent_db_click = 1;
        	}
	    });
	}
}

function drawMovePopup(draw_type){
    var html_noti = ``;
    var html_claim_msg = ``;

    if( G_BBS_ID == 'consulting' ){
        html_noti = `승인된 컨설턴트 3명이 요청하는 경우 해당 게시판으로 이동됩니다.`;
    }else{
        html_noti = `레벨4 이상 회원이 요청하는 경우 해당 게시판으로 이동됩니다.`;
    }

    if( G_BBS_ID == 'freeboard' ){
        html_claim_msg = `
<label><input type="radio" name="move_id" value="issue"> 정치자유게시판에 어울립니다.(1일 3회 가능)</label>
<label style="padding-left: 27px;">- 일반글: 3명, HOT/인기글: 10명 요청 필요</label>
        `;
    }else if( G_BBS_ID == 'phone' ){
        html_claim_msg = `
        `;
    }else if( G_BBS_ID == 'consulting' ){
        html_claim_msg = `
<label><input type="radio" name="move_id" value="waste"> 광고성 게시글로 휴지통으로 이동요청 합니다.</label>
        `;
    }

    var html = `
<div class="bg"></div>
<div id="moveInfo" class="user_info_p" style="max-width:400px;width:98%">
    <form name="moveForm" id="moveForm">
    <input type="hidden" name="type"/>
    <input type="hidden" name="id" value="`+G_BBS_ID+`" />
    <input type="hidden" name="no" value="`+G_BBS_NO+`" />
        <ul>
            <li class="user_info_title"><span id="id_move_title">게시글 이동요청</span><span class="u_c" onclick="closeClaimForm()">닫기</span></li>
            <li class="user_info_list" id='id_user_info_list'>
                <span class="report_n">게시글 이동 요청 기능은 현재 게시판과 어울리지 않는 게시글을 다른 게시판으로 이동 요청하는 기능입니다.<br>
                `+html_noti+`
                <br>
                <em>허위요청 시 운영진 판단 하에 기능이 회수될 수 있습니다.</em></span></li>

            <li class="user_info_list02">
                <span class="u_id02" style="width:90%">게시글 이동 요청</span>
                <span id="bbs_move">
                `+html_claim_msg+`
                </span>
            </li>
            <li class="report_last" >
                <a class="btn_report_left" onclick="submitMoveForm()">요청</a>
                <a class="btn_report_right" onclick="closeClaimForm();">취소</a>
            </li>
        </ul>
    </form>
</div>
    `;

    if( typeof(draw_type) != 'undefined' && draw_type == 'new' ){
        $('#popupMove').html(html);
    }else if( $('#popupMove').text() == '' ){
        $('#popupMove').html(html);
    }
}

function openMoveForm(draw_type){
    drawMovePopup(draw_type);

    //게시글 이동요청
    $("#id_user_info_list").hide();
    $("#id_user_info_list_user_claim" ).hide();

    $("#moveForm input[name=type]").val('bbs');
    $("#id_user_info_list" ).show();
    $("#popupMove" ).show();

    var popup_padding_top = 100+$(window).scrollTop();
    $( "#moveInfo" ).css("margin-top",popup_padding_top+"px");

    var layerPopupObj = $("#moveInfo");
    var left = (($(window).width() - layerPopupObj.width()) / 2 );
    layerPopupObj.css({'left':left});
}

function submitMoveForm(){
	if (isObjChecked(document.getElementsByName("move_id")) === false) {
		alert("이동게시판을 선택해 주세요.");
		return;
	}

	if ( move_prevent_dbclick == 1)
	{
		move_prevent_dbclick = 0;
		var id = G_BBS_ID;

		$.ajax({
	        type: "POST",
	        data: $("#moveForm").serialize(),
	        dataType: "text",
	        url: "/new/comment_help.php",
	        success: function(data) {
	        	// console.log(data);

	        	closeClaimForm();
	        	move_prevent_dbclick = 1;
	        	var res = data.split('|');
                var code = res[0];
                var msg = res[1];

                // console.log(res, code, msg);

                if( code == 'S' ){
                    alert(msg);
                    window.location.href="/new/bbs_list.php?id="+id;
                    self.close();
                }else if( code == 'SR' ){
                    alert(msg);
                    document.location.reload();
                    self.close();
                }else if( code == 'E' ){
                    alert(msg);
                    self.close();
                }else if(data=='24시간이 지난 글은 해당사항이 없습니다.'){
                    alert(data);
                    self.close();
                }else{
                    console.log(data);
                    alert(data);
                }
                move_prevent_dbclick = 1;
	        },
        	error: function(error){
        		move_prevent_dbclick = 1;
        	}
	    });
	}
}

function openDelForm(type, c_no){
	if(type == 'bbs'){
		$("#DelForm input[name=type]").val('bbs');
	}else if(type == 'comment'){
		$("#DelForm input[name=type]").val('comment');
		$("#DelForm input[name=c_no]").val(c_no);
	}

	$( "#popupDel" ).show();
    var layerPopupObj = $("#DelInfo");
	layerPopupObj.css({
        'transform':'translate(-50%,0)',
        'top':100+$(window).scrollTop(),
    });
}

function closeDelForm(){
	$( "#popupDel" ).hide();
}

function isObjChecked(obj)
{
	var length = obj.length;
	for (var i = 0; i < length; i++) {
		if (obj[i].checked === true)
			return true;
	}
	return false;
}

function market_delete(){
	if (isObjChecked(document.getElementsByName("delete_market_option")) === false) {
		alert("삭제/신고 사유를 선택해 주세요.");
		return;
	}
    var kind = $(':radio[name="delete_market_option"]:checked').val();
    xajax_market_delete(G_BBS_ID,G_BBS_NO,kind); //장터 삭제
}

function x_hide(){
	if (isObjChecked(document.getElementsByName("delete_option")) === false) {
		alert("삭제/신고 사유를 선택해 주세요.");
		return;
	}
	 var reason;
	    var del_v = $(':radio[name="delete_option"]:checked').val();

	    if((del_v>=1 && del_v<5) || del_v == 100 || del_v == 11){
	        xajax_vote('vote_spam',G_BBS_ID,G_BBS_NO, 0, del_v); //삭제
	      //obvious 는 임시레벨강등 까지 맥임
		}else if(del_v=='obvious'){
			xajax_market_delete(G_BBS_ID,G_BBS_NO,del_v);
	    }else{
	        //신고사유 타입
	        if(del_v==5){
	            reason = 'type_a';
	        }else if(del_v==6){
	            reason = 'type_d';
	        }else if(del_v==7){
	            reason = 'type_c';
	        }else if(del_v==8){
	            reason = 'type_h';
	        }else if(del_v==9){
	            reason = 'type_f';
	        }else if(del_v==10){
	            reason = 'type_i';
	        }

	        xajax_report(G_BBS_ID,G_BBS_NO,reason); //신고
	    }

}

function drawSharePopup(draw_type){
    var selector = '.share-popup';
    var html = `
<div class="backCover"></div>
<div class="share-box">
    <div class="share-header">
        <h4>공유하기</h4>
        <span class="btn btn-close"></span>
    </div>
    <div class="share-body">
        <div class="sns-box">
            <div class="sns">
                <a href="#none" onclick="share_email();return false;"><img src="${G_CDN_URL}/images/share/01_m_email.png" alt="이메일로 보내기">이메일</a>
                <a href="#none" onclick="share_kakao();return false;"><img src="${G_CDN_URL}/images/share/02_m_kakaotalk.png" alt="카톡으로 보내기">카카오톡</a>
                <a href="#none" onclick="share_line();return false;"><img src="${G_CDN_URL}/images/share/03_m_line.png" alt="라인으로 보내기">라인</a>
                <a href="#none" onclick="share_band();return false;"><img src="${G_CDN_URL}/images/share/04_m_band.png" alt="밴드">밴드</a>
            </div>
            <div class="sns">
                <a href="#none" onclick="share_twitter();return false;"><img src="${G_CDN_URL}/images/share/05_m_x.png" alt="트위터">X(트위터)</a>
                <a href="#none" onclick="share_facebook();return false;"><img src="${G_CDN_URL}/images/share/06_m_facebook.png" alt="페이스북">페이스북</a>
                <a href="#none" class="bookmark" onclick="share_bookmark(); return false;"><img src="/new/images/icon_bookmark.png" alt="북마크">북마크</a>
            </div>
        </div>
        <div class="url-wrapper">
            <input type="text" id="copyTarget" value="${G_MOB_SSL_URL}/new/bbs_view.php?id=${G_BBS_ID}&no=${G_BBS_NO}" readonly />
        </div>
        <span class="btn-copy" id="copyButton">주소복사하기</span>
    </div>
</div>
`;

    if( typeof(draw_type) != 'undefined' && draw_type == 'new' ){
        $(selector).html( html );
    }else if( $(selector).text() == '' ){
        $(selector).html( html );
    }
}
$(document).ready(function(){
    drawSharePopup();
});
/* Layout Popup END */

/* 성인광고 관련 START */
function adult_ad(){
    $("div[id='pp_ban_top']").html('<iframe id="if_top_bn" src="/banner/google_ad.html?pos=6&type=19" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" width="320px" height="100px"></iframe>');
    $("div[id='pp_ban_search']").html('<iframe id="if_ban_search" src="/banner/google_ad.html?pos=20&type=19" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" width="320px" height="100px"></iframe>');
    $("div[id='pp_ban_bbs_view']").html('<iframe id="if_bbs_view_bn" src="/banner/google_ad.html?pos=2&type=19" scrolling="no" border="0" marginWidth="0" marginHeight="0" frameBorder="0" width="320px" height="100px"></iframe>');    
}
/* 성인광고 관련 END */

/* Save Mode START */
$(document).ready(function(){
    if( get_cookie('mode') != 'save' ) return;

    let head = $("iframe.cheditor-editarea").contents().find("head");
    let css = '<style>html, body{color:#ccc}</style>';
    $(head).append(css);
});
/* Save Mode END */

/* Header, BBS Top Navi Scroll START */
$(document).ready(function(){
    if( get_cookie('ppomlottobrowser') == 'true' ) return;

    var lastScrollTop = 0;
    var diffScrollTop = 0;
    var offset = 100;
    var hasBbsTopNavi = 0;
    var toggleHeader = 1;
    var urlObj = new URL(location.href);

    if( $.inArray(urlObj.pathname, ['/new/bbs_view.php','/new/bbs_list.php','/new/recent_youtube.php','/new/alcohol_info.php']) > -1 ){
        hasBbsTopNavi = 1;
    }
    if( $.inArray(urlObj.pathname, ['/new/pop_bbs.php','/new/hot_bbs.php']) > -1 && G_BBS_ID ){
        hasBbsTopNavi = 1;
    }

    if( $.inArray(urlObj.pathname, ['/new/books_info.php', '/new/book_view.php']) > -1 ){
        hasBbsTopNavi = 1;
    }
    
    // $('.site-header').css({
    //     "-webkit-transition":"height 0.2s ease",
    //     "-moz-transition":"height 0.2s ease",
    //     "-o-transition":"height 0.2s ease",
    //     "overflow":"hidden",
    // });
    $('.search-bar').css({
        "-webkit-transition":"top 0.2s ease",
        "-moz-transition":"top 0.2s ease",
        "-o-transition":"top 0.2s ease",
    });
    $('.search-tabs').css({
        "-webkit-transition":"top 0.2s ease",
        "-moz-transition":"top 0.2s ease",
        "-o-transition":"top 0.2s ease",
    });

    ScrollAction.addUpAction(function(scrollTop){
        diffScrollTop = scrollTop - lastScrollTop;

        if( diffScrollTop < -offset || diffScrollTop > offset || scrollTop < 10 ){
            if( hasBbsTopNavi ) $('.ct h3').eq(0).css("top", "50px");

            $('.site-header').css("height", "50px");
            $('.search-bar').css("top", "50px");
            $('.search-tabs').css("top", "105px");
            lastScrollTop = scrollTop;
        }
    });

    ScrollAction.addDownAction(function(scrollTop){
        diffScrollTop = scrollTop - lastScrollTop;

        if( scrollTop < 10 ){
            if( hasBbsTopNavi ) $('.ct h3').eq(0).css("top", "50px");

            $('.site-header').css("height", "50px");
            $('.search-bar').css("top", "50px");
            $('.search-tabs').css("top", "105px");
            lastScrollTop = scrollTop;
            return;

        }else if( diffScrollTop < -offset || diffScrollTop > offset ){
            if( hasBbsTopNavi ) $('.ct h3').eq(0).css("top", "0");

            $('.site-header').css("height", "0");
            $('.search-bar').css("top", "0");
            $('.search-tabs').css("top", "55px");
            lastScrollTop = scrollTop;
        }
    });

    ScrollAction.binding();

    if( hasBbsTopNavi ){
        // fixed menu bar(.ct h3)
        $('#header-cover').height(85);
        if( $(window).scrollTop() < 50 ){
            $('.ct h3').eq(0).css({
                "position":"fixed",
                "top":"50px",
                "left":"0",
                "z-index":"15",
                "width":"100%",
                "box-sizing":"border-box",
                "-webkit-transition":"top 0.2s ease",
            });
        }else{
            $('.ct h3').eq(0).css({
                "position":"fixed",
                "top":"0",
                "left":"0",
                "z-index":"20",
                "width":"100%",
                "box-sizing":"border-box",
                "-webkit-transition":"top 0.2s ease",
            });
        }
    }

    if( urlObj.pathname == '/new/menu_list.php' ){
        $('.ct h3').eq(0).css({"box-sizing":"border-box"});
    }

    if( urlObj.pathname == '/new/page_alert.php' ){
        $('.site-header').addClass('on');
        toggleHeader = 0;
    }

    $(document).on('scroll', function(){
        if( !toggleHeader ) return;

        var scroll = $(window).scrollTop();
        if (scroll > 50) {
            $('.site-header').addClass('on');
        } else {
            $('.site-header').removeClass('on');
        }
    });
});
/* Header, BBS Top Navi Scroll END */

/* Header Button & Icon START */
$(document).ready(function(){
    var urlObj = new URL(location.href);

    if( G_SET_MONITOR_NEW_ICON ){
        set_new_icon_monitor();
    }

    $(".site-header-member-logout").click(function() {
        auth_login(encodeURIComponent(urlObj.pathname+urlObj.search));
    });

    $(document).on('click', '.member-station-nonmember', function(){
        auth_login(G_LOGIN_S_URL);
    });

    $(document).on('click', ".member-station-member", function(){        
        auth_join(G_LOGIN_S_URL);
    });

    $( ".member-logout, .site-content01 .logout" ).click(function(){
        $(location).attr('href','/nzboard/logout.php?s_url='+G_LOGIN_S_URL);
    });

    $( "#site-header-member-message" ).click(function() {
        $(location).attr('href',G_MOB_SSL_URL+'/new/memo_list.php');
    });

    $( "#site-header-member-mypage" ).click(function() {
        $(location).attr('href',G_MOB_SSL_URL+'/new/myinfo.php');
    });

    $( "#search-bar-icon-keyword" ).click(function() {
         show_keyword();
    });

    $( "#id-search-bar-icon-search" ).click(function() {
        $( "#search_all" ).submit();
    });

    $( ".mypage-information-bbs_my" ).click(function() {
        $(location).attr('href',G_MOB_SSL_URL+'/new/bbs_list.php?id=my');
    });

    $( ".mypage-information-mypage" ).click(function() {
        $(location).attr('href',G_MOB_SSL_URL+'/new/myinfo.php');
    });

    $(document).on('click', ".mypage-information-my_article", function(){
        $(location).attr('href',G_MOB_SSL_URL+'/new/myinfo/monitor.php');
    });

    $(document).on('click', ".mypage-information-bbs_faq_biz", function(){
        $(location).attr('href',G_MOB_SSL_URL+'/new/bbs_list.php?id=faq_biz');
    });    

    $(document).on('click', ".mypage-information-my_comment", function(){
        $(location).attr('href',G_MOB_SSL_URL+'/new/comment_monitor.php');
    });

    if( G_IS_COMPANY ){
        $( ".ppomcoupon-information" ).click(function() {
            $(location).attr('href','/new/coupon/member_coupon.php?mode=gift');
        });
    }else{
        $( ".ppomcoupon-information" ).click(function() {
            $(location).attr('href','/new/coupon/ppom_coupon.php');
        });
    }
});
/* Header Button & Icon END */

/* BBS Top Navi START */
var is_top_sel_click = false;

function set_top_sel_btn_ul_hide()
{
    var top_sel_btn_list = ['img_sec', 'top_sel'];

    $.each( top_sel_btn_list, function(index,item){
        $('h3 .'+item+' ul').hide();
        $('h3 .'+item).each(function(){
            $(this).find('i').eq(0).addClass('on');
            $(this).find('i').eq(1).removeClass('on');
        });
    });
}

$(document).ready(function(){
    var urlObj = new URL(location.href);
    var pathname = urlObj.pathname;
    var category = urlObj.searchParams.get('category');
    var category2 = urlObj.searchParams.get('category2');
    var bot_type = urlObj.searchParams.get('bot_type');

    $('#category-name ul li, #category-name-view ul li').on('click', function(){
        var id = G_BBS_ID;

        if (id == 'phone' && $(this).attr('data-value') == 'phone_mgr') {
            location.replace("/new/phone_mgr.php");
        } else if (id == 'kakao_game' && $(this).attr('data-value') == 'kakao_invite') {
            location.replace("/new/bbs_list.php?id=kakao_invite");
        } else if (id == 'game' && $(this).attr('data-value') == 'invitation') {
            location.replace("/new/bbs_list.php?id=invitation");
        } else if (id == 'diablo' && $(this).attr('data-value') == 'party') {
            location.replace("/new/bbs_list.php?id=party");
        } else if (id == 'adult' && $(this).attr('data-value') == 6) {
            location.replace("/new/bbs_list.php?id=back_gallery");
        } else if (id == 'market_phone' && $(this).attr('data-value') == 'market_data') {
            location.replace("/new/bbs_list.php?id=market_data");
        } else if (id == 'onmarket' && $(this).attr('data-value') == 'market_data') {
            location.replace("/new/bbs_list.php?id=market_data");
        } else if( pathname == '/new/pop_bbs.php' ){
            location.replace("/new/pop_bbs.php?id="+G_BBS_ID +"&bot_type="+bot_type +"&category="+$(this).attr('data-value') +(category2 ? "&category2="+category2 : ""));
        } else {
            location.replace("/new/bbs_list.php?id="+G_BBS_ID +"&category="+$(this).attr('data-value') +(category2 ? "&category2="+category2 : ""));
        }
    });

    if( category ){
        $('#category-name ul li, #category-name-view ul li').each(function(){
            if($(this).attr('data-value') == category){
                $(this).addClass('active');
            }
        });
    }

    $('h3 .top_sel').on('click', function(){
        is_top_sel_click = true;

        var $target = $(this);
        var $icon1 = $target.find('i').eq(0);
        var $icon2 = $target.find('i').eq(1);
        var $ul = $target.find('ul');
        var left = ($(this).prev().width() + 12) * -1;

        $ul.css('left', left);

        if($ul.is(':visible') == true){
            $ul.hide();
            $icon1.addClass('on');
            $icon2.removeClass('on');
        }else{
            set_top_sel_btn_ul_hide();

            $ul.show();
            $icon1.removeClass('on');
            $icon2.addClass('on');
        }
    });

    $('h3 .img_sec').on('click', function(){
        is_top_sel_click = true;

        var $target = $(this);
        var $icon1 = $target.find('i').eq(0);
        var $icon2 = $target.find('i').eq(1);
        var $ul = $target.find('ul');
        var left = ($(this).prev().width() + 12) * -1;

        $ul.css('left', left);

        if($ul.is(':visible') == true){
            $ul.hide();
            $icon1.addClass('on');
            $icon2.removeClass('on');
        }else{
            set_top_sel_btn_ul_hide();

            $ul.show();
            $icon1.removeClass('on');
            $icon2.addClass('on');
        }
    });

    $('h3 .top_sel_btn').on('click', function(){
        is_top_sel_click = true;

        var $target = $($(this).attr('rel'));
        var $icon1 = $target.find('i').eq(0);
        var $icon2 = $target.find('i').eq(1);
        var $ul = $target.find('ul');
        var left = ($(this).width() + 12) * -1;

        if( $target.selector == '#board-name' ) return;

        $ul.css('left', left);

        if($ul.is(':visible') == true){
            $ul.hide();
            $icon1.addClass('on');
            $icon2.removeClass('on');
        }else{
            set_top_sel_btn_ul_hide();

            $ul.show();
            $icon1.removeClass('on');
            $icon2.addClass('on');
        }
    });
});

$(document).on('click', function(e){
    if(is_top_sel_click == false && $('h3 .top_sel ul:visible').length > 0){
        e.preventDefault();
        set_top_sel_btn_ul_hide();
    }else if(is_top_sel_click == false && $('h3 .img_sec ul:visible').length > 0){
        e.preventDefault();
        set_top_sel_btn_ul_hide();
    }
    is_top_sel_click = false;
});
/* BBS Top Navi END */

/* BBS Submenu START */
$(document).ready(function(){
    if( !G_USE_BBS_SUB_MENU ) return;

    if( $('#bbs_sub_menu li').length ){
        var scrollPosX = $('#bbs_sub_menu li.active').offset().left - $('#bbs_sub_menu li').eq(0).offset().left + 10;
        var offset = 100;

        $('#bbs_sub_menu').scrollLeft(scrollPosX - offset);
        if( $('#bbs_sub_menu').prop('scrollWidth') > $('#bbs_sub_menu').prop('clientWidth') ){
            $('.bbs_sub_menu_more_area').show();
        }else{
            $('.bbs_sub_menu_more_area').hide();
        }

        // menu open
        $('#bbs_sub_menu_more_open').on('click', function(){
            $('#bbs_sub_menu_more_open').hide();
            $('#bbs_sub_menu_more_close').show();
            $('#bbs_sub_menu').addClass('more');
        });
        // menu close
        $('#bbs_sub_menu_more_close').on('click', function(){
            $('#bbs_sub_menu_more_close').hide();
            $('#bbs_sub_menu_more_open').show();
            $('#bbs_sub_menu').removeClass('more');
            $('#bbs_sub_menu').scrollLeft(scrollPosX - offset);
        });

        $(window).resize(function(){
            if( $('#bbs_sub_menu').prop('scrollWidth') > $('#bbs_sub_menu').prop('clientWidth') ){
                $('.bbs_sub_menu_more_area').show();
                $('#bbs_sub_menu').scrollLeft(scrollPosX - offset);
            }else if( $('#bbs_sub_menu').height() > 40 ){
                $('.bbs_sub_menu_more_area').show();
            }else{
                $('.bbs_sub_menu_more_area').hide();
            }
        });
    }
});
/* BBS Submenu END */

/* Youtube Sticky START */
function youtube_sticky_enabled_toggle(){
	let ytsten=get_cookie('ytsten');
	set_cookie('ytsten', (ytsten != undefined) ? String('1'-ytsten) : '0');
}
/* Youtube Sticky END */

/* WEB-7381 실시간 질렀어요 */
$(document).ready( function () {
    $(document).on("click", ".title_tab span.endedUp", function () {
    	$(this).addClass("on");
        $(".title_tab span.recently_goods").removeClass("on");
        $(".view_page_box.endedUp").show();
        $(".endedUp.empty").show();
        $(".view_page_box.recently_goods").hide();
        set_cookie("buyscrap_n_recently_tab", 1, 365);
    });

    $(document).on("click", ".title_tab span.recently_goods", function () {
    	$(this).addClass("on");
        $(".title_tab span.endedUp").removeClass("on");
        $(".view_page_box.recently_goods").show();
        $(".recently_goods.empty").show();
        $(".view_page_box.endedUp").hide();
        set_cookie("buyscrap_n_recently_tab", 2, 365);
    });

    if( typeof on_recent_tab !== 'undefined'){
        if ( on_recent_tab == 'buyscrap' ) $(".title_tab span.endedUp").trigger("click");
        if ( on_recent_tab == 'recently' ) $(".title_tab span.recently_goods").trigger("click");
    }
});
/* WEB-7381 실시간 질렀어요 */

/* PpomFinance START */
var PpomFinance = new class{
    init(finance_data){
        this.finance_data = finance_data;
        return this;
    }

    draw(){
        this.drawBox();
        this.drawOverlay();
        this.onReadyAction();
    }

    drawBox(){
        var html = `
<div class="stock-box" onclick="PpomFinance.toggleOverlay()">
    <ul>
        <li class="list"><strong class="title">코스피</strong><span class="price{kospi_class}"><span class="numb">{kospi_value}</span><small>{kospi_diff_value} {kospi_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">코스닥</strong><span class="price{kosdaq_class}"><span class="numb">{kosdaq_value}</span><small>{kosdaq_diff_value} {kosdaq_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">국내 금</strong><span class="price{gold_kor_class}"><span class="numb">{gold_kor_value}</span><small>{gold_kor_diff_value} {gold_kor_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">국제 금</strong><span class="price{gold_world_class}"><span class="numb">{gold_world_value}</span><small>{gold_world_diff_value} {gold_world_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">원달러</strong><span class="price{usd_class}"><span class="numb">{usd_value}</span><small>{usd_diff_value} {usd_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">DOW</strong><span class="price{dow_class}"><span class="numb">{dow_value}</span><small>{dow_diff_value} {dow_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">NASDAQ</strong><span class="price{nasdaq_class}"><span class="numb">{nasdaq_value}</span><small>{nasdaq_diff_value} {nasdaq_diff_rate}%</small></span></li>
        <li class="list"><strong class="title">S&amp;P 500</strong><span class="price{sap500_class}"><span class="numb">{sap500_value}</span><small>{sap500_diff_value} {sap500_diff_rate}%</small></span></li>
    </ul>
</div>
        `;

        for( var k in this.finance_data ){
            html = html.replace('{'+k+'_class}', (this.finance_data[k]['diff_sign'] > 0 ? ' plus' : (this.finance_data[k]['diff_sign'] == 0 ? ' zero' : '')))
                        .replace('{'+k+'_value}', this.finance_data[k]['value'])
                        .replace('{'+k+'_diff_value}', (this.finance_data[k]['diff_value']*1).toFixed(2))
                        .replace('{'+k+'_diff_rate}', (this.finance_data[k]['diff_rate'] == 0 ? '&nbsp;' : '') + (this.finance_data[k]['diff_rate']*1).toFixed(2));
        }

        $('#stock-area').prepend(html);
    }

    drawOverlay(){
        var html = `
<div class="stock-view">
    <a href="javascript:;" onclick="PpomFinance.toggleOverlay()" class="closeBtn"></a>
    <h3>주요지수</h3>
    <time>{base_date} 기준</time>
    <ul>
        <li class="list">
            <div class="list-box"><strong class="title">코스피</strong><span class="price{kospi_class}"><span class="numb">{kospi_value}</span><small>{kospi_diff_value} {kospi_diff_rate}%</small></span></div>
            <img src="{kospi_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title">원달러</strong><span class="price{usd_class}"><span class="numb">{usd_value}</span><small>{usd_diff_value} {usd_diff_rate}%</small></span></div>
            <img src="{usd_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title">코스닥</strong><span class="price{kosdaq_class}"><span class="numb">{kosdaq_value}</span><small>{kosdaq_diff_value} {kosdaq_diff_rate}%</small></span></div>
            <img src="{kosdaq_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title">DOW</strong><span class="price{dow_class}"><span class="numb">{dow_value}</span><small>{dow_diff_value} {dow_diff_rate}%</small></span></div>
            <img src="{dow_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title{gold_kor_class}">국내 금<rt>(원/g)</rt></strong><span class="price{gold_kor_class}"><span class="numb">{gold_kor_value}</span><small>{gold_kor_diff_value} {gold_kor_diff_rate}%</small></span></div>
            <img src="{gold_kor_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title">NASDAQ</strong><span class="price{nasdaq_class}"><span class="numb">{nasdaq_value}</span><small>{nasdaq_diff_value} {nasdaq_diff_rate}%</small></span></div>
            <img src="{nasdaq_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title{gold_world_class}">국제 금<rt>(USD/OZS)</rt></strong><span class="price{gold_world_class}"><span class="numb">{gold_world_value}</span><small>{gold_world_diff_value} {gold_world_diff_rate}%</small></span></div>
            <img src="{gold_world_img_url}">
        </li>
        <li class="list">
            <div class="list-box"><strong class="title">S&amp;P 500</strong><span class="price{sap500_class}"><span class="numb">{sap500_value}</span><small>{sap500_diff_value} {sap500_diff_rate}%</small></span></div>
            <img src="{sap500_img_url}">
        </li>
    </ul>
</div>
        `;

        html = html.replace('{base_date}', this._getDateStr(this.finance_data['kospi']['base_date']));

        for( var k in this.finance_data ){
            html = html.replace(new RegExp('{'+k+'_class}', 'g'), (this.finance_data[k]['diff_sign'] > 0 ? ' plus' : (this.finance_data[k]['diff_sign'] == 0 ? ' zero' : '')))
                        .replace('{'+k+'_value}', this.finance_data[k]['value'])
                        .replace('{'+k+'_diff_value}', (this.finance_data[k]['diff_value']*1).toFixed(2))
                        .replace('{'+k+'_diff_rate}', (this.finance_data[k]['diff_rate'] == 0 ? '&nbsp;' : '') + (this.finance_data[k]['diff_rate']*1).toFixed(2))
                        .replace('{'+k+'_img_url}', this.finance_data[k]['img_url']);
        }

        $('#stock-layer-area').append(html);
    }

    onReadyAction(){
        setInterval(function(){
            $('#finance_news li').eq(0).slideUp(1000, function(){
                $(this).appendTo('#finance_news');
                $(this).show();
            });
            $('.stock-box li').eq(0).slideUp(1000, function(){
                $(this).appendTo('.stock-box ul');
                $(this).show();
            });
        }, 4000);
    }

    toggleOverlay(){
        let togBtn = document.querySelector(".stock-layer")
        if( togBtn.classList.contains('on') == false ){
            togBtn.classList.add('on');
            $('html').addClass('open');
        }else{
            togBtn.classList.remove('on');
            $('html').removeClass('open');
        }
    }

    _getDateStr(millisecond){
        var date_obj = new Date(millisecond);
        var year = date_obj.getFullYear();
        var month = date_obj.getMonth() + 1;
        var date = date_obj.getDate();
        var hour = date_obj.getHours();
        var minute = date_obj.getMinutes();
        var ampm = hour >= 12 ? '오후' : '오전';
        hour = hour % 12;
        hour = hour || 12;
        minute = minute < 10 ? '0' + minute : minute;
        var date_str = `${year}.${month}.${date} ${ampm} ${hour}:${minute}`;

        return date_str;
    }
};
/* PpomFinance END */

/* AjaxCall START */
var call_method = '';
var call_param = '';
var call_flag = -1;

var ajaxCall = function (method, arg) {
    var args = [].slice.call(arg);
    var param = args.join();
    if(call_flag == 1){
        return false;
    }
    call_flag = 1;

    $.ajax({
        type: "POST",
        data: {"mode":method, "data":param},
        dataType: "json",
        url: "/zboard/ajax_command_line.php",
        beforeSend: function(){
            if( call_method == method && call_param == param )    return false;
            call_method = method;
            call_param = param;
        },
        success: function(data) {
            if (data.responseArray.length > 0) {
                if(method == 'choice_common_agent' || method == 'choice_market_agent'){
                    location.reload();
                }

                for (var i = 0, len = data.responseArray.length; i < len; i++) {
                    var row = data.responseArray[i];
                    if (row.type == 'alert') {
                        if (row.msg != '') {
                            alert(row.msg);
                        }
                        if (row.location != null) {
                            location.href = row.location;
                        }
                    } else if (row.type == 'confirm') {
                        if (confirm(row.msg) === true) {
                            if (row.location != null) {
                                location.href = row.location;
                            }
                        }
                    } else if (row.type == 'script') {
                        new Function( row.msg )();
                    } else if (row.type == 'assign') {
                        $("#"+row.obj).html(row.data);
                    } else if (row.type == 'select') {
                        $("div#help_selec_"+row.obj).remove();
                        $("span#helpvote_"+row.obj).html(row.data);
                    }else {
                        alert('시스템 오류입니다. 관리자에게 문의해주세요.');
                    }
                    call_flag = -1;
                }
            } else {
                call_flag = -1;
                alert('시스템 오류입니다. 관리자에게 문의해주세요.');
            }
        },
        error:function(error){
            call_flag = -1;
        }
    });
}

var xajax_buyscrap = function() { ajaxCall("buyscrap", arguments); };
var xajax_review_write = function() { ajaxCall("review_write", arguments); };
var xajax_vote = function() { ajaxCall("vote", arguments); };
var xajax_help_vote = function() { ajaxCall("help_vote", arguments); };
var xajax_help_cancel = function() { ajaxCall("help_cancel", arguments); };
var xajax_report = function() { ajaxCall("report", arguments); };
var xajax_market_delete = function() { ajaxCall("market_delete", arguments); };
var xajax_choice_market_agent = function() { ajaxCall("choice_market_agent", arguments); };
var xajax_choice_common_agent = function() { ajaxCall("choice_common_agent", arguments); };
var xajax_board_help_win = function() { ajaxCall("board_help_win", arguments); };
/* AjaxCall END */

/* BBS Vote START */
function p_vote(cmd, id, no, from) {
    if( G_IS_GUEST && G_IS_GUEST_BOARD ){
        alert("회원만 추천이 가능합니다.");
        return;
    }

    if( G_IS_GUEST ){
        if( !confirm('로그인 이후에 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?') ){
            return;
        }

        var url_obj = new URL(location.href);
        var s_url = url_obj.pathname + url_obj.search + url_obj.hash;

        auth_login(decodeURI(s_url));
        return;
    }
    
    if( G_IS_BBS_VOTE_BLOCKED && G_IS_VOTE_FREE ){
        alert("48시간이 지난 게시글에는 추천점수가 부여되지 않습니다.");
        //alert("48시간 지난 게시글은 추천하실 수 없습니다.");
        //return;
    }    

    if( !G_PERM_BBS_VOTE ){
		alert("추천하기 기능은 레벨 3부터 사용이 가능합니다");
		return;
	}

    if( typeof(from) == 'undefined' ){
        from = '';
    }

	xajax_vote(cmd, id, no, 0, 0, from);
}

function p_vote_check(member_no, bbs_member_no) {
	if( !member_no ){
		alert("로그인 후 추천하기 사용이 가능합니다.(레벨 3 이상)");
    }else if( member_no == bbs_member_no ){
        // 본인게시글
	}else{
	    alert("추천하기 기능은 레벨 3부터 사용이 가능합니다");
	}
}

function vote_feed_list(bbs_id, bbs_no, is_guest_bbs, is_vote_blocked, perm_vote, selector){
    if( G_IS_GUEST && is_guest_bbs ){
        alert("회원만 추천이 가능합니다.");
        return;
    }

    if( G_IS_GUEST ){
        if( !confirm('로그인 이후에 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?') ){
            return;
        }

        var url_obj = new URL(location.href);
        var s_url = url_obj.pathname + url_obj.search + url_obj.hash;

        auth_login(decodeURI(s_url));
        return;
    }
    
    if( is_vote_blocked && G_IS_VOTE_FREE ){
    	alert("48시간이 지난 게시글에는 추천점수가 부여되지 않습니다.");
        //alert("48시간 지난 게시글은 추천하실 수 없습니다.");
        //return;
    }

    if( !perm_vote ){
		alert("추천하기 기능은 레벨 3부터 사용이 가능합니다");
		return;
	}

	xajax_vote('vote', bbs_id, bbs_no, 0, 0, selector);
}
/* BBS Vote END */

/* Anonymous Block iOS START */
var AnonymousBlock = new class {
    constructor(){
        this.isCall = false;
    }

    blockArticle(bbsId, bbsNo){
        if( !confirm('차단한 사용자의 게시물은 목록에서 보이지 않습니다.\n\n차단 하시겠습니까?') ){
            return;
        }

        var url = '/new/_ajax_anonymous_block.php';
        var data = {"cmd":"block_bbs", "bbs_id":bbsId, "bbs_no":bbsNo};
        this._ajax(url, data, function(res){
            alert(res.msg);
            history.go(-1);
        }.bind(this));
    }

    blockComment(bbsId, bbsNo, cmtNo){
        if( !confirm('차단한 사용자의 게시물은 목록에서 보이지 않습니다.\n\n차단 하시겠습니까?') ){
            return;
        }

        var url = '/new/_ajax_anonymous_block.php';
        var data = {"cmd":"block_cmt", "bbs_id":bbsId, "bbs_no":bbsNo, "cmt_no":cmtNo};
        this._ajax(url, data, function(res){
            alert(res.msg);
            $('#ctx_'+cmtNo).parent('.sect-cmt').remove();
        }.bind(this));
    }

    _ajax(url, data, success){
        if( this.isCall ) return;
        this.isCall = true;

        $.ajax({
            "url":url,
            "data":data,
            "type":"post",
            "dataType":"json",
            "context":this,
        }).always(function(){
            this.isCall = false;
        }).done(function(res){
            if( res.code == 'OK' ){
                success(res);
            }else if( res.code == 'ERR' ){
                alert(res.msg);
            }else{
                console.log(res);
            }
        }).fail(function(err){
            console.error(err);
        });
    }
};
/* Anonymous Block iOS END */

function go_help_done_ok(type, qstr) {
    if ( type == 'ing' ){
        document.location.href="/new/include/help_ing_ok.php?"+qstr;
    }else if ( type == 'reserv' ){
        document.location.href="/new/include/help_reserv_ok.php?"+qstr;
    }else{
        document.location.href="/new/include/help_done_ok.php?"+qstr;
    }
}

/* PPOMBROWSER user agent checker START */

function safe_get_user_agent() {
    if( 
        typeof navigator === 'undefined' ||
        navigator === null ||
        typeof navigator.userAgent != 'string'
    ){
        console.log("something wrong.. safe_get_user_agent fail. ");
        return "";
    }

    return navigator.userAgent;
}

function ppombrowser_extract_version(ua) {
    // PPOMBrowser/       : 정확히 "PPOMBrowser/" 뒤를 찾음
    // (\d+(?:\.\d+)+)    : 숫자·점 조합 1회 이상 캡처 (3, 3.1, 3.1.7, 4.0.1.23 …)
    // \s*\((?:android|ios) : 공백 뒤 "(android" 또는 "(ios" 확인
    // i 플래그            : 대소문자 무시
    if(!ua || typeof ua != 'string'){
      return null;
    }
    const re = /ppombrowser\/(\d+(?:\.\d+)+)\s*\((?:android|ios)/i;
    const m = re.exec(ua);
    return (m && m[1]) ? m[1] : null;
}

function ppombrowser_cmp_version(v1, v2) {
    var a = v1.split('.'),
        b = v2.split('.'),
        len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var diff = (+a[i] || 0) - (+b[i] || 0); // 존재하지 않으면 0
      if (diff) return diff > 0 ? 1 : -1;
    }
    return 0;
}

function ppombrowser_is_at_least_version(vCur, vBase) {
    try {
      const isValidVer = v => (typeof v === 'string' ? true : false);
      if(!isValidVer(vCur) || !isValidVer(vBase)){
        console.error("input invalid!!!");
        return false;
      }
      return ppombrowser_cmp_version(vCur, vBase) >= 0;
    }catch(e){
      console.error(e);
      return false;
    }
}

function is_XXX_PPOMBrowser(app_os_name = null, minium_version = null) {
    if(app_os_name != 'android' && app_os_name != 'ios'){
        console.error("Unsupported app_os_name.");
        console.error(app_os_name);
        return false;
    }
    const reString = "ppombrowser.*"+app_os_name;
    const mUserAgent = safe_get_user_agent();
    const is_ppom = mUserAgent.toLowerCase().match(reString) != null;
    if(!is_ppom || minium_version === null){
        return is_ppom;
    }
    const current_version = ppombrowser_extract_version(mUserAgent);
    if(!current_version){
        return false;
    }
    return ppombrowser_is_at_least_version(current_version, minium_version);
}

function is_Android_PPOMBrowser(minium_version = null) {
    return is_XXX_PPOMBrowser("android", minium_version);
}

function is_iOS_PPOMBrowser(minium_version = null) {
    return is_XXX_PPOMBrowser("ios", minium_version);
}

function is_PPOMBrowser(android_minimum_version = null, ios_minimum_version = null) {
    return is_Android_PPOMBrowser(android_minimum_version) || is_iOS_PPOMBrowser(ios_minimum_version);
}

/* PPOMBROWSER user agent checker END */


/* View Toolbar START */
var hashtags = "ppomppu";
var url = G_MOB_SSL_URL + "/new/bbs_view.php?id="+G_BBS_ID+"&no="+G_BBS_NO;
var pc_url = G_WWW_SSL_URL + "/zboard/view.php?id="+G_BBS_ID+"&no="+G_BBS_NO;
var sns_br = "\n";
var kakao_inited = false;

function kakao_init(){
    if( !kakao_inited && typeof(Kakao) != 'undefined' ){
        kakao_inited = true;
        Kakao.init('a4be20cdff9bdf5f5e255b071dfcaf85');
    }
}

function share_line()
{
        if( navigator.userAgent.toLowerCase().indexOf("ppombrowser") != -1 && navigator.userAgent.toLowerCase().indexOf("android") != -1 ) {
            var popOption = 'width=420, height=680, resizable=no, scrollbars=no, status=no;';
            var surl = "http://line.me/R/msg/text/?"+encodeURIComponent(title + sns_br + url)
            var wp = window.open(surl, 'line', popOption);
            if ( wp ) {
                wp.focus();
            }
            return;
        }
        window.open("http://line.me/R/msg/text/?"+encodeURIComponent(title + sns_br + url), '_blank');
}

function twitter()
{
        window.open('https://twitter.com/share?text='+encodeURIComponent(title) + '&url=' + encodeURIComponent(url) + '&hashtags=' + encodeURIComponent(hashtags) + '&related=ppomppu_co_kr', '_blank');
}

function facebook()
{
		window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(url)+'&t='+encodeURIComponent(title), '_blank');
}

function share_email()
{
        window.location = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(url);
}
function add_bookmark(){
        $("#book_mark_category_text").hide();

        jQuery.ajax({
                type: "POST",
                url: "/new/_ajax_bookmark.php",
                contentType: "application/x-www-form-urlencoded; charset=euc-kr",
                success: function(data) {
                        console.log(data);
                        $("#book_mark_category").html(data);
                },
                error: function(data){
                        alert('등록실패\n관리자에게 문의 바랍니다2.');
                }

        });

}

function topBookmarkIconClickHandler() {
	$('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon.png');
    $('.js-bookmark-top-icon').removeClass('off');
}


//일반적인 닫기
function bt_ok(){
        document.getElementById('ex2').style.display = 'none';
}

jQuery(function($){
        var mapWindow = $('.mwMap_02');
        // Hide Window
        mapWindow.find('>.bg').mousedown(function(event){
                bt_ok();
        });
});

var is_bookmark_exists = 0;
var bookmark_ing = false;

function hide_bookmark_popup() {
    let layerPopup = $('.js-bbs-view-bookmark-popup');
    layerPopup.hide();
}

function insert_bookmark(){
    if(bookmark_ing){
        alert('북마크 등록이 진행중입니다');
        return;
    }else{

        is_bookmark_exists = -1;
        bookmark_ing = true;
        jQuery.ajax({
            type: "POST",
            data : $("#insert_bookmark").serialize(),
            //dataType : 'json',
            url: "/nzboard/bookmark_mgr.php?cmd=ajax_add",
            success: function(data) {
                var retString = data.split("|");
                var retCode  = retString[0];
                var retMsg = retString[1];

                bookmark_ing = false;

                if( retCode == 'S' ){ // SUCCESS
                    is_bookmark_exists = -1;
                    add_bookmark();
                    $('.buttons.btn-bookmark').addClass('on');
                    $('.buttons.btn-bookmark').removeClass('off');
                    if($('.bt .wrapper').length == 0){
                        // CASE ppomppu app
                        $('body').append('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup js-ppom-app"><span>북마크가 등록되었습니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
                    } else {
                        $('.bt .wrapper').before('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup"><span>북마크가 등록되었습니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
                    }

                    const popupHandler = function(e) {
                                console.log('click!');
                                let layerPopup = $('.js-bbs-view-bookmark-popup');
                                console.log(e.target);
                                console.log(layerPopup);
                                if(layerPopup.has(e.target).length === 0 || e.target.className === 'xBtn'){
                                    console.log('close!!')
                                    layerPopup.hide();
                                    $(document).off('mouseup', popupHandler);
                                }
                    }
                    $(document).mouseup(popupHandler);
                     if($('.bt .wrapper').length == 0){
                        // CASE ppomppu app
                        // $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
                    } else {
                        if($('.bt .wrapper') && $('.bt .wrapper').is(':visible')){
                            $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
                        }
                    }
                }else if( retCode == 'EC' ){ // ERROR & CLOSE
                    if( retMsg == 'ALREADY_EXISTS' ){
                        is_bookmark_exists = -1;
                    }else{
                        is_bookmark_exists = 0;

                        alert(retMsg);
                        bt_ok();
                    }

                }else if( retCode == 'E' ){ // ERROR
                    is_bookmark_exists = 0;

                    alert(retMsg);

                }else{
                    is_bookmark_exists = 0;
                    alert('등록실패\n관리자에게 문의 바랍니다.');
                }
            },
            error: function(data){
                is_bookmark_exists = 0;
                bookmark_ing = false;
                alert('등록실패\n관리자에게 문의 바랍니다2.');
            }
        });
    }
}

function go_bookmark_mgr(){
    location.href=G_MOB_URL+"/new/bookmark_list.php";
}

$.is_share_menu_click = false;

$(document).ready(function(){
	$('.btn-share').click(function() {
		$('.share-popup').show();
		$('.dimmed').show();
	});
	$('.btn-share-menu').click(function() {
        $.is_share_menu_click = true;
		$('.share-popup').show();
		$('.dimmed').show();
        $('.three-rung-menu').hide();
	});
	$('.dimmed').click(function() {
		$('.share-popup').hide();
		$(this).hide();
        $('.three-rung-menu').hide();
	});
	$('.share-popup .btn-close').click(function() {
		$('.share-popup').hide();
		$('.dimmed').hide();
        $('.three-rung-menu').hide();
	});
    $(document).on('click', function(e){
        if( $.is_share_menu_click == false && $('.share-popup:visible').length > 0
            || $.is_share_menu_click == false && $('.three-rung-menu:visible').length > 0
        ){
            e.preventDefault();
            $('.share-popup').hide();
            $('.dimmed').hide();
            $('.three-rung-menu').hide();
        }
        $.is_share_menu_click = false;
    });

    $('#book_mark_category').on('change', function(){
        console.log($(this).val());
        if( $(this).val() == 0 ){
            $(this).hide();
            $("#book_mark_category_text").val('');
            $('#book_mark_category_text').show();
        }else{
            $(this).show();
            $('#book_mark_category_text').hide();
        }
    });

    if(typeof _user != 'undefined' && _user == '0') return;   
    if( is_bookmark_exists == 1 ){ 
        $('.buttons.btn-bookmark').addClass('on');
        $('.buttons.btn-bookmark').removeClass('off');
        $('.js-bookmark-top-icon').removeClass('off');
        $('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon.png');
        return;
    }
    is_bookmark_exists = -1;
});

function check_bookmark_exists(callback, callbackForExists = function(){}){
    jQuery.post('/nzboard/bookmark_mgr.php?cmd=check_exists', $("#insert_bookmark").serialize(), function(res){
        if( res == 'ALREADY_EXISTS' ){
            is_bookmark_exists = 1;
            $('.buttons.btn-bookmark').addClass('on');
            $('.buttons.btn-bookmark').removeClass('off');
            $('.js-bookmark-top-icon').removeClass('off');
            $('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon.png');
            callbackForExists();
        }else{
            is_bookmark_exists = -1;
            callback();
        }
    });
}

function check_category_text(obj){
    var maxlength = 10;
    if( obj.value.length > maxlength ){
        obj.value = obj.value.substr(0, maxlength);
        alert("카테고리 이름은 한글/영문 최대 " +maxlength+ "자까지 가능합니다.");
    }
}

function is_share_ppom_ios(){
    var agent = window.navigator.userAgent;
    var check = false;
    if(agent.indexOf("PPOMBorwser") != -1 && agent.indexOf("ios") != -1){
        check = true;
    }

    return check;
}

function share_bookmark(){
	$('.share-popup').hide();
	$('.dimmed').hide();

    if( G_IS_GUEST ){
        if( !confirm('로그인 이후에 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?') ){
            return;
        }

        var url_obj = new URL(location.href);
        var s_url = url_obj.pathname + url_obj.search + url_obj.hash;

        auth_login(decodeURI(s_url));
        return;
    }

    function callback4Insert() {
        insert_bookmark();
        $('.buttons.btn-bookmark').removeClass('off');
        $('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon.png');
        $('.js-bookmark-top-icon').removeClass('off');
    }
    function callback4Exists() {
        show_existed_bookmark();
        $('.buttons.btn-bookmark').removeClass('off');
        $('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon.png');
        $('.js-bookmark-top-icon').removeClass('off');
    }
    check_bookmark_exists(callback4Insert, callback4Exists);
}

function show_existed_bookmark() {
    is_bookmark_exists = -1;
    $('.buttons.btn-bookmark').addClass('on');
    $('.buttons.btn-bookmark').removeClass('off');
    if($('.bt .wrapper').length == 0){
        // CASE ppomppu app
        $('body').append('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup js-ppom-app"><span>이미 등록된 북마크 입니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
    } else {
        $('.bt .wrapper').before('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup"><span>이미 등록된 북마크 입니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
    }

    const popupHandler = function(e) {
                console.log('click!');
                let layerPopup = $('.js-bbs-view-bookmark-popup');
                console.log(e.target);
                console.log(layerPopup);
                if(layerPopup.has(e.target).length === 0 || e.target.className === 'xBtn'){
                    console.log('close!!')
                    layerPopup.hide();
                    $(document).off('mouseup', popupHandler);
                }
    }
    $(document).mouseup(popupHandler);
    if($('.bt .wrapper').length == 0){
        // CASE ppomppu app
        // $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
    } else {
        if($('.bt .wrapper') && $('.bt .wrapper').is(':visible')){
            $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
        }
    }
}

function delete_bookmark() {

    is_bookmark_exists = -1;
    jQuery.ajax({
            type: "POST",
            data : $("#insert_bookmark").serialize(),
            //dataType : 'json',
            url: "/nzboard/bookmark_mgr.php?cmd=ajax_del",
            success: function(data) {
                console.log(data);
                var retString = data.split("|");
                var retCode  = retString[0];
                var retMsg = retString[1];

                bookmark_ing = false;

                if( retCode == 'S' ){ // SUCCESS
                    is_bookmark_exists = -1;
                    $('.buttons.btn-bookmark').addClass('off');
                    $('.buttons.btn-bookmark').removeClass('on');

                    $('#bookmark-txt').remove();
                    if($('.bt .wrapper').length == 0){
                        // CASE ppomppu app
                        $('body').append('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup js-ppom-app"><span>북마크가 제거되었습니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
                    } else {
                        $('.bt .wrapper').before('<div id="bookmark-txt" class="js-bbs-view-bookmark-popup"><span>북마크가 제거되었습니다.</span><a href="/new/bookmark_list.php" class="check">북마크 보기</a><img class="xBtn" src="/images/btn_close.png" alt="x버튼"></div>');
                    }


                    const popupHandler = function(e) {
                                console.log('click!');
                                let layerPopup = $('.js-bbs-view-bookmark-popup');
                                console.log(e.target);
                                console.log(layerPopup);
                                if(layerPopup.has(e.target).length === 0 || e.target.className === 'xBtn'){
                                    console.log('close!!')
                                    layerPopup.hide();
                                    $(document).off('mouseup', popupHandler);
                                }
                    }
                    $(document).mouseup(popupHandler);
                    if($('.bt .wrapper').length == 0){
                        // CASE ppomppu app
                        // $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
                    } else {
                        if($('.bt .wrapper') && $('.bt .wrapper').is(':visible')){
                            $('.js-bbs-view-bookmark-popup').addClass('js-book-with-bt');
                        }
                    }

                    $('.js-bookmark-top-icon img').attr('src', 'https://cdn3.ppomppu.co.kr/images/bookmark_icon_gray.png');
                    $('.js-bookmark-top-icon').addClass('off');
                }else{
                    alert('제거실패\n관리자에게 문의 바랍니다.');
                }
            },
            error: function(data){
                console.log(data);
                bookmark_ing = false;
                alert('제거실패\n관리자에게 문의 바랍니다2.');
            }
        });
}

function open_coupang_app() {
    if( typeof navigator === 'undefined' || 
        navigator === null ||
        typeof navigator.userAgent != 'string'
    ){
        console.error("something wrong. empty navigator.userAgent ");
        return;
    }

    if( navigator.userAgent.toLowerCase().match("ppombrowser.*android") != null ){
		console.log("Android app.");
        if( typeof HTMLOUT != "undefined" && HTMLOUT != null && typeof HTMLOUT.openCoupangApp != "undefined" ){
			HTMLOUT.openCoupangApp();
			console.log("completed");
		}else {
			console.log("not existed f.");
		}
        return;
    }

    if( navigator.userAgent.toLowerCase().match("ppombrowser.*ios") != null ){
		console.log("iOS app.");
        if( typeof HTMLOUT_IOS != "undefined" && HTMLOUT_IOS != null && typeof HTMLOUT_IOS.openCoupangApp != "undefined" ){
			HTMLOUT_IOS.openCoupangApp();
			console.log("completed.");
		}else {
			console.log("not existed f..");
		}
        return;
    }

    console.error("something wrong. no ppombrowser.");
}

function share_kakao()
{
    kakao_init();

    var desc = G_TOOLBAR_DESC;
    var imageUrl = G_TOOLBAR_IMAGEURL;

	if(imageUrl.indexOf("http") == -1)
		imageUrl = imageUrl.replace("//", "http://");

	Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: desc,
          imageUrl: imageUrl,
          link: {
        	  mobileWebUrl: url,
              webUrl: pc_url
          }
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: url,
              webUrl: pc_url
            }
          },
          {
            title: '앱으로 보기',
            link: {
            	mobileWebUrl: G_MOB_URL + '/new/exec_app.php?id='+G_BBS_ID+'&no='+G_BBS_NO,
            	webUrl:  G_MOB_URL + '/new/exec_app.php?id='+G_BBS_ID+'&no='+G_BBS_NO,
            	androidExecParams : 'googleappindexing/'+G_BBS_ID+'/'+G_BBS_NO,
                iosExecParams : 'view_board?id='+G_BBS_ID+'&no='+G_BBS_NO
            }
          }
        ]
      });
}

function share_band(){
    var popOption = 'width=420, height=680, resizable=no, scrollbars=no, status=no;';
    var surl = 'http://band.us/plugin/share?body=' + encodeURIComponent(url) + '\\n' + encodeURIComponent(title) + '&route=www.ppomppu.co.kr';
    var wp = window.open(surl, 'band', popOption);
    
    if ( wp ) {
     wp.focus();
    }   
}
function share_twitter(){

    var short_url = url;

    var popOption = 'width=650, height=440, resizable=no, scrollbars=no, status=no;';
    var move_url = 'http://twitter.com/share?url=' + encodeURIComponent(short_url) + '&text=' + encodeURIComponent(title);
    
    var wp = window.open(move_url, 'twitter', popOption);
    if ( wp ) {
        wp.focus();
    } 

    return;

	$.ajax({
        type: "POST",
        data: {"longUrl":url},
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=EUC-KR",
        url: "/new/_ajax_short_url.php",
        success: function(data) {

            var short_url = url;
            
            if (data) {
            	short_url = data.id;
            } 
        	
            var popOption = 'width=650, height=440, resizable=no, scrollbars=no, status=no;';
            var move_url = 'http://twitter.com/share?url=' + encodeURIComponent(short_url) + '&text=' + encodeURIComponent(title);
            
            var wp = window.open(move_url, 'twitter', popOption);
            
            if ( wp ) {
              wp.focus();
            } 
            
        },
        error: function(e){
            
        },
    });

      
}
function share_facebook() {
    var popOption = 'toolbar=0,status=0,width=626,height=436';
    var surl = 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(url)+'&t='+encodeURIComponent(title);
    var wp = window.open(surl, 'facebook', popOption);

    if ( wp ) {
        wp.focus();
    }  
    return false;
}
function share_kakaostory(){
    Kakao.Story.share({
        url  : url,
        text : title
    });
}

var locationField = document.getElementById('copyTarget')

$(document).on('click', '#copyButton', function() {
    var copy_result = get_copy_clipboard('copyTarget');
    if( copy_result == 1 ){
        alert('URL이 복사되었습니다.');
    }else if( copy_result == -1 ){
        alert('URL 복사에 실패했습니다.');
    }else{
        alert('지원하지 않는 브라우저입니다.');
    }
});

function copyToClipboard(elem) {
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    var succeed;
    try {
          succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    return succeed;
}
/* View Toolbar END */

/* BBS Kebab Menu START */
// new BbsKebabMenu('#js_kebab_menu_1', {"bookmark_btn":1,...}, {"bbs_id":"humor",...}).draw().binding();
class BbsKebabMenu {
    constructor(selector, stat, data){
        this.selector = selector;
        this.stat = stat;
        this.data = data;

        return this;
    }

    draw(type){
        if( typeof(type) == 'undefined' ) type = 'normal';

        var selector = this.selector;
        var stat = this.stat;
        var data = this.data;
        var elem = {
            "bookmark_btn":""
            ,"copy_url_btn":""
            ,"share_btn":""
            ,"claim_btn":""
            ,"claim_user_btn":""
            ,"block_user_btn":""
            ,"move_btn":""
            ,"del_btn":""
        };

        if( stat['bookmark_btn'] ){
            elem['bookmark_btn'] = `<a herf="javascript:;" class="js_bookmark"><span class="js-bookmark-top-icon off"><img src="${G_CDN_URL}/images/bookmark_icon_gray.png" alt="북마크 아이콘" width="14" height="13">북마크</span></a>`;
        }

        elem['copy_url_btn'] = `<a herf="javascript:;" class="js_copy_url"><span><img src="/images/link_copy_icon_button_m.png" alt="주소복사 아이콘" width="14" height="14">주소복사</span></a>`;

        elem['share_btn'] = `<a herf="javascript:;" class="js_share"><span><img src="/images/three_rung_menu_icon_share_m.png" alt="공유하기 아이콘" width="14" height="12">공유하기</span></a>`;

        if( stat['claim_btn'] ){
            elem['claim_btn'] = `<a herf="javascript:;" class="js_claim"><span><img src="/images/three_rung_menu_icon_report_m.png" alt="신고하기 아이콘" width="13" height="13">신고하기</span></a>`;
        }

        if( stat['claim_user_btn'] ){
            elem['claim_user_btn'] = `<a herf="javascript:;" class="js_claim_user"><span><img src="/images/icon-user-notify-m.png" alt="신고하기 아이콘" width="13" height="13">사용자신고</span></a>`;
        }

        if( stat['block_user_btn'] ){
            elem['block_user_btn'] = `<a herf="javascript:;" class="js_block_user"><span><img src="${G_CDN_URL}/images/m_icon_user_block.png" alt="익명차단 아이콘" width="14" height="14">사용자차단</span></a>`;
        }

        if( stat['move_btn'] ){
            elem['move_btn'] = `<a herf="javascript:;" class="js_move"><span><img src="${G_CDN_URL}/images/icon_move.png" alt="이동요청" width="13" height="13">이동요청</span></a>`;
        }

        switch( stat['del_btn'] ){
            case 1:
            case -2:
                elem['del_btn'] = `<a herf="javascript:;" class="js_del"><span><img src="${G_CDN_URL}/images/icon_delete1.png" alt="삭제하기" width="13" height="13">삭제하기</span></a>`;
                break;
            case -1:
                elem['del_btn'] = `<a herf="javascript:;" class="js_del"><span><img src="${G_CDN_URL}/images/icon_delete1.png" alt="삭제취소" width="13" height="13">삭제취소</span></a>`;
                break;
            default:
                break;
        }

        var html = ``;

        if( type == 'feed' ){
            html += `<button type="button" class="feed-menu js_menu"></button>`;
        }else{
            html += `<span class="three-rung_menu_icon_button js_menu"></span>`;
        }

        html += `
<div class="three-rung-menu" id="three-rung-menu" style="display:none;">
${elem['bookmark_btn']}
${elem['copy_url_btn']}
${elem['share_btn']}
${elem['claim_btn']}
${elem['claim_user_btn']}
${elem['block_user_btn']}
${elem['move_btn']}
${elem['del_btn']}
</div>
`;
        if( $(selector).text() == '' ){
            $(selector).append( html );
        }

        return this;
    }

    binding(){
        var selector = this.selector;
        var stat = this.stat;
        var data = this.data;

        // menu
        $(selector).find('.js_menu').on('click', ()=>{
            var menu = $(selector).find('.three-rung-menu');

            $.is_share_menu_click = true;
            if( menu.is(':visible') ){
                $('.three-rung-menu').hide();
                menu.hide();
            }else{
                $('.three-rung-menu').hide();
                menu.show();
            }
        });

        // bookmark
        $(selector).find('.js_bookmark').on('click', ()=>{
            $('input[name=book_mark_subject]').val( data['subject'] );
            $('input[name=book_mark_url]').val( data['url'] );

            topBookmarkIconClickHandler();
            share_bookmark();

            return false;
        });

        // copy_url
        $(selector).find('.js_copy_url').on('click', ()=>{
            $('#copyTarget').val( data['url'] );
            switch( get_copy_clipboard('copyTarget') ){
                case 1: alert('URL이 복사되었습니다.'); break;
                case -1: alert('URL 복사에 실패했습니다.'); break;
                default: alert('지원하지 않는 브라우저입니다.'); break;
            }
        });

        // share
        $(selector).find('.js_share').on('click', ()=>{
            if( G_BBS_ID != data['bbs_id'] || G_BBS_NO != data['bbs_no'] ){
                G_TOOLBAR_DESC = data['desc'];
                G_TOOLBAR_IMAGEURL = data['img_url'];
                G_BBS_ID = data['bbs_id'];
                G_BBS_NO = data['bbs_no'];
                title = data['subject'];
                url = data['url'];
                pc_url = G_WWW_SSL_URL + "/zboard/view.php?id="+data['bbs_id']+"&no="+data['bbs_no'];
                $('input[name=book_mark_subject]').val( data['subject'] );
                $('input[name=book_mark_url]').val( data['url'] );

                drawSharePopup('new');
            }

            $.is_share_menu_click = true;
            $('.three-rung-menu').hide();
            $('.share-popup').show();
        });

        // claim
        $(selector).find('.js_claim').on('click', ()=>{
            G_BBS_ID = data['bbs_id'];
            G_BBS_NO = data['bbs_no'];
            G_IS_MARKET_DEAL_BOARD = data['is_real_market'];
            title = data['subject'];

            switch( stat['claim_btn'] ){
                case 2: openClaimForm('company_bbs'); break;
                case 1: openClaimForm('bbs'); break;
                case -1: alert('신고 기능은 레벨 3부터 가능합니다.\n불법촬영물 신고는 사이트 하단의 [불법촬영물 신고] 링크를 통해 확인해 주세요.'); break;
                case -2: alert('로그인 후 신고가 가능합니다. (레벨 3 이상)\n불법촬영물 신고는 사이트 하단의 [불법촬영물 신고] 링크를 통해 확인해 주세요.'); break;
                default: break;
            }
        });

        // claim_user
        $(selector).find('.js_claim_user').on('click', ()=>{
            G_BBS_ID = data['bbs_id'];
            G_BBS_NO = data['bbs_no'];
            G_IS_MARKET_DEAL_BOARD = data['is_real_market'];
            title = data['subject'];

            switch( stat['claim_user_btn'] ){
                case 1: openClaimForm('bbs_user'); break;
                case -1: alert('신고 기능은 레벨 3부터 가능합니다.'); break;
                case -2: alert('로그인 후 신고가 가능합니다. (레벨 3 이상)'); break;
                default: break;
            }
        });

        // block_user
        $(selector).find('.js_block_user').on('click', ()=>{
            AnonymousBlock.blockArticle(data['bbs_id'], data['bbs_no']);
        });

        // move
        $(selector).find('.js_move').on('click', ()=>{
            G_BBS_ID = data['bbs_id'];
            G_BBS_NO = data['bbs_no'];

            openMoveForm();
        });

        // del
        $(selector).find('.js_del').on('click', ()=>{
            $('#DelForm input[name=bbs_id]').val( data['bbs_id'] );
            $('#DelForm input[name=bbs_no]').val( data['bbs_no'] );

            if( data['is_real_market'] ){
                $('#DelForm [data-type=market_bbs]').show();
                $('#DelForm [data-type=normal_bbs]').hide();
            }else{
                $('#DelForm [data-type=market_bbs]').hide();
                $('#DelForm [data-type=normal_bbs]').show();
            }

            switch( stat['del_btn'] ){
                case 1: openDelForm('bbs'); break;
                case -1: xajax_vote('del', data['bbs_id'], data['bbs_no'], data['vote_no']); break;
                case -2: alert('운영진이 삭제취소한 게시글입니다.'); break;
                default: break;
            }
        });
    }
}
/* BBS Kebab Menu END */
