exports.handler = function(event, context) {
	// let messages = {
	// 	'Records': [{
	// 		'Sns': {
	// 			'Message': {
	// 				'page_id': 1013
	// 			}
	// 		}
	// 	}]};

	let GLOBAL = require('./config.js');
	let config = require('config');
	if(!event){
		console.log('event error',event);
		return false;
	}
//	base.js
	let base = require('./base.js');
	let message = base.getSnsMessage(event);
	if(!message){
		console.log('analyze event error');
		return false;
	}
	let ID = message['page_id'];
//	mustache.js
	let mustache = require('mustache');
//	init s3
	//let AWS = require('aws-sdk');
	let awsConfig = config.get('awsConfig');
	let S3 = require('aws-sdk/clients/s3');
	let s3 = new S3(awsConfig);
////////////////////// mysql access
	let dbConfig = config.get('dbConfig');
	let mysql = require('mysql');
	let connection = mysql.createConnection(dbConfig);
	connection.connect();
	connection.query(GLOBAL.searchTemplate(ID), function (error, results, fields) {
		if (error) throw error;
		let result = results[0];
		let supplyingIds = result.supplyingIds,
			templateName = result.templateName,
			templateBucketPath = result.templatePath.substring(1).substring(0,result.templatePath.substring(1).indexOf('/')),
			templateKeyPath = result.templatePath.substring(1).substring(result.templatePath.substring(1).indexOf('/')).substring(1) + '/',
			merchantId = result.merchantID,
			userId = result.userId;
		connection.query(GLOBAL.searchSupplyings(supplyingIds), function (error, supplyingsInfo, fields) {
			if(error) throw error;
			var productInfo = { data: supplyingsInfo };
			// console.log(productInfo);
			s3.getObject({
				'Bucket': templateBucketPath,
				'Key': templateKeyPath + templateName +'.html'
			},(err, data)=>{
				if(err) throw err;
				// console.log(data);
				let resultStr = mustache.render(data.Body.toString(),productInfo);
				let nowTime = parseInt(new Date().getTime()/1000);
				let key = GLOBAL.resultPath + merchantId + '/'+ userId + '/' + nowTime + '/' + templateName +'.html';

				s3.putObject({
					'Bucket': 'microgravity-public',
					'Key': key,
					// 'ContentType': 'text/plain',
					'ContentType': 'text/html',
					'ContentEncoding': 'UTF-8',
					'Body': resultStr
				}, (err, data) => {
					if(err) throw(err);
					//template insert database
					connection.query(GLOBAL.insertToSysFiles(templateName, templateBucketPath, key, ID, nowTime),function(error,results,fields){
						if(error) throw error;
						//update cmc_page database
						connection.query(GLOBAL.updateCmcPage(results.insertId, ID),function(error, results, fields){
							if(error) throw error;
							console.log('success');
						});
						connection.end();
					});
				});
			});

			// connection.end();
		});
	});

/*
////////////////////// s3 list directory
	//let AWS = require('aws-sdk');
	let S3 = require('aws-sdk/clients/s3');
	let awsConfig = config.get('awsConfig');
	let s3Config = config.get('s3Config');

	let s3 = new S3(awsConfig);
	let prefix = s3Config.get('prefix') + '/share_temp/欢迎使用微分助手_1/';
	s3.listObjectsV2({
		'Bucket': 'microgravity-public',
		'Prefix': prefix
	}, (err, data) => {
		if (err)
			console.log(err, err.stack);
		else if (data && 'Contents' in data)
			data['Contents'].forEach(content => {
				console.log(content['Key']);
				//console.log(content['Key'].substring(prefix.length));
			});
		else
			console.log('No Contents');
	});
	// let prefix = 'dev/share_temp/欢迎使用微分助手_1/';
	// let prefix = 'dev/commercial_temp/flip/';
	// s3.listObjectsV2({
	// 	'Bucket': 'microgravity-public',
	// 	'Prefix': prefix
	// }, (err, data) => {
	// 	if ('Contents' in data)
	// 		data['Contents'].forEach(content => {
	// 			console.log(content['Key']);
	// 			console.log(content['Key'].substring(prefix.length));
	// 		});
	// 	else
	// 		console.log('No Contents');
	// });

////////////////////// qrcode
	// qrcode.toDataURL('https://www.baidu.com', {version: 4}, function (err, url) {
		// console.log(url);
	// });

////////////////////// s3 get file
	// s3.getObject({
	// 	'Bucket': 'microgravity-public',
	// 	'Key': 'dev/test_YXF/result.html'
	// },(err, data)=>{
	// 	console.log(data);
	// 	// console.log(data.Body.toString());
	// });

////////////////////// s3 upload file
	// let text = '{{#data}}商品编号: {{productCode}}  商品名称: {{productName}}{{/data}}';
	// s3.putObject({
	// 	'Bucket': 'microgravity-public',
	// 	'Key': 'dev/test_YXF/template.html',
	// 	// 'ContentType': 'text/plain',
	// 	'ContentType': 'text/html',
	// 	'ContentEncoding': 'UTF-8',
	// 	'Body': text
	// }, (err, data) => {
	// 	console.log(data);
	// });

////////////////////// s3 delete file
	s3.deleteObjects({
		'Bucket': 'microgravity-public',
		'Delete': {
			'Objects': [{
				'Key': 'dev/test_upload/some_shit.txt'
			}, {
				'Key': 'dev/test_upload/some_shit3.txt'
			}],
			'Quiet': true
		}
	}, (err, data) => {
		console.log(data);
	});
*/
	// s3.deleteObjects({
	// 	'Bucket': 'microgravity-public',
	// 	'Delete': {
	// 		'Objects': [{
	// 			'Key': 'dev/test_upload/some_shit.txt'
	// 		}, {
	// 			'Key': 'dev/test_upload/some_shit3.txt'
	// 		}],
	// 		'Quiet': true
	// 	}
	// }, (err, data) => {
	// 	console.log(data);
	// });
};

