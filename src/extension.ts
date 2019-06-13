import * as vscode from 'vscode';
const { window, commands, workspace } = vscode;

const OSS = require('ali-oss');



export function activate(context: vscode.ExtensionContext) {
	const config = workspace.getConfiguration('pandaUp');
	let aliOSSClient = {};
	if (config.get('uploadTarget') === 'aliOSS') {
		aliOSSClient = new OSS({
			region: config.get('aliOSSRegion'),
			accessKeyId: config.get('aliOSSAccessKeyId'),
			accessKeySecret: config.get('aliAccessKeySecret'),
			bucket: config.get('aliOSSBucket')
		});	
	}

	let disposable = commands.registerCommand('extension.PandaUp', () => {
		window.showOpenDialog({}).then(file  => {
			const path = file[0].path;
			const editor = window.activeTextEditor;
			const active = editor.selection.active;

			if (aliOSSClient) {
				aliOSSClient.put('object', path).then(function (r1) {
					editor.edit(editRes => {
						editRes.insert(active, r1.url)
					})
					
					return aliOSSClient.get('object');
				}).then(function (r2) {
					console.log('get success: %j', r2);
				}).catch(function (err) {
					console.error('error: %j', err);
				});
			}
		});
		
		window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
