			var flag = false;
			var url ;
			var loadpic = 'http://114.80.151.109/spa/m/2015bl/images/place.jpg';
			var b = {
				headimgurl:headimgurl,
				nickname : nickname,
				openid : openid,
				action : action
			};
			function viewData(){
				var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
				var j = window, h = document, k = h.documentElement;
				e = k.clientWidth || h.body.clientWidth || 0;
				l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
				g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
				i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
				f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
				m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
				return {scrollTop: g,scrollLeft: i,documentWidth: f,documentHeight: m,viewWidth: e,viewHeight: l};
			}

			function _initScrollEnd(parma){
				url = parma;
				var that = this;
				var timeout = null;
				var scrollEvent = "ontouchmove" in document.documentElement ? "touchmove" : "scroll";
				$(window).on(scrollEvent, function(){
					if(flag) return;
					if(timeout) {
						clearTimeout(timeout);
					}
					timeout = setTimeout(function(){
						var vd = viewData();
						that.ald = 0;
						if(vd.viewHeight + vd.scrollTop + that.ald >= vd.documentHeight){
							_loadNews();
						}
					}, 100);
				});
			}

			function _loadNews() {
				$('.more_btn').html('加载中……');$('.loadingbtn').css('opacity',1);
				flag = true;
				var that = this;
				_setLoadingState(true);
			}

			function _setLoadingState(isLoading,time){
				var id= $('.card').last().attr('data');
				var furl = url+'&id='+id;
				//console.log('_setLoadingState');
				var that = this;
				var insert =$(".card:last");
				that.isLoading = isLoading;
				if(isLoading){
					$('.more_btnbox').css('display','block');
					_getData(furl);
				}else {
					$('.masklaod').css('display','none');
				}
			}

			function _getData(furl){
				//console.log('_getData');
				$.ajax({
					type : "get",
					async: false,
					url  : furl, //跨域请求的URL
					dataType : "jsonp",
					jsonp: "jsoncallback",
					jsonpCallback: "success_jsonpCallback",
					success : function(json){
						var response = json['newslist'];
						/*2.2.3 初始化下拉*/
						if(response ==""){
							$('.more_btn').html('已经加载全部');$('.loadingbtn').css('opacity',0);
							flag = true;
							return;
						}
						for(var i=0;i<response.length;i++){
							var ddd = response[i]['imagegroup'].length;
							var info = response[i];
							var newhtml = orderList(response[i]);
							$(".contWrap").append(newhtml);
							if(i == response.length-1){
								$(".demo-image").unveil();
								_start();
								flag = false;
								$('.more_btn').html('上拉加载更多');$('.loadingbtn').css('opacity',0);
								$('.conW').removeClass('cafter').removeClass('active').attr('data','');
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						//alert("error"); console.log(XMLHttpRequest);
					}
				});
			}

			function _start(){
				$('.pics li').on('click',function(){
					$('#canvas').css({
						'display':'block',
						'z-index':'1000'
					});
					$('#canvas').removeClass('small').addClass('big');
					var item = $(this).find('img');
					var index = $(this).index();
					new Slider({
						dom : document.getElementById('canvas'),
						item : item,
						index : index
					});
				});
			}

			//格式化日期
			function formateDate(date) {
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				var d = date.getDate();
				var h = date.getHours();
				var mi = date.getMinutes();
				m = m > 9 ? m : '0' + m;
				return m + '-' + d + ' ' + h + ':' + mi;
			}
			
			function pichandle(piclist){
				var html = '';
				for(var j = 0;j<piclist.length;j++){
					if (piclist[j] == ''){
						html+= '';
					}else{
						html +='<li><img class="demo-image"  src="'+loadpic+'" data-src="'+piclist[j]+'" width="100%"></li>';
					}
				}
				return html;
			}

			function orderList(list,param){
				if(list['newstext']){
					var newstext = '<p>'+list['newstext']+'</p>';
				}else{
					var newstext = '';
				}
				var xx = '<img src="http://114.80.151.109/spa/m/2015bl/images/logo.png" width="100%">';
				var name = list['phonenum'];
				var time = '<div class="time">'+list['newstime']+'</div>';
				var id = list['id'];
				var piclist = list['imagegroup'];
				var picL = list['imagegroup'].length;
				var comlist = list['comments'];
				var comL = list['comments'].length;
				var pichtml = '';
				var pic = '';
				var card = '';
				var clist = '';
				var classname = '';
				var ppeople = '';
				var tname = '抢单';
				var icon ='<div class="icons"></div>';
				var intext = '<input type="text" placeholder="评论" class="comment">';
				if(piclist!=""){
					if(picL == 1){
						pichtml = pichandle(piclist);
						pic ='<div class="pics"><ul>'+pichtml+'</ul></div>';
					}
					else if (picL == 4) {
						pichtml = pichandle(piclist);
						pic = '<div class="pics media-pic-list type-scube"><ul>'+pichtml+'</ul></div>';
					}
					else if (picL ==3 ||picL == 2 ){
						pichtml =  pichandle(piclist);
						pic = '<div class="pics media-pic-list"><ul>'+pichtml+'</ul></div>';
					}
					else if(picL > 4){
						pichtml =  pichandle(piclist);
						pic = '<div class="pics media-pic-list"><ul>'+pichtml+'</ul></div>';
					}
				}else{
					pic = '';
				}
				if(list['deal'] == 1){
					classname = 'show';
					ppeople = '<li class="praises-total"><ol class="add" date_opid='+list['openid']+'><span>'+list['nickname']+'</span></ol></li>';
				}
				if(list['deal'] == 1 && b.openid == list['openid']){
					tname = '取消';
				}
				if(comL > 0){
					var classname = 'show';
					for(var i = 0;i<comL;i++){
						if( comlist[i]['openid']== b.openid){
							var self = 'self';
						}else{
							var self = '';
						}
						if( comlist[i]['tonickname'] != ''){
							var talk = '<span class="name">'+comlist[i]['nickname']+'</span><em>回复</em><span class="tname">'+comlist[i]['tonickname']+'</span><span>:</span>';
						}else{
							var talk = '<span class="name">'+comlist[i]['nickname']+'</span><span>:</span>';
						}
						clist += '<li user="'+self+'" class="clearfix li_comment "  data-li="'+comlist[i]['id']+'">'+
									'<i><img src="'+comlist[i]['titlepic']+'" width="100%"></i>'+
									'<p class="spanW">'+talk+
										'<span class="word">'+comlist[i]['comments']+'</span>'+
										'<em class="comment-time">'+comlist[i]['newstime']+'</em>'+
									'</p>'+
								'</li>';
					}
				}
				card = '<div class="card" data="'+id+'">'+
							'<div class="head clearfix">'+
								'<div class="media-main">'+xx+'</div>'+
								'<div class="item-list">'+
									'<p class="phone">'+name+'</p>'+newstext+''+pic+''+
								'</div>'+
							'</div>'+
							'<div class="func">'+time+''+icon+''+
								'<ul class="total '+classname+' " total="" data-ul="'+id+'">'+ppeople+''+clist+'</ul>'+
								'<div class="praises-comment clearfix">'+
									'<input type="text" placeholder="评论" class="comment">'+
									'<span class="cancel" >取 消</span>'+
									'<button class="btn" disable="disabled">留 言</button>'+
									'<span class="num"><span class="length">0</span>/140</span>'+
								'</div>'+
								'<div class="conW">'+
									'<ul class="content">'+
										'<li class="add">'+
										'<span>'+tname+'</span>'+
										'</li>'+
										'<li class="com">'+
										'<span>留言</span>'+
										'</li>'+
									'</ul>'+
								'</div>'
							'</div>'+
						'</div>';
				return card;
			}

			$(document).on('tap','.cancel',function(e){
				var el = $(this);
				var box = $(this).parents('.func');
				var now = box.find('.now.praises-comment');
				now.find('button').attr('disable','disabled').attr('talk','').attr('datali','');
				now.find('.comment').val('');
				now.removeClass('now');
				now.css('display','none');
			});

			function leftright(box,el){
				var comw = box.find('.conW');
				if(comw.attr('data') == 'has'){
					comw.addClass('cafter').attr('data','');
					setTimeout(function(){
						comw.removeClass('cafter').removeClass('active');
					},200);
				}else{
					$('.conW').removeClass('cafter').removeClass('active').attr('data','');
					comw.addClass('active').attr('data','has');
				}
			}

			/*first 点击icon*/
			$(document).on('tap','.icons',function(e){
				var el = $(this);
				var box = $(this).parents('.func');
				leftright(box,el);
			});

			function praiseBox(box, el) {
				var txt = el.find('span').html();
				var total = box.find('.total');
				var id = total.attr('data-ul');
				slideto(box);
				if (txt == '抢单') {
					total.css('display','block');
					var url = 'http://api.kankanews.com/wechat/wxmp/kkapp/order.json?openid='+b.openid+'&id='+id+'&nickname='+b.nickname+'&command=order';
					console.log(url);
					$.ajax({
						type : "get",
						async: false,
						url  : url, //跨域请求的URL
						dataType : "jsonp",
						jsonp: "jsoncallback",
						jsonpCallback: "success_jsonpCallback",
						success : function(json){
							console.log(json);
							if(json.error_code == "200"){
								var liHtml = '<li class="praises-total"><ol class="add"><span>'+b.nickname+'</span></ol></li>';
								var insert = total.find('li:first');
								if(insert.length  == 0){
									total.append(liHtml);
								}else{
									insert.before(liHtml);
								}
								el.find('span').html('取消');
							}else{
								$('.ui-loading-block.qd').addClass('show');
								setTimeout(function(){
									$('.ui-loading-block.qd').removeClass('show');
								},1000);
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
						//alert('error');
						}
					});
				}
				else{
					var url = 'http://api.kankanews.com/wechat/wxmp/kkapp/order.json?openid='+b.openid+'&id='+id+'&nickname='+b.nickname+'&command=cancel';
					console.log(url);
					$.ajax({
						type : "get",
						async: false,
						url  : url, //跨域请求的URL
						dataType : "jsonp",
						jsonp: "jsoncallback",
						jsonpCallback: "success_jsonpCallback",
						success : function(json){
							console.log(json);
							if(json.error_code == "200"){
								total.find('.praises-total').remove();
								el.find('span').html('抢单');
							};
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
						//alert('error');
						}
					});
				}
			}

			/*点击接单*/
			$(document).on('tap','.content .add',function(e){
				var el = $(this);
				var box =$(this).parents('.func');
				praiseBox(box, el);
			});

			function slideto(box){
				var comw = box.find('.conW');
				comw.addClass('cafter').attr('data','');
				setTimeout(function(){
					comw.removeClass('cafter').removeClass('active');
				},200);
			}

			/*点击评论 评论按钮状态改变focus*/
			function textBox(box, el){
				slideto(box);
				box.find('.praises-comment').css('display','block').addClass('now');
				box.find('button').attr('disable','false');
				setTimeout(function(){
					box.find('input').focus();
				},500);
			}
			
			/*点击评论*/
			$(document).on('tap','.content .com',function(e){
				var el = $(this);
				var box =$(this).parents('.func');
				textBox(box, el);
			});


			/*评论字数状态改变focus*/
			function enter(el,_this,box){
				el.on('keyup',function(){
					var val = _this.value;
					var len = val.length;
					var btn = box.find('button');
					var word = box.find('.num');
					if (len <=0 || len > 140) {
						btn.attr('class','btn btn-off');
					}
					else {
						console.log(140);
						btn.attr('class','btn');
					}
					word.html(len + '/140');
				});
			}

			/*点击评论框 评论字数状态改变focus*/
			$(document).on('focus','.praises-comment .comment',function(e){
				var _this = this;
				var el = $(this);
				var box =el.parents('.func');
				enter(el,_this,box);
			});

			/**
			 * 发评论
			 * @param box 每个分享的div容器
			 * @param el 点击的元素
			 */
			function reply(box, el,textarea,name,datali){
				var comment = box.find('.comment');//评论div
				var praises_all = box.find('.praises-comment');
				var blid = box.parents('.card').attr('data');//bid
				var word = box.find('.praises-comment .num');//字数
				var total =  box.find('.total');
				total.css('display','block');
				var api = b.action;
				var url = 'cross.php';
				var time = formateDate(new Date());
				var tonickname = '';
				if(name){
					var tonickname = name;
					var talk = '<span class="name">'+b.nickname+'</span><em>回复</em><span class="tname">'+name+'</span><span>:</span>';
				}else{
					var tonickname = '';
					var talk = '<span class="name">'+b.nickname+'</span><span>:</span>';
				}
				//console.log(api,b.openid,blid,b.nickname,b.headimgurl,textarea);
				$.post(url,{api:api,openid:b.openid,bid:blid,nickname:b.nickname,headimgurl:b.headimgurl,comments:textarea,tonickname:tonickname,cid:datali},function(result){
					console.log(result);
					el.attr('disable','false');
					json = JSON.parse(result);
					var id = json.last_id;
					console.log(json.last_id);
					var liHtml = '<li user="self" class="clearfix li_comment" data-li="'+id+'">'+
									'<i><img src='+b.headimgurl+' width="100%"></i>'+
									'<p class="spanW">'+talk+
										'<span class="word">'+textarea+'</span>'+
										'<em class="comment-time">'+time+'</em>'+
									'</p>'+
								 '</li>';
					$('.ui-loading-block.tj').removeClass('show');
					box.find('.total').append(liHtml);
					comment.val('');
					praises_all.removeClass('now');
					word.html('0/140');
				});
			}

			/*点击评论按钮*/
			$(document).on('tap','.praises-comment .btn',function(e){
				var el = $(this);
				var box =el.parents('.func');
				var comment = box.find('.comment');//评论div
				var textarea = comment.val();//comments
				var name = '';
				var datali = '';
				if(textarea == ''){
					return
				}
				if($(this).hasClass('btn-off')){
					return
				}
				if($(this).attr('disable') == 'disabled'){
					return
				}
				if($(this).attr('talk') != ''){
					name = $(this).attr('talk');
					datali = $(this).attr('datali');
				}
				comment.val('');
				el.attr('disable','disabled');
				$('.ui-loading-block.tj').addClass('show');
				var praises_all = box.find('.praises-comment');
				praises_all.css('display','none');
				reply(box, el,textarea,name,datali);
			});

			/**
			 * 操作留言
			 * @param el 点击的元素
			 */
			function operate(el,box,id,datali){
				var comment = box.find('.praises-comment');
				comment.css('display','block').addClass('now');
				setTimeout(function(){
					box.find('input').focus();
				},500);
				var name = el.find('.name').html();
				box.find('button').attr('disable','false');
				box.find('button').attr('talk',name);
				box.find('button').attr('datali',datali);
			}

			/*评论点击删除*/
			$(document).on('tap','.total li',function(e){
				var _this = $(this);
				var id = _this.attr('data-li');
				var box =_this.parents('.func');
				if($(this).attr('user') == 'self'){
						setTimeout(function(){
							$('.ui-actionsheet').addClass('show');
							window.ontouchmove=function(e){
								e.preventDefault && e.preventDefault();
								e.returnValue=false;
								e.stopPropagation && e.stopPropagation();
								return false;
							}
						},100);
						$('.ui-actionsheet button').on('tap',function(){
							var url = 'http://api.kankanews.com/wechat/wxmp/kkapp/delcomment.json?openid='+b.openid+'&id='+id;
							if($(this).hasClass('ui-actionsheet-del')){
								$.ajax({
									type : "get",
									async: false,
									url  : url, //跨域请求的URL
									dataType : "jsonp",
									jsonp: "jsoncallback",
									jsonpCallback: "success_jsonpCallback",
									success : function(json){
										console.log(json);
										if(json.error_code == "200"){
											_this.remove();
										};
									},
									error: function(XMLHttpRequest, textStatus, errorThrown) {
									//alert('error');
									}
								});
							}
							$('body').css('overflow','auto');
							setTimeout(function(){
								$('.ui-actionsheet').removeClass('show');
							},500);
							window.ontouchmove=function(e){
								e.preventDefault && e.preventDefault();
								e.returnValue=true;
								e.stopPropagation && e.stopPropagation();
								return true;
							}
						});
				}else{
					var datali = _this.attr('data-li');
					operate(_this,box,id,datali);
				}
			});



