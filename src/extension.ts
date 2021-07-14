// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "type-hierarchy-sample" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('type-hierarchy-sample.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from type-hierarchy-sample!');
	});

	const selector = { scheme: 'file', language: 'plaintext' };
	let typeh = vscode.languages.registerTypeHierarchyProvider? vscode.languages.registerTypeHierarchyProvider(selector, {
		async prepareTypeHierarchy(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[]>{
			console.log("prepare");
			const range = new vscode.Range(position.with(undefined, 0), position.with(undefined, 999));
			const content = document.getText(range);
			const results: vscode.TypeHierarchyItem[] = [
				{
					name: content,
					kind: vscode.SymbolKind.Class,
					uri: document.uri,
					range: range,
					selectionRange: range,
				}
			];
			return results;
		},
		async provideTypeHierarchySupertypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[]> {
			console.log("Supertypes", item);
			return [item];

		},
		async provideTypeHierarchySubtypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[]>{
			console.log("Subtypes", item);
			return [item];
		}
	}) : new vscode.Disposable(() => {});

	let prepare = vscode.commands.registerCommand('type-hierarchy-sample.prepare', async (uri: vscode.Uri) => {
		const command: string = await vscode.window.showInputBox({value: "_executePrepareTypeHierarchy"}) || "";
		const position = vscode.window.activeTextEditor?.selection.start;
		const targetUri = uri ?? vscode.window.activeTextEditor?.document.uri;

		try {
			const res = await vscode.commands.executeCommand(command, targetUri, position);
			vscode.window.showInformationMessage(JSON.stringify(res));
		} catch (error) {
			console.log(error)
		}
	});

	context.subscriptions.push(disposable, typeh, prepare);
}

// this method is called when your extension is deactivated
export function deactivate() {}
