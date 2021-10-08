import * as vscode from 'vscode';
import { newMap } from './commands';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "graphein" is now active!');

	context.subscriptions.push(...[
		vscode.commands.registerCommand('graphein.newMap', newMap)
	]);
}

export function deactivate() {}