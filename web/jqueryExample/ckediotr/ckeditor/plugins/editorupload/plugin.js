(function() {
	//Section 1 : 按下自定义按钮时执行的代码 
	var a = {
			exec: function(editor) {
				var folderId = ''
				var obj = editor.getSelection().getSelectedElement();
				//obj.getAttribute('style');  获取HTML元素属性
				$.jBox('get:../../js/ckeditor/plugins/editorupload/editLibrary.html', {
					width: 900,
					height: 600,
					title: '媒体资源库',
					buttons: {
						'取消': false
					},
					id: 'sizeList',
					loaded: function() {
						function getFolders(folderId) {
							if(folderId == '' || folderId == '1' || folderId == null) {
								$(".backBtn").hide()
							} else {
								$(".backBtn").show()
							}
							ImageShowFolders.save({
								search:false,
								depotId: "1", //图片
								classifyId: folderId
							}, function(res) {
								if(res.success) {
									var folderList = res.data.classifys;
									var str = "";
									$(".backBtn button").attr('data-id', folderId)
									folderList.forEach(function(folder, index) {
										str += '<dl class="folder" data-id=' + folder.classifyId + '>' +
											'<dt><img src="../../images/folder.png" alt="" /></dt>' +
											'<dd>' + folder.classifyName + '</dd>' +
											'</dl>'
									});
									var resourceList = res.data.resource;
									resourceList.forEach(function(resource, index) {
										//										if(resource.resourceType == 1) {} 
										str += '<dl class="file" data-type="resource" data-resourceId="' + resource.resourceId + '" data-resourceMd5=' + resource.resourceMd5 + ' data-id=' + resource.imageId + '>' +
											'<dt><a href="javascript:void(0)"><img src="' + resource.resourceUrl + '"  onerror=this.onerror=null;this.src="../../images/img.png" alt="" /></a></dt>' +
											'<dd>' + resource.resourceName + '</dd>' +
											'</dl>'
									});
									$(".listBox").html(str);
								}
							})
						}
						getFolders(folderId)
						//去掉默认的右键点击事件
						document.oncontextmenu = function(e) {
							return false;
						};
						/*双击事件打开文件夹*/
						$(".listBox").delegate('dl.folder', 'dblclick', function(e) {
							folderId = $(this).attr("data-id");
							getFolders(folderId)
						});
						$(".listBox").delegate('dl.file', 'dblclick', function(e) {
							var resourceMd5 = $(this).attr('data-resourceMd5')
							$.jBox("get:../../js/ckeditor/plugins/editorupload/popup/sizeList.html", {
								title: '尺寸列表',
								width: 900,
								height: 600,
								buttons: {
									'确定': true,
									'取消': false
								},
								loaded: function() {
									QueryImagesByResourceMD5.save({
										resourceMd5: resourceMd5
									}, function(res) {
										if(res.success) {
											var str = '';
											var res = res.data
											for(var i = 0; i < res.length; i++) {
											str += '<tr data-imageId="' + res[i].id + '" data-imageSize=' + res[i].width +'*'+ res[i].height + '  data-imageUrl=' + res[i].ftpUrl + ' data-resourceId=' + res[i].resourceId + '>'
												str += '<td><input type=radio name=choseSize/></td>'
												str += '<td>' + res[i].width +'*'+ res[i].height + '</td>'
												if(res[i].originalImage == '1') {
													str += '<td>是</td>'
												} else {
													str += '<td>否</td>'
												}
												str += '<td><a class=viewSize>查看</a></td>'
												str += '</tr>'
											}
											$(".tableBox tbody").html(str)
											$(".tableBox").on('click', '.viewSize', function() {
												var imageSize = $(this).parent().parent().attr('data-imageSize')
												var imageUrl = $(this).parent().parent().attr('data-imageUrl')
												imageSize = imageSize.split("*")
												$.jBox('html:<div class="imageView"><img/></div>', {
													title: '查看所选图片大小',
													width: 800,
													height: 600,
													loaded: function() {
														$('.imageView').parent().css('overflow', 'auto')
														$('.imageView img').attr('src', imageUrl).css('width', imageSize[0]).css('height', imageSize[1]).css('max-width', 'none')

													}
												})
											})

										}
									})
								},
								submit: function(v, h, f) {
									if(v) {
										if($("[type=radio]").is(':checked')) {
											var choseMessage = $("[type=radio]:checked").parent().parent();
											var imageSize = choseMessage.attr('data-imagesize')
											imageSize = imageSize.split('*')
											if(obj) {
												if(obj.getName() == 'img') {
													obj.setAttribute("data-cke-saved-src", choseMessage.attr('data-imageUrl'))
													obj.setAttribute("src", choseMessage.attr('data-imageUrl'))
													obj.setAttribute('data-cite',true)
													obj.setAttribute('data-imageId',choseMessage.attr('data-imageId'))
													obj.setAttribute('width', imageSize[0])
													obj.setAttribute('height', imageSize[1])
													$.jBox.close('sizeList')
												}
											} else {
												$.jBox.close('sizeList')
												CKEDITOR.instances.contenteditor.insertHtml('<img data-cite="true" data-imageId="'+choseMessage.attr('data-imageId') +'" style="width:' + imageSize[0] + 'px;height:' + imageSize[1] + 'px"  src="' + choseMessage.attr('data-imageUrl') + '"/>')
											}
										} else {
											jBox.error('请先选择尺寸')
											return false
										}
									}
								}
							})

						});
						//返回文件夹
						$(".backBtn").on('click', '.backBtn', function() {
							var classifyId = $(this).attr('data-id')
							QueryClassifyById.save({
								classifyId: classifyId ? classifyId : '1'
							}, function(res) {
								if(res.success) {
									getFolders(res.data.layerClassify)

								} else {
									jBox.error('返回上级失败')
								}
							})
						})
					}
				})

			}
		},
		//Section 2 : 创建自定义按钮、绑定方法 
		b = 'editorupload';
	CKEDITOR.plugins.add(b, {
		init: function(editor) {
			editor.addCommand(b, a);
			editor.ui.addButton('editorupload', {
				label: '编辑图片',
				icon: this.path + 'images.png',
				command: b
			});
		}
	});
})();