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
		async prepareTypeHierarchy(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[] | undefined>{
			console.log("prepare");
			const lineRange = new vscode.Range(position.with(undefined, 0), position.with(position.line + 1, 0));
			const content = document.getText(lineRange);
			const words = content.trim().split(" ").filter(Boolean);
			let offset = 0;
			for (const word of words) {
				offset = content.indexOf(word, offset);
				if (offset <= position.character && position.character < offset + word.length) {
					const range = new vscode.Range(position.with(undefined, offset), position.with(undefined, offset + word.length));
					return [
						{
							name: word,
							kind: vscode.SymbolKind.Class,
							uri: document.uri,
							range: range,
							selectionRange: range,
						}
					];
				}
				offset += word.length;
			}
			return undefined;
		},
		async provideTypeHierarchySupertypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[]> {
			console.log("Supertypes", item);
			const document = await vscode.workspace.openTextDocument(item.uri);
			const position = item.selectionRange.start;
			const newLineNumber = position.line - 1;
			if (newLineNumber < 0) return [];

			const rangeOfTargetLine = new vscode.Range(position.with(newLineNumber, 0), position.with(newLineNumber + 1, 0));
			const contentOfTargetLine = document.getText(rangeOfTargetLine);
			const words = contentOfTargetLine.trim().split(" ").filter(Boolean);
			let ret = [];
			let offset = 0;
			for (const word of words) {
				offset = contentOfTargetLine.indexOf(word, offset);
				const range = new vscode.Range(position.with(newLineNumber, offset), position.with(newLineNumber, offset + word.length));
				ret.push({
					name: word,
					kind: vscode.SymbolKind.Class,
					uri: item.uri,
					range: range,
					selectionRange: range
				});
				offset += word.length;
			}
			return ret;
		},
		async provideTypeHierarchySubtypes(item: vscode.TypeHierarchyItem, token: vscode.CancellationToken): Promise<vscode.TypeHierarchyItem[]>{
			console.log("Subtypes", item);
			const document = await vscode.workspace.openTextDocument(item.uri);
			const position = item.selectionRange.start;
			const newLineNumber = position.line + 1;
			const rangeOfTargetLine = new vscode.Range(position.with(newLineNumber, 0), position.with(newLineNumber + 1, 0));
			const contentOfTargetLine = document.getText(rangeOfTargetLine);
			const words = contentOfTargetLine.trim().split(" ").filter(Boolean);
			let ret = [];
			let offset = 0;
			for (const word of words) {
				offset = contentOfTargetLine.indexOf(word, offset);
				const range = new vscode.Range(position.with(newLineNumber, offset), position.with(newLineNumber, offset + word.length));
				ret.push({
					name: word,
					kind: vscode.SymbolKind.Class,
					uri: item.uri,
					range: range,
					selectionRange: range
				});
				offset += word.length;
			}
			return ret;
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
