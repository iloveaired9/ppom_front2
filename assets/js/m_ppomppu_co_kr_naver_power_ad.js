let naver_ad_ver = "1.0";

function handle_naver_ads_response(response) { 
    // console.log('handle_naver_ads_response');
    // console.log(response);
    var powerlinkHTML = "";
    if( response.error )
    {
        console.log(response.error);    
    }else{
        var list = response.ads;
        var listLen = list?.length ?? 0;
        
        if(listLen>0) $("#div_new_power_link").show(); 

        for(var i=0; i<listLen; i++){
            powerlinkHTML += getPowerLinkHtml(list[i], null);
        }
        $("#powerlinknew").append(powerlinkHTML);
    }
}

function handle_naver_ads_response_top(response) { 
    // console.log('handle_naver_ads_response_top');
    // console.log(response);
    var powerlinkHTML = "";
    if( response.error )
    {
        console.log(response.error);    
    }else{
        var list = response.ads;
        var listLen = list?.length ?? 0;

        if(listLen>0) $("#div_new_power_link_top").show(); 

        for(var i=0; i<listLen; i++){
            powerlinkHTML += getPowerLinkHtml(list[i], 'AB');
        }
        const modifiedHtml = addAdIconToHtml(powerlinkHTML);
        $("#powerlinknew_top").append(modifiedHtml);
    }
}

function handle_naver_ads_response_bottom(response) { 
    // console.log('handle_naver_ads_response_bottom');
    // console.log(response);
    var powerlinkHTML = "";
    if( response.error )
    {
        console.log(response.error);    
    }else{
        var list = response.ads;
        var listLen = list?.length ?? 0;

        if(listLen>0) $("#div_new_power_link_bottom").show(); 

        for(var i=0; i<listLen; i++){
            powerlinkHTML += getPowerLinkHtml(list[i], 'B0');
        }
        $("#powerlinknew_bottom").append(powerlinkHTML);
    }
}

function handle_naver_ads_response_list_bottom(response) { 
    // m_ppomppu.ch6
    var powerlinkHTML = "";
    if( response.error )
    {
        console.log(response.error);    
    }else{
        var list = response.ads;
        var listLen = list?.length ?? 0;

        if(listLen>0) $("#div_new_power_link_list_bottom").show(); 

        for(var i=0; i<listLen; i++){
            powerlinkHTML += getPowerLinkHtml(list[i], 'AB');
        }
        $("#powerlinknew_list_bottom").append(powerlinkHTML);
    }
}

/*
채널을 한번에 사용의로 강제적용
m_ppomppu.ch5 
1. 비로그인시 
   -- 리스트 상단(powerlinknew_list), 리스트 하단( powerlinknew_list2 )
2. 로그인시
   -- 리스트 상단(광고없음)), 리스트 하단( powerlinknew_list )
다음작업시는 신규채널 추가로 작업요망
*/
function handle_naver_ads_response_list(response) { 

    var powerlinkHTML  = "";
    var powerlinkHTML2 = "";
    if( response.error )
    {
        console.log(response.error);    
    }else{
        var list    = response.ads;
        var listLen = list?.length ?? 0;

        if(listLen == 1){
            $("#div_new_power_link_list").show(); 
            powerlinkHTML += getPowerLinkHtml(list[0], 'AB');
            const modifiedHtml = addAdIconToHtml(powerlinkHTML);
            $("#powerlinknew_list").append(modifiedHtml);
        }else{

            if(listLen>=1)
                {
                    $("#div_new_power_link_list").show(); 
                    powerlinkHTML = getPowerLinkHtml(list[0], 'AB');
                    const modifiedHtml = addAdIconToHtml(powerlinkHTML);
                    $("#powerlinknew_list").append(modifiedHtml);
                }
        
                if(listLen>2)
                {
                    powerlinkHTML = '';
                    let idx = 1;
                    $("#div_new_power_link_list2").show(); 

                    for(var i=idx; i<listLen; i++){
                        powerlinkHTML += getPowerLinkHtml(list[i], 'B0');
                    }

                    $("#powerlinknew_list2").append(powerlinkHTML);
                }
            }
        // }

        //     if(listLen>=1)
        //     {
        //         //WEB-7587 강제로 2개 노출
        //         $("#div_new_power_link_list").show(); 
        //         powerlinkHTML  = '<div class="list type_BB">';
        //         powerlinkHTML += getPowerLinkHtml(list[0], 'BB');
        //         powerlinkHTML += getPowerLinkHtml(list[1], 'BB');
        //         powerlinkHTML += '</div>';
        //         const modifiedHtml = addAdIconToHtml(powerlinkHTML);
        //         $("#powerlinknew_list").append(modifiedHtml);
        //     }
            
        
        //     if(listLen>2)
        //     {
        //         powerlinkHTML = '';
        //         let idx = ( listLen > 2 ) ? 2 : 1;
        //         $("#div_new_power_link_list2").show(); 

        //         for(var i=idx; i<listLen; i++){
        //             powerlinkHTML += getPowerLinkHtml(list[i], 'B0');
        //         }

        //         $("#powerlinknew_list2").append(powerlinkHTML);
        //     }
        // }
    }
}

function getPowerLinkTypeHtml( type )
{
    var html = null;
    switch(type)
    {
        case 'A' :
            if( naver_ad_ver == '1.0' ){
                html = '<div class="list type_AA"><div><span class="title"><a href="##clickUrl##">##headline##</a></span><span class="url"><a href="##clickUrl##">##dispalyUrl##</a>##icon##</span><span class="desc"><a href="##clickUrl##">##description##</a></span></div>##imageExtension##</div>';
            }else{
                html = '<div class="list type_AA_plus"><p class="title"><a href="##clickUrl##">##headline##</a></p><div class="sectL"><span class="url"><a href="##clickUrl##">##dispalyUrl##</a>##icon##</span><span class="desc"><a href="##clickUrl##">##description##</a></span></div>##imageExtension##</div>';     
            }
        break;
        case 'B' : html = '<div class="list type_BB"><div><span class="title"><a href="##clickUrl##">##headline##</a></span>##headlineExtension####descriptionExtension##<span class="url"><a href="##clickUrl##">##dispalyUrl##</a>##icon##</span>##subLinkExtension##<span class="desc"><a href="##clickUrl##">##description##</a></span></div>##priceLinkExtension####placeExtension##</div>';
        break;
        case 'C' : html = '<div class="list type_CC"><div><span class="title"><a href="##clickUrl##">##headline##</a></span>##headlineExtension##<span class="url"><a href="##clickUrl##">##dispalyUrl##</a>##icon##</span><span class="desc"><a href="##clickUrl##">##description##</a></span>   </div>##imageExtension####descriptionExtension####subLinkExtension####priceLinkExtension####placeExtension##</div>';
        break;
        case 'BB': html = '<div class="list-box"><div><span class="title"><a href="##clickUrl##">##headline##</a></span>##headlineExtension####descriptionExtension##<span class="url"><a href="##clickUrl##">##dispalyUrl##</a></span>##subLinkExtension##<span class="desc"><a href="##clickUrl##">##description##</a></span></div></div>';
        break;        
    }
    return html;
}


function getPowerLinkHtml( dataObj, setAdGroup )
{
    var type    = '';
    var adGroup = '';

    // if( dataObj !== 'undefined' ) return '';
    // var is_descriptionExtension  = ('descriptionExtension' in dataObj && dataObj.descriptionExtension) ? true : false; //홍보 문구 확장소재
    // var is_headlineExtension     = ('headlineExtension'    in dataObj && dataObj.headlineExtension)    ? true : false; //추가제목 확장소재
    // var is_imageExtension        = ('imageExtension'       in dataObj && dataObj.imageExtension)       ? true : false; //파워링크이미지 확장소재
    // var is_priceLinkExtension    = ('priceLinkExtension'   in dataObj && dataObj.priceLinkExtension)   ? true : false; //가격링크 확장소재
    // var is_placeExtension        = ('placeExtension'       in dataObj && dataObj.placeExtension)       ? true : false; //플레이스정보 확장소재
    // var is_subLinkExtension      = ('subLinkExtension'     in dataObj && dataObj.subLinkExtension)     ? true : false; //서브링크 확장소재
    
    var is_descriptionExtension  = (dataObj.descriptionExtension !== 'undefined' && dataObj.descriptionExtension) ? true : false; //홍보 문구 확장소재
    var is_headlineExtension     = (dataObj.headlineExtension    !== 'undefined' && dataObj.headlineExtension)    ? true : false; //추가제목 확장소재
    var is_imageExtension        = (dataObj.imageExtension       !== 'undefined' && dataObj.imageExtension)       ? true : false; //파워링크이미지 확장소재
    var is_priceLinkExtension    = (dataObj.priceLinkExtension   !== 'undefined' && dataObj.priceLinkExtension)   ? true : false; //가격링크 확장소재
    var is_placeExtension        = (dataObj.placeExtension       !== 'undefined' && dataObj.placeExtension)       ? true : false; //플레이스정보 확장소재
    var is_subLinkExtension      = (dataObj.subLinkExtension     !== 'undefined' && dataObj.subLinkExtension)     ? true : false; //서브링크 확장소재
   


    var txt_descriptionExtension = '';
    var txt_headlineExtension    = '';
    var txt_imageExtension       = '';
    var txt_priceLinkExtension   = '';
    var txt_placeExtension       = '';
    var txt_subLinkExtension     = '';
    // var txtMobileImg = '<img src="/new/asset/images/m_1.png" title="" alt="" style="vertical-align:bottom;">';


    if( is_imageExtension )
    {
        adGroup = ( is_descriptionExtension || is_headlineExtension || is_priceLinkExtension || is_placeExtension || is_subLinkExtension ) ? 'C':'A';
    }else{
        adGroup = 'B';
    }

    //---------------------------------------------------------------
    // setAdGroup 용도변경
    // 1. setAdGroup = 'AB' 는 A Or B로 설정 데이터가 C 일때는 이미지가 있는 A로 변경적용된다.
    //---------------------------------------------------------------
    var isSetAdGroup = (setAdGroup == 'AB' || setAdGroup == 'BB' || setAdGroup == 'B0') ? true : false ;
    
    if( isSetAdGroup && adGroup == 'C'    ) adGroup = 'A';
    if( isSetAdGroup && setAdGroup == 'BB') adGroup = 'BB';
    if( isSetAdGroup && setAdGroup == 'B0') adGroup = 'B';  //강제로 B설정
    //---------------------------------------------------------------

    var icon       = getNaverPowerAdIcon(dataObj);

    if( adGroup == 'A' && ( (icon.length && dataObj.displayUrl.length > 20) || dataObj.headline.length > 13 ) ){
        adGroup = 'B';
    } 

    if(is_imageExtension) txt_imageExtension = getTxtImageExtension(dataObj.imageExtension, adGroup);
    
    
    // 확장소재 우선순위 지정 
    // 1. 서브링크 확장소재
    // 2. 추가제목 확장소재
    // 3. 홍보 문구 확장소재
    // 4. 가격링크 확장소재
    // 5. 플레이스정보 확장소재
    if     (is_subLinkExtension     && ! isSetAdGroup) txt_subLinkExtension     = getTxtSubLinkExtension(dataObj.subLinkExtension        , adGroup);
    else if(is_headlineExtension    && ! isSetAdGroup) txt_headlineExtension    = getTxtHeadlineExtension(dataObj.headlineExtension      , adGroup);    
    else if(is_descriptionExtension && ! isSetAdGroup) txt_descriptionExtension = getTxtDescriptionExtension(dataObj.descriptionExtension, adGroup);
    else if(is_priceLinkExtension   && ! isSetAdGroup) txt_priceLinkExtension   = getTxtPriceLinkExtension(dataObj.priceLinkExtension    , adGroup);
    else if(is_placeExtension       && ! isSetAdGroup) txt_placeExtension       = getTxtPlaceExtension(dataObj.placeExtension            , adGroup);
        
    var tmpHtm     = getPowerLinkTypeHtml(adGroup);
    var displayUrl = dataObj.displayUrl;
    var headline   = dataObj.headline;
    var strdesc    = dataObj.description;

    displayUrl = displayUrl.replace(/^https?:\/\//, '');


    if( naver_ad_ver == '1.0' ){    
        let url_cut_length = ( setAdGroup == 'BB' ) ? 40 : 40;
        if( dataObj.displayUrl.length > url_cut_length ) displayUrl = displayUrl.substr(0, url_cut_length)+'...';
    }

    if( strdesc.length > 45 ) strdesc = strdesc.substr(0, 45)+'...';
    var width = $(window).width();

    if( adKeyWord ) strdesc = adReplaceAll(strdesc,adKeyWord,'<b>'+adKeyWord+'</b>' );//검색 keyword 볼드처리

    tmpHtm = adReplaceAll(tmpHtm,"##headline##"            , headline);
    tmpHtm = adReplaceAll(tmpHtm,"##icon##"                , icon);
    tmpHtm = adReplaceAll(tmpHtm,"##clickUrl##"            , dataObj.clickUrl);
    tmpHtm = adReplaceAll(tmpHtm,"##dispalyUrl##"          , displayUrl);
    tmpHtm = adReplaceAll(tmpHtm,"##description##"         , strdesc);
    tmpHtm = adReplaceAll(tmpHtm,"##imageExtension##"      , txt_imageExtension);
    tmpHtm = adReplaceAll(tmpHtm,"##descriptionExtension##", txt_descriptionExtension);
    tmpHtm = adReplaceAll(tmpHtm,"##headlineExtension##"   , txt_headlineExtension);
    tmpHtm = adReplaceAll(tmpHtm,"##priceLinkExtension##"  , txt_priceLinkExtension);
    tmpHtm = adReplaceAll(tmpHtm,"##placeExtension##"      , txt_placeExtension);
    tmpHtm = adReplaceAll(tmpHtm,"##subLinkExtension##"    , txt_subLinkExtension);

    return tmpHtm;
}

function adReplaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

function getNaverPowerAdIcon(objData)
{
    var html   = '';
    var NPay   = objData.naverPayIconType;
    var NLogin = objData.isNaverLoginIconEnabled;
    var NTalk  = objData.isTalkTalkIconEnabled;
    // NPay = 0;
    // NTalk = true;
    // console.log('NPay==>'+NPay);
    // console.log('NLogin==>'+NLogin);
    // console.log('NTalk==>'+NTalk);

    if(NPay != 0 || NLogin == true || NTalk == true){
          if(NPay != 0) {
              if(NPay == 1){
                  html += '<img src="'+ G_CDN_URL +'/images/naver/m_npay.png" class="icon_npay" alt="NPay 아이콘">';
              } else if(NPay == 2){
                  html += '<img src="'+ G_CDN_URL +'/images/naver/m_npay_plus.png" class="icon_npay_plus" alt="NPay plus 아이콘">';
              }
          } else if (NLogin == true){
              html += '<img src="'+ G_CDN_URL +'/images/naver/m_naveridlogin.png" class="icon_naveridlogin" alt="Naver Login 아이콘">';
          } else if (NTalk == true) {
              html += '<img src="'+ G_CDN_URL +'/images/naver/m_talktalk.png" class="icon_talktalk" alt ="Naver Talk Talk 아이콘">';
          }
    }

    return html;
}

//---------------------------------------------------------------
// WEB-5202 / WEB-5203 참조
// 파워링크이미지 확장소재
// imageExtension
// imageExtension.imageUrl 
// imageExtension.clickUrl
//--------------------------------------------------------------- 
function getTxtImageExtension(objData, type)
{
    var rst = ''; 
    if(objData.imageUrl && objData.clickUrl)
    {
        if( naver_ad_ver == '2.0' && type == 'A' ){
            rst = '<div class="sectR"><a href="'+objData.clickUrl+'"><img src="'+objData.imageUrl+'"></a></div>';
        }else{
            rst = '<p class="img" ><a href="'+objData.clickUrl+'"><img src="'+objData.imageUrl+'" style="width:80px; height:80px"></a></p>';
        }
    }

    return rst;
}


//홍보 문구 확장소재
//descriptionExtension
//descriptionExtension.description 
function getTxtDescriptionExtension(objData, type)
{
    var rst     = '';
    var heading = '';

    if( objData.description ) heading = objData.description;

    if(objData.description)
    {
        if     ( type == 'B' ){
            rst = '<span class="sub_title2">##heading##'+objData.description+'</span>';
            rst = adReplaceAll(rst,'##heading##', '<i>'+objData.heading+'</i>&nbsp;');            
        }else if( type == 'C' ){
            rst = '<ul  class="sub_Place"><li>##heading##'+objData.description+'</li></ul>';
            rst = adReplaceAll(rst,'##heading##', '<font color="#619f04">'+objData.heading+'</font>&nbsp;');
        }
    }

    return rst;
}

//추가제목 확장소재
// headlineExtension.headline
// headlineExtension.clickUrl
function getTxtHeadlineExtension(objData, type)
{
    var rst = ''; 
    if(objData.headline && objData.clickUrl)
    {
        rst = '<span class="sub_title"><a href="'+objData.clickUrl+'"><font color="#2886d9">'+objData.headline+'</font></a></span>';
    }
    return rst;
// ##headlineExtension##
// headlineExtension.headline
// headlineExtension.clickUrl
// <span class="sub_title"><a href="headlineExtension.clickUrl">headlineExtension.headline</a></span>
}   

//가격링크 확장소재
// priceLinkExtension
// []clickUrl, modifier, name, price
function getTxtPriceLinkExtension(objData, type)
{
    var rst  = ''; 
    var tmpli= ''; 

    var listLen = objData?.length ?? 0;

    if( listLen > 0 )
    {
        for( i = 0, cnt = listLen; i < cnt; i++ )
        {
            price = numberWithCommas(objData[i].price);

            if( objData[i].modifier && objData[i].modifier != 'null' )
            {
                tmp_modifier = ( objData[i].modifier.substring(0,1) == '원' ) ? objData[i].modifier : '원'+objData[i].modifier;    
            }else{
                tmp_modifier = '원';
            }

            //tmp_modifier = ( objData[i].modifier && objData[i].modifier != 'null' ) ? objData[i].modifier : '원';
            tmpli += '<li ><a href="'+objData[i].clickUrl+'"><i></i><span>'+objData[i].name+'</span><span><b>'+price+'</b>'+tmp_modifier+'</span></a></li>';
        }

        rst = '<ul>'+tmpli+'</ul>'; 
    }
    return rst;
}

//플레이스정보 확장소재   
// placeExtension
// placeExtension.minimumPrice
// placeExtension.openingHours []
// placeExtension.promotionTitle
// placeExtension.reviewCount
// placeExtension.recentBookingCount
// placeExtension.averagePrice
// placeExtension.menuPrice
// placeExtension.clickUrl
function getTxtPlaceExtension(objData, type)
{
    var rst     = ''; 
    var tmp     = '';
    var tmp_var = '';
    var txtAlink='<a href="'+objData.clickUrl+'" style="display:unset">';
    if( objData.promotionTitle ) rst += '<li>'+txtAlink+objData.promotionTitle+'</a></li>'; 

    if( objData.reviewCount )       { tmp_var = (tmp.length>0)?'&nbsp;|&nbsp;':''; tmp += tmp_var + '리뷰&nbsp;'+objData.reviewCount; }
    if( objData.recentBookingCount ){ tmp_var = (tmp.length>0)?'&nbsp;|&nbsp;':''; tmp += tmp_var + '예약 &nbsp;'+objData.recentBookingCount; }
    if( objData.menuPrice )         { tmp_var = (tmp.length>0)?'&nbsp;|&nbsp;':''; tmp += tmp_var + '메뉴가격&nbsp;'+objData.menuPrice; }
    if( objData.minimumPrice )      { tmp_var = (tmp.length>0)?'&nbsp;|&nbsp;':''; tmp += tmp_var + '최소가격&nbsp;'+objData.minimumPrice; }
    if( tmp.length > 0 ) rst += '<li>'+txtAlink+tmp+'</a></li>'; 

    var listLen = objData?.openingHours?.length ?? 0;

    if( listLen > 0 )
    {
        var tmp_openingHours = '';
        for( i = 0, cnt = listLen; i < cnt; i++ )
        {
            var tmp_len = tmp_openingHours?.length ?? 0;
            tmp_var = (tmp_len>0)?',&nbsp;':'';
            tmp_openingHours += tmp_var+objData.openingHours[i];
        }

        rst += '<li>'+txtAlink+tmp_openingHours+'</a></li>'; 
    }
    var rst_len = rst?.length ?? 0;
    if(rst_len > 0) rst = '<ul class="sub_Place">'+rst+'</ul>';

    return rst;
}   

//서브링크 확장소재
// subLinkExtension
// [] clickUrl, name
function getTxtSubLinkExtension(objData, type)
{
    var rst  = ''; 
    var tmp= ''; 
    var data_len = objData?.length ?? 0;
    if( data_len > 0 )
    {
        for( i = 0, cnt = data_len; i < cnt; i++ )
        {
            tmp_var = (tmp.length>0)?'&nbsp;|&nbsp;':'';
            if     ( type == 'B' ) tmp = tmp+ tmp_var + '<a href="'+objData[i].clickUrl+'">'+objData[i].name+'</a>';
            else if( type == 'C' ) tmp = tmp+'<font color="#2886d9" font-size="0.8rem">'+tmp_var +'</font>'+ '<a href="'+objData[i].clickUrl+'"><font color="#2886d9" font-size="0.8rem">'+objData[i].name+'</font></a>';
        }

        if     ( type == 'B' )rst = '<span class="sub_title3">'+tmp+'</span>'; 
        else if( type == 'C' )rst = '<span class="sub_title2" style="margin-bottom:1em;border:0">'+tmp+'</span>'; 
    }
    return rst;
} 

function addAdIconToHtml(htmlString) {
    // 문자열을 HTML DOM으로 변환
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // 모든 <span class="title"> 요소 찾기
    const titleElements = doc.querySelectorAll(".title");

    titleElements.forEach(title => {
        const link = title.querySelector("a"); // <a> 태그 찾기
        if (link) {
            // 광고 아이콘 <span> 요소 생성
            const adIcon = document.createElement("span");
            adIcon.className = "link-icon";
            adIcon.textContent = "광고";

            // <a> 태그 내부의 맨 앞에 삽입
            link.prepend(adIcon);
        }
    });

    // 변경된 HTML을 다시 문자열로 변환하여 반환
    return doc.body.innerHTML;
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function PRINT_NAVER_ADPOST_V2(channel, pageSize, url, keywordGroup, query, callback, isTest)
{
    // isTest = false;  //오픈시는 무조건 막음...    
    if( isTest )console.log(channel,'PRINT_NAVER_ADPOST_V2==>', isTest );
    NAVER_ADPOST_V2({ 
        channel: channel, 
        pageSize: pageSize, 
        url:url,
        keywordGroup:keywordGroup,
        query:query,
        callback: callback,
        test: isTest, 
    });
}
